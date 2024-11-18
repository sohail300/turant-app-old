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
import { User } from "@/lib/interface";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "./ui/label";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-lg whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="min-w-[200px]">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "username",
    header: "User Name",
    cell: ({ row }) => (
      <div className="min-w-[200px]">{row.getValue("username")}</div>
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
    accessorKey: "email",
    header: "Email Id",
    cell: ({ row }) => (
      <div className="min-w-[200px]">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "city",
    header: "City",
    cell: ({ row }) => (
      <div className="min-w-[160px]">{row.getValue("city")}</div>
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
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="min-w-[120px]">
        <span
          className={`py-1 rounded-full text-base font-hind500 whitespace-nowrap ${
            row.original.type === "Basic" ? "text-[#FF8000]" : "text-[#5C76E6]"
          }`}
        >
          {row.original.type}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "followers",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 hover:bg-transparent text-lg whitespace-nowrap"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Followers
          <ChevronDown className="ml-1 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="min-w-[120px]">{row.getValue("followers")}</div>
    ),
  },
  {
    accessorKey: "totalPosts",
    header: "Total Post",
    cell: ({ row }) => (
      <div className="min-w-[120px]">{row.getValue("totalPosts")}</div>
    ),
  },
  {
    accessorKey: "lastPost",
    header: "Last Post",
    cell: ({ row }) => (
      <div className="min-w-[160px]">{row.getValue("lastPost")}</div>
    ),
  },
  {
    accessorKey: "language",
    header: "Language",
    cell: ({ row }) => (
      <div className="min-w-[160px]">{row.getValue("language")}</div>
    ),
  },
  {
    accessorKey: "joinedDate",
    header: "Joined Date",
    cell: ({ row }) => (
      <div className="min-w-[160px]">{row.getValue("joinedDate")}</div>
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="min-w-[160px] flex flex-row justify-between">
        <span
          className={`py-1 rounded-full text-base font-hind500 whitespace-nowrap ${
            row.getValue("action") === "Active"
              ? "text-[#329B15]"
              : "text-[#F54949]"
          }`}
        >
          {row.getValue("action")}
        </span>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className=" py-4 px-6">
              <div className=" flex justify-end">
                <PopoverClose asChild>
                  <Button
                    size={"icon"}
                    variant="ghost"
                    className="w-8 h-8 mb-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </PopoverClose>
              </div>
              <div className=" border-b border-brandBorder pb-4">
                Shubham Kumar (username: shubhamkumar001)
              </div>
              <div className="flex flex-col gap-6 mt-4">
                <div className="flex flex-row justify-between">
                  <div>Message</div>
                  <textarea
                    cols={30}
                    rows={5}
                    className="border border-brandBorder rounded-md"
                  ></textarea>
                </div>
                <div className="flex flex-row justify-between">
                  <div className=" whitespace-nowrap">Post URL</div>
                  <input
                    type="text"
                    size={30}
                    className="border border-brandBorder rounded-md w-[260px]"
                  />
                </div>
                <div>
                  <span>Would you like to delete this post?</span>
                  <RadioGroup
                    defaultValue="yes"
                    className="flex flex-row gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="yes" />
                      <Label
                        htmlFor="yes"
                        className=" font-hind400 text-lg text-brandText"
                      >
                        Yes
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="no" />
                      <Label
                        htmlFor="no"
                        className=" font-hind400 text-lg text-brandText"
                      >
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                  <div className=" border-t border-brandBorder pt-4 mt-4 flex justify-end">
                    <Button className="bg-brandAccent text-white hover:bg-brandAccent/80 hover:text-white">
                      Confirm
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ row }) => (
      <div className="min-w-[160px]">
        {row.getValue("action") !== "Active" && (
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
              <div className=" py-4 px-6">
                <div className=" flex justify-end">
                  <PopoverClose asChild>
                    <Button
                      size={"icon"}
                      variant="ghost"
                      className="w-8 h-8 mb-2"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </PopoverClose>
                </div>
                <div className=" border-b border-brandBorder pb-4">
                  Shubham Kumar (username: shubhamkumar001)
                </div>
                <div className="flex flex-col gap-6 mt-4">
                  <div className="flex flex-row justify-between">
                    <div>Message</div>
                    <textarea
                      cols={30}
                      rows={5}
                      className="border border-brandBorder rounded-md"
                    ></textarea>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className=" whitespace-nowrap">Post URL</div>
                    <input
                      type="text"
                      size={30}
                      className="border border-brandBorder rounded-md w-[260px]"
                    />
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    ),
  },
];

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
