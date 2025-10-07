import { getServerSession } from "next-auth";
import { nextAuthOptions } from "@/lib/nextAuth";
import { redirect } from "next/navigation";
import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import React, { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import SellerCarsServerComponent from "@/features/admin/seller-cars/components/SellerCarsServerComponent";

export default async function SellerCarsPage({
  searchParams,
}: {
  searchParams?: Promise<{}>;
}) {
  const session = await getServerSession(nextAuthOptions);
  if (!session) return redirect("/login");

  const queryParams = await searchParams;

  return (
    <AdminPanelXSpacer>
      <ErrorBoundary fallback={<div>error..</div>}>
        <Suspense fallback={<div>loading....</div>}>
          <SellerCarsServerComponent searchParams={queryParams} />
        </Suspense>
      </ErrorBoundary>
    </AdminPanelXSpacer>
  );
}
