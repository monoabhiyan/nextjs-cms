"use client";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productColumns } from "@/features/admin/products/components/ProductsColumns";
import {
  fetchProductsQuery,
  ProductQueryInput,
} from "@/features/admin/products/action";
import { z } from "zod";
import { useEffect } from "react";
import { getQueryClient } from "@/lib/react-query/QueryProviders";
import { productsQueryKey } from "@/features/admin/products/constants";

export default function ProductsDataTable() {
  const queryClient = getQueryClient();
  // const [price] = useQueryState(
  //   "price",
  //   parseAsArrayOf(parseAsString).withDefault([]),
  // );
  //
  const sortingStateSchema = z.array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    }),
  );

  const sortParser = parseAsJson(sortingStateSchema.parse);

  const [sort] = useQueryState("sort", sortParser.withDefault([]));
  const [perPage] = useQueryState("perPage", parseAsString.withDefault("10"));

  const currentQueryInput: ProductQueryInput = {
    sort,
    perPage: perPage.toString(),
  };

  const { data } = useSuspenseQuery({
    queryKey: productsQueryKey,
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

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ["products"],
    });
  }, [currentQueryInput, queryClient]);

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
