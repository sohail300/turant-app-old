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
import { toast } from "react-toastify";
import { api } from "@/utils/config";
import { formatDate } from "@/lib/extractDate";

export const createColumns = (
  fetchData,
  setIsLoading,
  isEditEnabled,
  actionDetails,
  setActionDetails,
  actionMessage,
  setActionMessage,
  setShowDetails
): ColumnDef<User>[] => {
  async function getActionDetails(userId: number) {
    try {
      const response = await api.post(
        "/user/get-action-details",
        {
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setActionDetails(response.data.details);
      console.log(response.data.details);
    } catch (error) {
      console.log(error);
    }
  }

  return [
    {
      accessorKey: "display_name",
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
        <div className="min-w-[200px]">{row.getValue("display_name")}</div>
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
              row.original.follower_count > 2000
                ? "text-[#FF8000]"
                : "text-[#5C76E6]"
            }`}
          >
            {row.original.follower_count > 2000 ? "Verified" : "Basic"}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "follower_count",
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
        <div className="min-w-[120px]">{row.original.follower_count}</div>
      ),
    },
    {
      accessorKey: "totalPosts",
      header: "Total Post",
      cell: ({ row }) => (
        <div className="min-w-[120px]">{row.getValue("totalPosts")}</div>
      ),
    },
    // {
    //   accessorKey: "lastPost",
    //   header: "Last Post",
    //   cell: ({ row }) => (
    //     <div className="min-w-[160px]">{row.getValue("lastPost")}</div>
    //   ),
    // },
    {
      accessorKey: "app_language",
      header: "Language",
      cell: ({ row }) => (
        <div className="min-w-[160px]">
          {row.original.app_language === "hindi" ? "Hindi" : "English"}
        </div>
      ),
    },
    {
      accessorKey: "created_at",
      header: "Joined Date",
      cell: ({ row }) => (
        <div className="min-w-[160px]">
          {formatDate(row.original.created_at)}
        </div>
      ),
    },
    {
      accessorKey: "banTill",
      header: "Action",
      cell: ({ row }) => (
        <div className="min-w-[160px] flex flex-row justify-between">
          <span
            className={`py-1 rounded-full text-base font-hind500 whitespace-nowrap ${
              row.getValue("banTill") === null
                ? "text-[#329B15]"
                : "text-[#F54949]"
            }`}
          >
            {row.getValue("banTill") === null
              ? "Active"
              : row.original.lastBan !== "permanent"
              ? "Temporary Blocked For " + row.original.lastBan + " Days"
              : "Permanent"}
          </span>

          <Popover>
            <PopoverTrigger asChild>
              {isEditEnabled && (
                <Button variant={"ghost"} size={"icon"}>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              )}
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
              // onPointerDownOutside={(e) => {
              //   if (e.target.closest("textarea")) {
              //     e.preventDefault(); // Prevent closing on textarea interaction
              //   }
              // }}
            >
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
                  {row.getValue("display_name")} (username:{" "}
                  {row.getValue("username")})
                </div>
                <div className="flex flex-col gap-6 mt-4">
                  <div className="flex flex-row justify-between gap-4">
                    <div>Message</div>
                    <textarea
                      cols={30}
                      rows={5}
                      className="border border-brandBorder rounded-md"
                      value={actionMessage.violationMessage}
                      onChange={(e) =>
                        setActionMessage((prev) => ({
                          ...prev,
                          violationMessages: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="flex flex-row justify-between gap-4">
                    <div className=" whitespace-nowrap">Post ID</div>
                    <input
                      type="number"
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
          {row.getValue("banTill") && (
            <Button
              variant={"ghost"}
              className={`flex flex-row gap-2 items-center py-1 text-base font-hind500 whitespace-nowrap text-brandAccent hover:text-brandAccent`}
              onClick={async () => {
                console.log("sass");
                const userId = row.original.user_id;
                setShowDetails(true);
                try {
                  const response = await api.post(
                    "/user/get-action-details",
                    {
                      userId,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );

                  console.log(response.data.details);
                  setActionDetails(response.data.details);
                } catch (error) {
                  console.log(error);
                }
              }}
            >
              View Details
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];
};

const TableComponent = ({ table }) => {
  const [currentPage, setCurrentPage] = useState(
    table.getState().pagination.pageIndex
  );

  const pageCount = table.getPageCount();

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
