"use client";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import {
  parseAsArrayOf,
  parseAsJson,
  parseAsString,
  useQueryState,
} from "nuqs";

import { z } from "zod";
import { productColumns } from "@/features/admin/products/components/ProductsColumns";
import { Product } from "@/features/admin/products/types";

export default function ProductsDataTable({ data }: { data: Product[] }) {
  const [title] = useQueryState("title", parseAsString.withDefault(""));
  const [price] = useQueryState(
    "price",
    parseAsArrayOf(parseAsString).withDefault([]),
  );

  const sortingStateSchema = z.array(
    z.object({
      id: z.string(),
      desc: z.boolean(),
    }),
  );

  // Define the parser for SortingState (JSON array)
  const sortParser = parseAsJson(sortingStateSchema.parse);
  const [sort] = useQueryState("sort", sortParser.withDefault([]));

  // Ideally we would filter the data server-side, but for the sake of this example, we'll filter the data client-side
  const filteredData = React.useMemo(() => {
    return data.filter((product) => {
      const matchesTitle =
        title === "" ||
        product.title.toLowerCase().includes(title.toLowerCase());
      const matchesPrice =
        price.length === 0 || price.includes(product.price.toString());

      console.log({
        sort,
      });

      return matchesTitle && matchesPrice;
    });
  }, [title, price]);

  const columns = React.useMemo(() => productColumns, []);

  const { table } = useDataTable({
    data: filteredData,
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
