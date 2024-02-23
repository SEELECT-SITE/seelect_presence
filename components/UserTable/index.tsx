"use client";
import { useIsClient } from "@/hooks/useIsClient";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { productTableColumnsDef } from "./user-table-config";
import axios from "axios";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { MongoDBUser } from "@/app/api/migrateDocument/_dont_route";
import { Skeleton } from "../ui/skeleton";
import useUserPageState from "../UserEditForm/users.store";
import { ModeToggle } from "../ui/mode-toggle";

export function UserTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const { setIsUserFormOpen, setToEditUser } = useUserPageState();

  const { data, isLoading } = useQuery<MongoDBUser[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await axios.get("/api/getUsers", {
        headers: { token: process.env.NEXT_PUBLIC_CRYPTO_KEY },
      });
      return data;
    },
  });

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const table = useReactTable({
    data: data ?? [],
    columns: productTableColumnsDef,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 gap-1">
        <Input
          placeholder="Procure por nome..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex gap-3">
          <ModeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Colunas <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border p-1 hover:shadow-md duration-150 ">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
                <TableHead> Eventos</TableHead>
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {data && table.getRowModel().rows?.length
              ? table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.original.id ?? index}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        onClick={() => {
                          setIsUserFormOpen(true);
                          setToEditUser(row.original);
                        }}
                      >
                        Ver Eventos
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              : !isLoading && (
                  <TableRow>
                    <TableCell
                      colSpan={productTableColumnsDef.length + 1}
                      className="h-16 text-center"
                    >
                      Sem usuarios
                    </TableCell>
                  </TableRow>
                )}
            {isLoading &&
              Array.from({ length: 8 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell
                    colSpan={productTableColumnsDef.length + 1}
                    className="text-center"
                    key={index}
                  >
                    <Skeleton
                      style={{ animationDelay: `${index * 100}ms` }}
                      className="w-full h-10 rounded-sm "
                    />
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Proximo
          </Button>
        </div>
      </div>
    </div>
  );
}

// This is a workaround to avoid rendering the table on the server

export default function UsersTable() {
  const isClient = useIsClient();
  if (!isClient) return null;
  return <UserTable />;
}
