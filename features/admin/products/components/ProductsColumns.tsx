import React from "react";
import { Column, ColumnDef } from "@tanstack/react-table";
import { Product } from "@/features/admin/products/types";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table-column-header";
import { DollarSign, MoreHorizontal, Text } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export const productColumns: ColumnDef<Product>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    size: 32,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "title",
    accessorKey: "title",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Product["title"]>()}</div>,
    meta: {
      label: "Title",
      placeholder: "Search title...",
      variant: "text",
      icon: Text,
    },
    enableColumnFilter: false,
  },
  {
    id: "price",
    accessorKey: "price",
    header: ({ column }: { column: Column<Product, unknown> }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    cell: ({ cell }) => {
      const price = cell.getValue<Product["price"]>();

      return (
        <div className="flex items-center gap-1">
          <DollarSign className="size-4" />
          {price.toLocaleString()}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: function Cell() {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    size: 32,
  },
];
