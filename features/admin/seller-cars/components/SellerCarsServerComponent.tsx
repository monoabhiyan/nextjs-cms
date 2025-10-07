import React from "react";
import SellerCarsDataTable from "./SellerCarsDataTable";
import { parseAsString } from "nuqs/server";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/react-query/getQueryClient";
import { useSellerCarsQuery } from "@/features/admin/seller-cars/hooks/useSellerCarsQuery";

type SellerCarsServerComponentProps = {
  searchParams?: { page: string; perPage: number };
};

type successParsing = string | undefined;

export default async function SellerCarsServerComponent({
  searchParams,
}: SellerCarsServerComponentProps) {
  const page = parseAsString
    .withDefault("1")
    .parseServerSide(searchParams?.page as successParsing);

  const perPage = parseAsString
    .withDefault("10")
    .parseServerSide(searchParams?.perPage as successParsing);

  const queryInput = {
    perPage,
    page,
  };

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(useSellerCarsQuery(queryInput));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SellerCarsDataTable />
    </HydrationBoundary>
  );
}
