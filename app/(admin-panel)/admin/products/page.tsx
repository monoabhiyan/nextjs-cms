import AdminPanelXSpacer from "@/app/(admin-panel)/admin/AdminPanelXSpacer";
import { Axios } from "@/lib/utils";
import { Suspense } from "react";

const Products = async () => {
  const { data } = await Axios.get("/products");
  return <code>{JSON.stringify(data, null, 2)}</code>;
};

export default async function ProductsPage() {
  return (
    <AdminPanelXSpacer>
      <Suspense fallback={<div>Loading...</div>}>
        <Products />
      </Suspense>
    </AdminPanelXSpacer>
  );
}
