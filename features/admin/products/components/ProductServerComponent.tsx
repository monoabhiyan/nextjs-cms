import React from "react";
import ProductsDataTable from "./ProductsDataTable";
import getServerQueryClient from "@/lib/react-query/getQueryClient";
import { parseAsString } from "nuqs/server";
import {
  fetchProductsQuery,
  ProductQueryInput,
} from "@/features/admin/products/action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
// import { z } from "zod";

type ProductServerComponentProps = {
  searchParams?: ProductQueryInput;
};

// Define the Zod schema for sorting state again (or import if shared)
// const sortingStateSchema = z.array(
//   z.object({
//     id: z.string(),
//     desc: z.boolean(),
//   }),
// );
// const sortParser = parseAsJson(sortingStateSchema.parse);

export default async function ProductServerComponent({
  searchParams,
}: ProductServerComponentProps) {
  const queryClient = getServerQueryClient();

  const title = parseAsString.withDefault("").parse(searchParams?.title || "");
  // const price = parseAsArrayOf(parseAsString)
  //   .withDefault([])
  //   .parse(searchParams?.price);
  // const sort = sortParser.withDefault([]).parse(searchParams?.sort);

  const queryInput: ProductQueryInput = {
    title: title || undefined,
  };

  const queryKey = ["products", JSON.stringify(queryInput)];

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchProductsQuery(queryInput),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsDataTable initialQueryInput={queryInput} />
    </HydrationBoundary>
  );
}
