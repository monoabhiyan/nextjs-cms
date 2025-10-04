"use server";

import { z } from "zod";
import {
  Axios,
  hasServerError,
  hasValidationErrors,
  isActionSuccessful,
} from "@/lib/utils"; // Your Axios instance
import { actionClient, ActionError } from "@/lib/auth/actions";
import { sortingStateSchema } from "@/features/admin/products/schema";
import { getProducts } from "@/features/admin/products/api/products";
import { revalidatePath } from "next/cache";

// Define the schema for expected query parameters
// Match the structure used by nuqs and tanstack table sorting
const productQuerySchema = z.object({
  title: z.string().optional(),
  price: z.array(z.string()).optional(), // Assuming price filter allows multiple values
  sort: sortingStateSchema,
  // Add other params like pagination if needed
  page: z.string().optional().default("1"),
  perPage: z.string().optional().default("10"),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
// Define the server action

export const $fetchProductsAction = actionClient
  .schema(productQuerySchema)
  .action(async ({ parsedInput: inputParams }) => {
    try {
      return await getProducts(inputParams);
    } catch (error) {
      console.error("[SERVER ACTION]: Failed to fetch products:", error);
      throw new ActionError("Failed to fetch products.");
    }
  });

export async function revalidateOrders() {
  revalidatePath("/admin/orders");
}
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
