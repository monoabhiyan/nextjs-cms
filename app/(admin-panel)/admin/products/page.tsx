import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import React, { Suspense } from "react";
import ProductsSkeleton from "@/features/admin/products/components/ProductsSkeleton";
import ProductServerComponent from "@/features/admin/products/components/ProductServerComponent";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] };
}) {
  const inputQueryParams = await searchParams;
  return (
    <AdminPanelXSpacer>
      <Suspense fallback={<ProductsSkeleton />}>
        <ProductServerComponent searchParams={inputQueryParams} />
      </Suspense>
    </AdminPanelXSpacer>
  );
}
