import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import React, { Suspense } from "react";
import ProductsSkeleton from "@/features/admin/products/components/ProductsSkeleton";
import ProductServerComponent from "@/features/admin/products/components/ProductServerComponent";
import { ProductQueryInput } from "@/features/admin/products/action";
import { ErrorBoundary } from "react-error-boundary";

type PageProps = {
  searchParams?: Promise<ProductQueryInput>;
};

export default async function ProductsPage(props: PageProps) {
  const inputQueryParams = await props?.searchParams;
  return (
    <AdminPanelXSpacer>
      <ErrorBoundary fallback={<>error....</>}>
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductServerComponent searchParams={inputQueryParams} />
        </Suspense>
      </ErrorBoundary>
    </AdminPanelXSpacer>
  );
}
