import { makeOrdersQueryKey } from "@/features/admin/products/constants";
import {
  AddProductInput,
  ProductQueryInput,
} from "@/features/admin/products/action";
import {
  addProductQuery,
  fetchProductsQuery, getProducts
} from "@/features/admin/products/api/products";
import { keepPreviousData } from "@tanstack/react-query";

export function useProductsQuery(input: ProductQueryInput) {
  return {
    placeholderData: keepPreviousData,
    queryKey: makeOrdersQueryKey(input),
    queryFn: () => getProducts(input),
  };
}

export function useProductsMutationQuery() {
  return {
    mutationFn: (input: AddProductInput) => addProductQuery(input),
    onError: (
      error: unknown,
      variables: unknown,
      onMutateResult: unknown,
      context: unknown,
    ) => {
      // An error happened!
      console.log(
        `rolling back optimistic update with id ${onMutateResult}`,
        error,
        variables,
        onMutateResult,
        context,
      );
    },
    onSuccess: (
      data: unknown,
      variables: unknown,
      onMutateResult: unknown,
      context: unknown,
    ) => {
      console.log("onSuccess data:", data, variables, onMutateResult, context);
      // Boom baby!
    },
  };
}
