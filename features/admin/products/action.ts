"use server";

import { z } from "zod";
import {
  Axios,
  hasServerError,
  hasValidationErrors,
  isActionSuccessful,
} from "@/lib/utils"; // Your Axios instance
import { Product } from "@/features/admin/products/types";
import { actionClient, ActionError } from "@/lib/auth/actions";
import {sortingStateSchema} from "@/features/admin/products/components/ProductServerComponent";

// Define the schema for expected query parameters
// Match the structure used by nuqs and tanstack table sorting
const productQuerySchema = z.object({
  title: z.string().optional(),
  price: z.array(z.string()).optional(), // Assuming price filter allows multiple values
  sort: sortingStateSchema,
  // Add other params like pagination if needed
  // page: z.number().optional().default(1),
  // limit: z.number().optional().default(10),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
// Define the server action

export const $fetchProductsAction = actionClient
  .schema(productQuerySchema)
  .action(async ({ parsedInput: inputParams }) => {
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

    const queryString = query.toString();
    console.log("[SERVER ACTION]: Fetching products with query:", queryString); // For debugging
    try {
      // Use your existing Axios instance or fetch logic
      const { data } = await Axios.get<{ products: Product[] }>( // Adjust response type if needed
        `/products?${queryString}`,
      );
      // Consider returning pagination info as well if your API provides it
      return data;
    } catch (error) {
      console.error("[SERVER ACTION]: Failed to fetch products:", error);
      throw new ActionError("Failed to fetch products.");
    }
  });

export const fetchProductsQuery = async (queryInput: ProductQueryInput) => {
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

  return (actionResponse?.data?.products as Product[] | undefined) || [];
};

// export const fetchProductsAction = action(
//   productQuerySchema,
//   async (inputParams) => {
//     // Construct query string from validated inputParams
//     const query = new URLSearchParams();
//
//     if (inputParams.title) {
//       query.set("title_like", inputParams.title); // Adjust param name based on your API (e.g., title_like for partial match)
//     }
//     if (inputParams.price && inputParams.price.length > 0) {
//       inputParams.price.forEach((p) => query.append("price", p)); // Append multiple prices if API supports it
//     }
//     if (inputParams.sort && inputParams.sort.length > 0) {
//       // Assuming API expects _sort=field&_order=asc|desc
//       // Adjust based on your actual API sorting mechanism
//       const sortParam = inputParams.sort[0]; // Example: only handle first sort criteria
//       query.set("_sort", sortParam.id);
//       query.set("_order", sortParam.desc ? "desc" : "asc");
//     }
//     // Add pagination params if needed
//     // query.set("_page", inputParams.page.toString());
//     // query.set("_limit", inputParams.limit.toString());
//
//     const queryString = query.toString();
//     console.log("Fetching products with query:", queryString); // For debugging
//
//     try {
//       // Use your existing Axios instance or fetch logic
//       const { data } = await Axios.get<{ products: Product[] }>( // Adjust response type if needed
//         `/products?${queryString}`,
//       );
//       // Consider returning pagination info as well if your API provides it
//       return { products: data.products };
//     } catch (error: any) {
//       console.error("Failed to fetch products:", error);
//       // Provide a more specific error message if possible
//       return { error: "Failed to fetch products." };
//     }
//   },
// );
