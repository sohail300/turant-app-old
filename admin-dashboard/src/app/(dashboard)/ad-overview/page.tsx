"use client";
import React from "react";
import { Search } from "lucide-react";
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
import { Advertiser } from "@/lib/interface";
import TableComponent from "@/components/AdOverviewTable";
import { columns } from "@/components/AdOverviewTable";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data: Advertiser[] = [
  {
    name: "Tech Solutions Inc.",
    start_date: "04 July 2024",
    end_date: "18 July 2024",
    duration: "30 days",
    total_reach: 10000,
    target_city: "Bangalore",
    target_state: "Karnataka",
    cost: "₹50000",
    detail: "View Details",
  },
  {
    name: "Creative Ads Agency",
    start_date: "04 July 2024",
    end_date: "18 July 2024",
    duration: "31 days",
    total_reach: 15000,
    target_city: "Mumbai",
    target_state: "Maharashtra",
    cost: "₹75000",
    detail: "View Details",
  },
  {
    name: "Innovative Media",
    start_date: "04 July 2024",
    end_date: "18 July 2024",
    duration: "30 days",
    total_reach: 20000,
    target_city: "Delhi",
    target_state: "Delhi",
    cost: "₹100000",
    detail: "View Details",
  },
];

const Page = () => {
  const [isOpen, setIsOpen] = useState("");

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

        <div className="flex flex-col-reverse gap-4 sm:flex-row justify-start items-start px-4">
          {/* Search Input Section */}
          <div className="flex flex-col-reverse sm:flex-col w-full gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Search by Company Name"
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 w-full sm:w-[260px] md:w-[300px] border border-gray-300 rounded-md py-2 placeholder-brandGray placeholder:font-hind500 placeholder:text-base"
              />
            </div>
            <div className=" font-hind400 text-lg text-brandAccent">
              Total Active Ads: <span className=" font-hind500">2</span>
            </div>
          </div>

          <div className="w-full sm:hidden">
            <Select>
              <SelectTrigger
                defaultValue={"active"}
                className="text-brandText font-hind400 text-base placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
              >
                <SelectValue
                  placeholder="Type"
                  defaultValue={"active"}
                  className="text-brandText font-hind400 text-base placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  value="active"
                  className="text-brandText font-hind500 text-base"
                >
                  Active
                </SelectItem>
                <SelectItem
                  value="scheduled"
                  className="text-brandText font-hind500 text-base"
                >
                  Scheduled
                </SelectItem>
                <SelectItem
                  value="past"
                  className="text-brandText font-hind500 text-base"
                >
                  Past
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="hidden sm:block">
            <RadioGroup
              defaultValue="active"
              className="flex flex-row gap-8 border border-brandBorder p-2 px-4 rounded-md"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label
                  htmlFor="active"
                  className=" font-hind400 text-lg text-brandText"
                >
                  Active
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="scheduled" id="scheduled" />
                <Label
                  htmlFor="scheduled"
                  className=" font-hind400 text-lg text-brandText"
                >
                  Scheduled
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="past" id="past" />
                <Label
                  htmlFor="past"
                  className=" font-hind400 text-lg text-brandText"
                >
                  Past
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>

      <TableComponent table={table} />
    </div>
  );
};

export default Page;
