"use client";

import { use, useCallback, useTransition } from "react";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { sortingStateSchema } from "@/features/admin/products/schema";
import { ProductsResponse } from "@/features/admin/products/types";
import { Button } from "@/components/ui/button";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useProductsQuery } from "@/features/admin/products/hooks/useProductsQuery";
import TopLoader from "@/components/TopLoader";
import { makeProductQueryKey } from "@/features/admin/products/constants";
import { fetchProductsQuery } from "@/features/admin/products/api/products";

export default function OrderClientComponent() {
  const sortParser = parseAsJson(sortingStateSchema.parse);

  const [sort] = useQueryState("sort", sortParser.withDefault([]));
  const [perPage] = useQueryState(
    "perPage",
    parseAsString.withOptions({ shallow: false }).withDefault("10"),
  );
  const [page, setPage] = useQueryState(
    "page",
    parseAsString.withOptions({ shallow: false }).withDefault("1"),
  );

  const [isPending, startTransition] = useTransition();

  const onNextPage = useCallback(() => {
    startTransition(() => {
      const currentPage = parseInt(page);
      const nextPage = (currentPage + 1).toString();

      setPage(nextPage);
    }); // this fixes multiple api calls
  }, [page, setPage, startTransition]);

  const {
    data,
    isPending: queryPending,
    isFetching,
  } = useQuery(
    useProductsQuery({
      sort,
      page,
      perPage,
    }),
  );

  const isLoading = isPending || queryPending || isFetching;

  return (
    <>
      <TopLoader isLoading={isLoading} />
      <div>
        {data?.products.map((product) => (
          <div key={product.id}>{product.title}</div>
        ))}
        <Button onClick={onNextPage}>next page {isPending}</Button>
      </div>
    </>
  );
}
