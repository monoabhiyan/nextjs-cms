"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { makeOrdersQueryKey } from "@/features/admin/products/constants";
import { fetchProductsQuery } from "@/features/admin/products/api/products";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { sortingStateSchema } from "@/features/admin/products/schema";
import TopLoader from "@/components/TopLoader";

export default function OrderClientComponent() {
  const sortParser = parseAsJson(sortingStateSchema.parse);

  const [sort] = useQueryState("sort", sortParser.withDefault([]));
  const [perPage] = useQueryState("perPage", parseAsString.withDefault("10"));
  const [page, setPage] = useQueryState("page", parseAsString.withDefault("1"));
  const { data, isFetching } = useQuery({
    placeholderData: keepPreviousData,
    queryKey: makeOrdersQueryKey({
      sort,
      perPage,
      page,
    }),
    queryFn: () =>
      fetchProductsQuery({
        sort,
        perPage,
        page,
      }),
  });
  return (
    <>
      <TopLoader isLoading={isFetching} />
      <div>
        {data?.products.map((product) => (
          <div key={product.id}>{product.title}</div>
        ))}
        <button
          onClick={() => {
            setPage((parseInt(page) + 1).toString());
          }}
        >
          next page
        </button>
      </div>
    </>
  );
}
