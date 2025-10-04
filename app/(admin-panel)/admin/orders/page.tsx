import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import OrderServerComponent from "@/features/admin/orders/components/OrderServerComponent";
import React, { Suspense } from "react";
import ProductsSkeleton from "@/features/admin/products/components/ProductsSkeleton";
import { ProductQueryInput } from "@/features/admin/products/action";

export default async function OrderPage({
  searchParams,
}: {
  searchParams: Promise<ProductQueryInput>;
}) {
  const queryParams = await searchParams;

  return (
    <AdminPanelXSpacer>
      <Suspense fallback={<ProductsSkeleton />}>
        <OrderServerComponent searchParams={queryParams} />
      </Suspense>
    </AdminPanelXSpacer>
  );
}
