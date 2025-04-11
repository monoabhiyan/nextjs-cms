import React from "react";
import ProductsDataTable from "./ProductsDataTable";
import { Axios } from "@/lib/utils";
import { Product } from "@/features/admin/products/types";

const $fetchProducts = async (inputParams?: unknown) => {
  const { data } = await Axios.get<{ products: Product[] }>(
    `/products?${inputParams}`,
  );
  return data;
};

export default async function ProductServerComponent(queryParams: {
  searchParams?: { [key: string]: string };
}) {
  const inputParams = new URLSearchParams(queryParams?.searchParams).toString();
  const data = await $fetchProducts(inputParams);
  return <ProductsDataTable data={data.products} />;
}
