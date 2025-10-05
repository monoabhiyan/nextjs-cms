import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import ProductsSkeleton from "@/features/admin/products/components/ProductsSkeleton";
import { ProductQueryInput } from "@/features/admin/products/action";
import OrderServerComponent from "@/features/admin/orders/components/OrderServerComponent";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<ProductQueryInput>;
}) {
  const queryParams = await searchParams;
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
