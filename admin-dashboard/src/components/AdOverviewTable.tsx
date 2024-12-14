// TableComponent.jsx
"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ColumnDef, flexRender } from "@tanstack/react-table";
import { Advertiser } from "@/lib/interface";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { formatDate } from "@/lib/extractDate";

export const createColumns = (
  fetchData,
  fetchTotalAds,
  setIsLoading
): ColumnDef<Advertiser>[] => {
  return [
    {
      accessorKey: "company_name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            className="p-0 hover:bg-transparent text-lg whitespace-nowrap"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Advertiser Company Name
            <ChevronDown className="ml-1 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="min-w-[200px]">{row.getValue("company_name")}</div>
      ),
    },
    {
      accessorKey: "start_date",
      header: "Start Date",
      cell: ({ row }) => (
        <div className="min-w-[200px]">
          {/* {formatDate(row.getValue("start_date"))} */}
        </div>
      ),
    },
    {
      accessorKey: "end_date",
      header: "End Date",
      cell: ({ row }) => (
        <div className="min-w-[160px]">
          {/* {formatDate(row.getValue("end_date"))} */}
        </div>
      ),
    },
    {
      accessorKey: "duration",
      header: "Duration",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("duration")} Days</div>
      ),
    },
    {
      accessorKey: "total_views",
      header: "Total Views",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("total_views")}</div>
      ),
    },
    {
      accessorKey: "total_clicks",
      header: "Total Clicks",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("total_clicks")}</div>
      ),
    },
    {
      accessorKey: "target_city",
      header: "Target City",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("target_city")}</div>
      ),
    },
    {
      accessorKey: "target_state",
      header: "Target State",
      cell: ({ row }) => (
        <div className="min-w-[160px]">{row.getValue("target_state")}</div>
      ),
    },
    {
      accessorKey: "cost",
      header: "Cost",
      cell: ({ row }) => (
        <div className="min-w-[160px]">₹{row.getValue("cost")}</div>
      ),
    },
    {
      accessorKey: "detail",
      header: "Detail",
      cell: ({ row }) => (
        <div className="min-w-[160px]">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"ghost"}
                className={`flex flex-row gap-2 items-center py-1 text-base font-hind500 whitespace-nowrap text-brandAccent hover:text-brandAccent`}
              >
                View Details
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <div className=" py-8 px-6 space-y-6">
                <div className=" flex justify-end">
                  <PopoverClose asChild>
                    <Button size={"icon"} variant="ghost" className="w-8 h-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </PopoverClose>
                </div>
                <div>Details of the advertiser</div>
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
