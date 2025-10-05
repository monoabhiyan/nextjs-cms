"use client";

import { use, useCallback, useState, useTransition } from "react";
import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { sortingStateSchema } from "@/features/admin/products/schema";
import { ProductsResponse } from "@/features/admin/products/types";
import { Button } from "@/components/ui/button";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
  useProductsMutationQuery,
  useProductsQuery,
} from "@/features/admin/products/hooks/useProductsQuery";
import TopLoader from "@/components/TopLoader";
import { makeProductQueryKey } from "@/features/admin/products/constants";
import { fetchProductsQuery } from "@/features/admin/products/api/products";
import { Input } from "@/components/ui/input";
import { getQueryClient } from "@/lib/react-query/getQueryClient";

export default function OrderClientComponent() {
  const queryClient = getQueryClient();

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

  const [title, setTitle] = useState("");
  const mutation = useMutation(useProductsMutationQuery());
  const onSave = () => {
    mutation.mutate(
      {
        title,
      },
      {
        onSuccess: async (data, variables, onMutateResult, context) => {
          console.log(
            "After mutation success:",
            data,
            variables,
            onMutateResult,
            context,
          );
          await queryClient.invalidateQueries({
            queryKey: useProductsQuery({
              sort,
              page,
              perPage,
            }).queryKey,
          });
          setTitle("");
        },
      },
    );
  };

  return (
    <>
      <TopLoader isLoading={isLoading} />
      <div className="flex gap-2 pb-2">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Button onClick={onSave}>Save</Button>
      </div>
      <div>
        {data?.products.map((product) => (
          <div key={product.id}>{product.title}</div>
        ))}
        <Button onClick={onNextPage}>next page {isPending}</Button>
      </div>
    </>
  );
}
