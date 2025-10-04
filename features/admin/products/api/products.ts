import { Axios, hasServerError, hasValidationErrors, isActionSuccessful } from "@/lib/utils";
import { ProductsResponse } from "@/features/admin/products/types";
import { $fetchProductsAction, ProductQueryInput } from "@/features/admin/products/action";
import { ActionError } from "@/lib/auth/actions";

export const getProducts = async (inputParams: ProductQueryInput) => {
  const query = new URLSearchParams();
  if (inputParams.title) {
    query.set("title_like", inputParams.title); // Adjust param name based on your API (e.g., title_like for partial match)
  }
  if (inputParams.price && inputParams.price.length > 0) {
    inputParams.price.forEach((p) => query.append("price", p)); // Append multiple prices if API supports it
  }
  if (inputParams.sort && inputParams.sort.length > 0) {
    // Assuming API expects _sort=field&_order=asc|desc
    // Adjust based on your actual API sorting mechanism
    const sortParam = inputParams.sort[0]; // Example: only handle first sort criteria
    query.set("sortBy", sortParam.id);
    query.set("order", sortParam.desc ? "desc" : "asc");
  }

  if (inputParams.perPage) {
    query.set("limit", inputParams.perPage);
  }

  if (inputParams.page) {
    // Default page is 1, so skip should be 0 for first page
    const currentPage = parseInt(inputParams.page, 10) || 1;
    const recordsPerPage = parseInt(inputParams.perPage, 10) || 10;

    // Skip = (page - 1) * limit
    const skip = (currentPage - 1) * recordsPerPage;
    query.set("skip", skip.toString());
  }

  const queryString = query.toString();

  console.log(queryString, 'queryString');

  const { data } = await Axios.get<ProductsResponse>( // Adjust response type if needed
    `/products?${queryString}`,
  );
  // Consider returning pagination info as well if your API provides it
  return data;
};

export const fetchProductsQuery = async (
  queryInput: ProductQueryInput,
): Promise<ProductsResponse> => {
  console.log("[SERVER ACTION]: Prefetching with input:", queryInput);
  const actionResponse = await $fetchProductsAction(queryInput);

  if (!isActionSuccessful(actionResponse)) {
    if (hasValidationErrors(actionResponse)) {
      console.log("validation error:", actionResponse?.validationErrors);
      throw new ActionError(String(actionResponse?.validationErrors));
    }
    if (hasServerError(actionResponse)) {
      console.log("server error:", actionResponse?.serverError);
      throw new ActionError(
        actionResponse?.serverError ?? "Something went wrong",
      );
    }
  }

  return (actionResponse?.data as ProductsResponse) || [];
};