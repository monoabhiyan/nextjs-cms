"use client";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import { parseAsJson, parseAsString, useQueryState } from "nuqs";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { productColumns } from "@/features/admin/products/components/ProductsColumns";
import { ProductQueryInput } from "@/features/admin/products/action";
import { useMemo } from "react";
import { sortingStateSchema } from "@/features/admin/products/schema";
import TopLoader from "@/components/TopLoader";
import { makeProductQueryKey } from "@/features/admin/products/constants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { fetchProductsQuery } from "@/features/admin/products/api/products";

export default function ProductsDataTable() {
  // const [price] = useQueryState(
  //   "price",
  //   parseAsArrayOf(parseAsString).withDefault([]),
  // );
  //

  const sortParser = parseAsJson(sortingStateSchema.parse);

  const [sort] = useQueryState("sort", sortParser.withDefault([]));
  const [perPage] = useQueryState(
    "perPage",
    parseAsString.withOptions({ shallow: false }).withDefault("10"),
  );
  const [page] = useQueryState(
    "page",
    parseAsString.withOptions({ shallow: false }).withDefault("1"),
  );

  // this change in currentQueryInput will re fetch the products
  const currentQueryInput: ProductQueryInput = useMemo(() => {
    return {
      sort,
      perPage: perPage.toString(),
      page: page.toString(),
    };
  }, [page, sort, perPage]);

  const queryKey = useMemo(
    () =>
      makeProductQueryKey({
        sort,
        perPage,
        page,
      }),
    [currentQueryInput],
  );
  const { data, isFetching } = useQuery({
    placeholderData: keepPreviousData,
    queryKey,
    // The queryFn is technically optional here if data is always hydrated,
    // but good practice to include for refetching, background updates etc.
    // It should ideally match the server's fetching logic.
    queryFn: () => fetchProductsQuery(currentQueryInput),
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
          <div className="flex items-center gap-2">
            <DataTableToolbar table={table} />
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus /> Product
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Product</DialogTitle>
                  <DialogDescription>
                    Create a product and share details with your customers.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value="Pedro Duarte"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      id="username"
                      value="@peduarte"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
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
