"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Search, CirclePlus } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Reporter } from "@/lib/interface";
import TableComponent from "@/components/ManageReporterTable";
import { columns } from "@/components/ManageReporterTable";
import AddReporter from "@/components/AddReporter";

const data: Reporter[] = [
  {
    name: "Shubham Kumar",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3i_qZtrjSgoPCyIOywhlX8MKOzRIaQbKU0A&s",
    phone: "9999999999",
    state: "Jharkhand",
    district: "Koderma",
    block: "Jainagar Block Office",
  },
  {
    name: "Rahul Patel",
    image: "/profile.jpg",
    phone: "9999999999",
    state: "Gujarat",
    district: "Ahmedabad",
    block: "Jainagar Block Office",
  },
  {
    name: "Ramesh Kumar",
    image: "/profile.jpg",
    phone: "9999999999",
    state: "Gujarat",
    district: "Ahmedabad",
    block: "Jainagar Block Office",
  },
  {
    name: "Rohit Kumar",
    image: "/profile.jpg",
    phone: "9999999999",
    state: "Gujarat",
    district: "Ahmedabad",
    block: "Jainagar Block Office",
  },
];

const Page = () => {
  const [isOpen, setIsOpen] = useState("");
  const [isAddReporterOpen, setIsAddReporterOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
    },
  });

  return (
    <div className="bg-white">
      <div className="flex flex-col space-y-4 mb-4">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex flex-col gap-4 xs:flex-row justify-between items-start w-full px-4">
          {/* Search Input Section */}
          <div className="flex flex-col w-full gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Search by Reporter Name"
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 w-full xs:w-[300px] border border-gray-300 rounded-md py-2 placeholder-brandGray placeholder:font-hind500 placeholder:text-base"
              />
            </div>
            <div className=" font-hind400 text-lg text-brandAccent">
              Total Reporter: <span className=" font-hind500">2</span>
            </div>
          </div>

          <div className="w-full xs:w-fit flex flex-row items-center space-x-4 text-brandText font-hind500">
            <Button
              variant="outline"
              className={`w-full xs:w-fit flex items-center gap-2 px-6 text-lg font-hind500 text-brandText`}
              onClick={() => setIsAddReporterOpen((curr) => !curr)}
            >
              <CirclePlus className="h-4 w-4" />
              Add
            </Button>
          </div>
        </div>
      </div>

      <TableComponent table={table} />

      <AddReporter
        isOpen={isAddReporterOpen}
        setIsOpen={setIsAddReporterOpen}
      />
    </div>
  );
};

export default Page;
