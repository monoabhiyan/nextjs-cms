"use client";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import { parseAsString, useQueryState } from "nuqs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productColumns } from "@/features/admin/products/components/ProductsColumns";
import {
  fetchProductsQuery,
  ProductQueryInput,
} from "@/features/admin/products/action";

interface ProductsDataTableProps {
  initialQueryInput: ProductQueryInput;
}

export default function ProductsDataTable({
  initialQueryInput,
}: ProductsDataTableProps) {
  const [title] = useQueryState("title", parseAsString.withDefault(""));
  // const [price] = useQueryState(
  //   "price",
  //   parseAsArrayOf(parseAsString).withDefault([]),
  // );
  //
  // const sortingStateSchema = z.array(
  //   z.object({
  //     id: z.string(),
  //     desc: z.boolean(),
  //   }),
  // );

  const currentQueryInput: ProductQueryInput = {
    title: title || undefined,
  };
  const queryKey = ["products", JSON.stringify(initialQueryInput)];
  const { data } = useSuspenseQuery({
    queryKey: queryKey,
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

  const { table } = useDataTable({
    data,
    columns,
    pageCount: 1,
    initialState: {
      sorting: [{ id: "title", desc: true }],
      columnPinning: { right: ["actions"] },
    },
    getRowId: (row) => row.id.toString(),
  });

  return (
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
  );
}
