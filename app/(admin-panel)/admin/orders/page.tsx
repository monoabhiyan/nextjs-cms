import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import ProductsSkeleton from "@/features/admin/products/components/ProductsSkeleton";
import { ProductQueryInput } from "@/features/admin/products/action";
import { fetchProductsQuery } from "@/features/admin/products/api/products";
import OrderClientComponent from "@/features/admin/orders/components/OrderClientComponent";
import { parseAsJson, parseAsString } from "nuqs/server";
import { sortingStateSchema } from "@/features/admin/products/schema";
import { QueryClient } from "@tanstack/react-query";
import { makeQueryClient } from "@/lib/react-query/getQueryClient";
import { useProductsQuery } from "@/features/admin/products/hooks/useProductsQuery";
import OrderServerComponent from "@/features/admin/orders/components/OrderServerComponent";

export const dynamic = "force-dynamic";

const sortParser = parseAsJson(sortingStateSchema.parse);
type successParsing = string | undefined;

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<ProductQueryInput>;
}) {
  const queryParams = await searchParams;

  const sort = sortParser
    .withDefault([])
    .parseServerSide(JSON.stringify(queryParams?.sort));

  const page = parseAsString
    .withDefault("1")
    .parseServerSide(queryParams?.page as successParsing);

  const perPage = parseAsString
    .withDefault("10")
    .parseServerSide(queryParams?.perPage as successParsing);

  const queryInput: ProductQueryInput = {
    sort,
    perPage,
    page,
  };

  return (
    <AdminPanelXSpacer>
      <ErrorBoundary fallback={<>error..</>}>
        <Suspense fallback={<ProductsSkeleton />}>
          <OrderServerComponent searchParams={queryParams} />
        </Suspense>
      </ErrorBoundary>
    </AdminPanelXSpacer>
  );
}
