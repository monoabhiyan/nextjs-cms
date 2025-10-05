import { makeOrdersQueryKey } from "@/features/admin/products/constants";
import {
  AddProductInput,
  ProductQueryInput,
} from "@/features/admin/products/action";
import {
  addProductQuery,
  fetchProductsQuery,
} from "@/features/admin/products/api/products";
import { keepPreviousData } from "@tanstack/react-query";

export function useProductsQuery(input: ProductQueryInput) {
  return {
    placeholderData: keepPreviousData,
    queryKey: makeOrdersQueryKey(input),
    queryFn: () => fetchProductsQuery(input),
  };
}

export function useProductsMutationQuery() {
  return {
    mutationFn: (input: AddProductInput) => addProductQuery(input),
    onError: (error, variables, onMutateResult, context) => {
      // An error happened!
      console.log(
        `rolling back optimistic update with id ${onMutateResult.id}`,
        error,
        variables,
        onMutateResult,
        context,
      );
    },
    onSuccess: (data, variables, onMutateResult, context) => {
      console.log("onSuccess data:", data, variables, onMutateResult, context);
      // Boom baby!
    },
  };
}
