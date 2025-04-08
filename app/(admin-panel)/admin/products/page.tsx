import AdminPanelXSpacer from "@/features/admin/components/AdminPanelXSpacer";
import { Axios } from "@/lib/utils";
import { Suspense } from "react";
import ProductsSkeleton from "@/features/admin/products/components/ProductsSkeleton";

type Product = {
  id: number;
  name: string;
  price: number;
}

const Products = async () => {
  const { data } = await Axios.get<Product[]>("/products");
  return <code>{JSON.stringify(data, null, 2)}</code>;
};

export default async function ProductsPage() {
  return (
    <AdminPanelXSpacer>
      <Suspense fallback={<ProductsSkeleton />}>
        <Products />
      </Suspense>
    </AdminPanelXSpacer>
  );
}
