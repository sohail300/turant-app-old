"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter, Edit, ChevronDown, Search } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  SortingState,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import { User } from "@/lib/interface";
import TableComponent from "@/components/UserDetailsTable";
import { columns } from "@/components/UserDetailsTable";

const data: User[] = [
  {
    name: "Shubham Kumar",
    username: "shubhamkumar001",
    phone: "9999999999",
    email: "shubham@gmail.com",
    city: "Koderma",
    state: "Jharkhand",
    type: "Basic",
    followers: 900,
    totalPosts: 40,
    lastPost: "20 Oct",
    language: "Hindi",
    joinedDate: "15 Jan 2024",
    action: "Active",
    notes: "",
  },
  {
    name: "Priya Sharma",
    username: "priyasharma123",
    phone: "9876543210",
    email: "priya.s@gmail.com",
    city: "Mumbai",
    state: "Maharashtra",
    type: "Verified",
    followers: 15000,
    totalPosts: 220,
    lastPost: "2 Nov",
    language: "English",
    joinedDate: "3 Mar 2023",
    action: "Temporary Block (3 Days)",
    notes: "Multiple community guidelines violations",
  },
  {
    name: "Rahul Verma",
    username: "rahulv_official",
    phone: "9876123450",
    email: "rahul.verma@yahoo.com",
    city: "Delhi",
    state: "Delhi",
    type: "Verified",
    followers: 25000,
    totalPosts: 180,
    lastPost: "15 Oct",
    language: "Hindi, English",
    joinedDate: "22 Jun 2023",
    action: "Extended Block (10 Days)",
    notes: "Repeated spam activities",
  },
  {
    name: "Anjali Patel",
    username: "anjali_p",
    phone: "9898989898",
    email: "anjali.patel@hotmail.com",
    city: "Ahmedabad",
    state: "Gujarat",
    type: "Basic",
    followers: 450,
    totalPosts: 28,
    lastPost: "1 Nov",
    language: "Gujarati",
    joinedDate: "10 Feb 2024",
    action: "Active",
    notes: "",
  },
];

const UserDetailsDashboard = () => {
  const [isOpen, setIsOpen] = useState("");

  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [filterState, setFilterState] = useState({
    active: false,
    tempBlock: false,
    extBlock: false,
    permBlock: false,
  });

  // Toggle function for checkboxes
  const toggleCheckbox = (key) => {
    setFilterState((prevState) => ({
      ...prevState,
      [key]: !prevState[key],
    }));
  };

  // Clear all filters
  const clearFilters = (e) => {
    e.preventDefault();
    setFilterState({
      active: false,
      tempBlock: false,
      extBlock: false,
      permBlock: false,
    });
  };

  // Filter options array
  const filterOptions = [
    { label: "Active", key: "active" },
    { label: "Temporary Block (3 Days)", key: "tempBlock" },
    { label: "Extended Block (10 Days)", key: "extBlock" },
    { label: "Permanent Block", key: "permBlock" },
  ];

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
      <div className="flex flex-col space-y-2 mb-6">
        <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

        <div className="flex flex-col gap-4 sm:flex-row justify-between items-start xl:items-center w-full px-4">
          <div className="flex flex-col gap-4 xl:flex-row items-start xl:items-center space-x-4 w-full sm:w-fit">
            {/* Search Input Section */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                placeholder="Search by Name or User Name"
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(event.target.value)}
                className="pl-10 w-full sm:w-[300px] border border-gray-300 rounded-md py-2 placeholder-brandGray placeholder:font-hind500 placeholder:text-base"
              />
            </div>

            {/* User Count Section */}
            <div className="flex flex-row items-center space-x-2 whitespace-nowrap font-hind400">
              <p className="text-brandText text-lg">Total Users: 4000</p>
              <span className="text-brandBlue text-xl">(600 verified)</span>
            </div>
          </div>

          <div className="w-full sm:w-fit flex flex-row items-center space-x-4 text-brandText font-hind500">
            <Button
              variant="outline"
              className={`w-1/2 sm:w-fit flex items-center gap-2 text-lg ${
                isEditEnabled
                  ? "bg-brandAccent text-white hover:bg-brandAccent/80 hover:text-white"
                  : ""
              }`}
              onClick={() => setIsEditEnabled((curr) => !curr)}
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-1/2 sm:w-fit flex items-center justify-center gap-2 text-lg"
                >
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full">
                {filterOptions.map((item) => (
                  <DropdownMenuItem
                    key={item.key}
                    onSelect={(e) => e.preventDefault()}
                    className="font-hind400 text-lg text-brandText flex items-center space-x-2 py-2 px-4 w-full"
                  >
                    <Checkbox
                      checked={filterState[item.key]}
                      onCheckedChange={() => toggleCheckbox(item.key)}
                      className="border-brandBorder h-4 w-4 data-[state=checked]:bg-brandAccent data-[state=checked]:border-brandAccent"
                    />

                    <span className="ml-2">{item.label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="w-full flex justify-center text-brandAccent cursor-pointer py-2"
                  onSelect={(e) => clearFilters(e)}
                >
                  Clear Filter
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <TableComponent table={table} />

      {isEditEnabled && (
        <div className="flex flex-row gap-4 mt-4 justify-end px-4">
          <Button
            variant="outline"
            className="border-brandAccent text-brandAccent"
          >
            Cancel
          </Button>
          <Button variant="default" className=" bg-brandAccent text-white">
            Save
          </Button>
        </div>
      )}
    </div>
  );
};

export default UserDetailsDashboard;
