import { makeOrdersQueryKey } from "@/features/admin/products/constants";
import { ProductQueryInput } from "@/features/admin/products/action";
import { fetchProductsQuery } from "@/features/admin/products/api/products";
import { keepPreviousData } from "@tanstack/react-query";

export function useProductsQuery(input: ProductQueryInput) {
  return {
    queryKey: makeOrdersQueryKey(input),
    queryFn: () => fetchProductsQuery(input),
    placeholder: keepPreviousData,
  };
}
