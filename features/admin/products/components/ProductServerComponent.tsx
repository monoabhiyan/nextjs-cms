import React from "react";
import ProductsDataTable from "./ProductsDataTable";
import getServerQueryClient from "@/lib/react-query/getQueryClient";
import { parseAsJson, parseAsString } from "nuqs/server";

import {
  fetchProductsQuery,
  ProductQueryInput,
} from "@/features/admin/products/action";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { productsQueryKey } from "@/features/admin/products/constants";
import { sortingStateSchema } from "@/features/admin/products/schema";

type ProductServerComponentProps = {
  searchParams?: ProductQueryInput;
};

// Define the Zod schema for sorting state again (or import if shared)
const sortParser = parseAsJson(sortingStateSchema.parse);

type successParsing = string | undefined;

export default async function ProductServerComponent({
  searchParams,
}: ProductServerComponentProps) {
  const queryClient = getServerQueryClient();
  const sort = sortParser
    .withDefault([])
    .parseServerSide(searchParams?.sort as successParsing);
  // const title = parseAsString.withDefault("").parse(searchParams?.title || "");
  // const price = parseAsArrayOf(parseAsString)
  //   .withDefault([])
  //   .parse(searchParams?.price);

  const page = parseAsString
    .withDefault("1")
    .parseServerSide(searchParams?.page as successParsing);

  const perPage = parseAsString
    .withDefault("10")
    .parseServerSide(searchParams?.perPage as successParsing);

  const queryInput: ProductQueryInput = {
    sort,
    perPage,
    page,
  };

  await queryClient.prefetchQuery({
    queryKey: [productsQueryKey, queryInput],
    queryFn: () => fetchProductsQuery(queryInput),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductsDataTable />
    </HydrationBoundary>
  );
}
