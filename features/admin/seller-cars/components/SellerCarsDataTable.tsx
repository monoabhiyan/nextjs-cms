"use client";
import * as React from "react";

import { DataTable } from "@/components/data-table";
import { DataTableToolbar } from "@/components/data-table-toolbar";

import { useDataTable } from "@/hooks/use-data-table";

import { parseAsString, useQueryState } from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { productColumns } from "@/features/admin/products/components/ProductsColumns";
import { useMemo } from "react";
import TopLoader from "@/components/TopLoader";
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
import { makeSellerCarsQueryKey } from "@/features/admin/seller-cars/utils";
import { useSellerCarsQuery } from "@/features/admin/seller-cars/hooks/useSellerCarsQuery";

export default function SellerCarsDataTable() {
  const [perPage] = useQueryState(
    "perPage",
    parseAsString.withOptions({ shallow: false }).withDefault("10"),
  );
  const [page] = useQueryState(
    "page",
    parseAsString.withOptions({ shallow: false }).withDefault("1"),
  );

  // this change in currentQueryInput will re fetch the products
  const currentQueryInput = useMemo(() => {
    return {
      perPage: perPage.toString(),
      page: page.toString(),
    };
  }, [page, perPage]);

  const { data, isFetching, error } = useQuery(useSellerCarsQuery(currentQueryInput));

  const columns = React.useMemo(() => productColumns, []);

  const pageCount = useMemo(() => {
    if (!data?.data?.length) return 1;
    const total = data?.meta?.total ?? 0;
    const perPage = parseInt(currentQueryInput.perPage) ?? 0;

    if (total > 0 && perPage > 0) {
      return Math.ceil(total / perPage);
    }

    return 1;
  }, [data?.data?.length, data?.meta?.total, currentQueryInput.perPage]);

  const { table } = useDataTable({
    data: data?.data || [],
    columns,
    pageCount: pageCount,
    initialState: {
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
