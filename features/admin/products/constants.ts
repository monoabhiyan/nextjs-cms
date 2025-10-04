import { ProductQueryInput } from "@/features/admin/products/action";

export const makeProductQueryKey = (input: ProductQueryInput) => {
  return [
    "products",
    JSON.stringify(input.sort ?? []), // Ensure sort array is serialized
    Number(input.perPage),
    Number(input.page),
  ];
};

export const makeOrdersQueryKey = (input: ProductQueryInput) => {
  return [
    "orders",
    JSON.stringify(input.sort ?? []), // Ensure sort array is serialized
    Number(input.perPage),
    Number(input.page),
  ];
};