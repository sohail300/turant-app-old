// TableComponent.jsx
"use client";

import React, { useContext, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { toast } from "react-toastify";
import { api } from "@/utils/config";
import { Reporter } from "@/lib/interface";
import Loader from "./Loader";
import { LoaderContext } from "@/context/LoaderContext";

export const createColumns = (
  fetchData,
  fetchTotalReporters,
  setIsLoading
): ColumnDef<Reporter>[] => {
  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      const response = await api.delete(
        `/reporter/delete-reporter?reporterId=${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response) {
        toast.success("Reporter deleted successfully");
        fetchData();
        fetchTotalReporters();
      } else {
        toast.error("Error deleting reporter");
      }
    } catch (error) {
      toast.error("Error deleting reporter");
    } finally {
      setIsLoading(false);
    }
  };

  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-lg whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Reporter Name & Photo
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[200px] flex flex-row items-center gap-2">
          <Image
            src={row.original.image}
            width={40}
            height={40}
            alt="photo"
            className="rounded-full"
          />
          {row.getValue("name")}
        </div>
      ),
    },
    {
      accessorKey: "phone",
      header: "Phone Number (+91)",
      cell: ({ row }) => (
        <div className="min-w-[200px]">{row.getValue("phone")}</div>
      ),
    },
    {
      accessorKey: "state",
      header: "State",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("state")}</div>
      ),
    },
    {
      accessorKey: "district",
      header: "District",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("district")}</div>
      ),
    },
    {
      accessorKey: "block",
      header: "Block",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("block")}</div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="min-w-[80px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"ghost"}>
                <Trash2 className="h-4 w-4 cursor-pointer text-red-500" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className="py-8 px-6 space-y-6">
                <div className="flex flex-col text-center font-hind500 text-lg text-brandText">
                  <span>Are you sure,</span>
                  <span className="leading-6">you want to delete?</span>
                </div>
                <div className="flex flex-row gap-4 font-hind500 text-balance">
                  <PopoverClose asChild>
                    <Button
                      variant="outline"
                      className="w-full text-white bg-brandAccent hover:bg-brandAccent/80 hover:text-white border-white px-4"
                      onClick={() => handleDelete(row.original.reporter_id)}
                    >
                      Delete
                    </Button>
                  </PopoverClose>
                  <PopoverClose asChild>
                    <Button
                      variant="outline"
                      className="w-full text-brandAccent border-brandAccent hover:text-brandAccent px-4"
                    >
                      Cancel
                    </Button>
                  </PopoverClose>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      ),
    },
  ];
};

const TableComponent = ({ table }) => {
  // Memoize the pagination state to prevent unnecessary re-renders
  const [currentPage, setCurrentPage] = useState(
    table.getState().pagination.pageIndex
  );
  const pageCount = table.getPageCount();

  // Handle page changes
  const handlePreviousPage = () => {
    if (table.getCanPreviousPage()) {
      table.previousPage();
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (table.getCanNextPage()) {
      table.nextPage();
      setCurrentPage((prev) => prev + 1);
    }
  };

  // Update local state when table state changes
  useEffect(() => {
    setCurrentPage(table.getState().pagination.pageIndex);
  }, [table.getState().pagination.pageIndex]);

  return (
    <>
      <div className="rounded-md border mx-4 table-container">
        <Table>
          <TableHeader className="bg-brandHeader text-brandText font-hind600">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-lg">
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="text-base text-brandText py-4 font-hind400"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4 flex items-center justify-end space-x-2 px-4">
        <div className="text-base text-brandGray font-hind500">
          Page {currentPage + 1} of {pageCount}
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={handlePreviousPage}
          disabled={!table.getCanPreviousPage()}
          className="w-8 h-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleNextPage}
          disabled={!table.getCanNextPage()}
          className="w-8 h-8"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </>
  );
};

export default TableComponent;
