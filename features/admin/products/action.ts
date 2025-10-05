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
import {
  addProduct,
  getProducts,
} from "@/features/admin/products/api/products";

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

const addProductSchema = z.object({
  title: z.string().min(1, "Title is required"),
});

export type ProductQueryInput = z.infer<typeof productQuerySchema>;
export type AddProductInput = z.infer<typeof addProductSchema>;
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

export const $addProductAction = actionClient
  .schema(addProductSchema)
  .action(async ({ parsedInput: input }) => {
    try {
      return await addProduct(input);
    } catch (error) {
      console.error("[SERVER ACTION]: Failed to add product:", error);
      throw new ActionError("Failed to add product");
    }
  });
