"use client";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productColumns } from "@/features/admin/products/components/ProductsColumns";
import {
  fetchProductsQuery,
  ProductQueryInput,
} from "@/features/admin/products/action";
import { useMemo } from "react";
import { sortingStateSchema } from "@/features/admin/products/schema";
import TopLoader from "@/components/TopLoader";
import { productsQueryKey } from "@/features/admin/products/constants";

export default function ProductsDataTable() {
  // const [price] = useQueryState(
  //   "price",
  //   parseAsArrayOf(parseAsString).withDefault([]),
  // );
  //

  const sortParser = parseAsJson(sortingStateSchema.parse);

  const [sort] = useQueryState("sort", sortParser.withDefault([]));
  const [perPage] = useQueryState("perPage", parseAsString.withDefault("10"));
  const [page] = useQueryState("page", parseAsString.withDefault("1"));

  const currentQueryInput: ProductQueryInput = useMemo(() => {
    return {
      sort,
      perPage: perPage.toString(),
      page: page.toString(),
    };
  }, [page, sort, perPage]);

  // this change in currentQueryInput will re fetch the products
  const queryKey = useMemo(
    () => [productsQueryKey, currentQueryInput],
    [currentQueryInput],
  );

  const { data, isFetching } = useQuery({
    placeholderData: keepPreviousData,
    queryKey,
    // The queryFn is technically optional here if data is always hydrated,
    // but good practice to include for refetching, background updates etc.
    // It should ideally match the server's fetching logic.
    queryFn: async () => fetchProductsQuery(currentQueryInput),
    // Data is provided by hydration initially
    initialData: () => {
      // Access the prefetched data from the cache if needed,
      // but hydration boundary usually handles this.
      // If you passed data directly as a prop: initialData: initialDataProp
      return undefined; // Rely on HydrationBoundary
    },
    staleTime: 60 * 1000, // Match server staleTime or set as needed
  });

  const columns = React.useMemo(() => productColumns, []);

  const pageCount = useMemo(() => {
    if (!data?.products?.length) return 1;
    const total = data.total ?? 0;
    const perPage = parseInt(currentQueryInput.perPage) ?? 0;

    if (total > 0 && perPage > 0) {
      return Math.ceil(total / perPage);
    }

    return 1;
  }, [data?.products?.length, data?.total, currentQueryInput.perPage]);

  const { table } = useDataTable({
    data: data?.products || [],
    columns,
    pageCount: pageCount,
    initialState: {
      sorting: [{ id: "title", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id.toString(),
  });

  return (
    <>
      <TopLoader isLoading={isFetching} />
      <div className="data-table-container">
        <DataTable table={table}>
          <DataTableToolbar table={table}></DataTableToolbar>
        </DataTable>
        {/*<DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableSortList table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>*/}
      </div>
    </>
  );
}
