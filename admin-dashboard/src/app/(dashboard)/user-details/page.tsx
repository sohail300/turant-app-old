"use client";
import React, { useContext, useEffect } from "react";
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
import { useDebounce } from "use-debounce";
import { Checkbox } from "@/components/ui/checkbox";
import Navbar from "@/components/Navbar";
import { User } from "@/lib/interface";
import TableComponent from "@/components/UserDetailsTable";
import { toast } from "react-toastify";
import { api } from "@/utils/config";
import { LoaderContext } from "@/context/LoaderContext";
import Loader from "@/components/Loader";
import { createColumns } from "@/components/UserDetailsTable";
import { useRouter } from "next/navigation";

const UserDetailsDashboard = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState("");

  const [isEditEnabled, setIsEditEnabled] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [actionDetails, setActionDetails] = useState({
    violationMessage: "",
    violationpostId: 0,
  });

  const [actionMessage, setActionMessage] = useState({
    violationMessage: "",
    violationpostId: 0,
  });

  const [data, setData] = useState<User[]>([]);
  const [user, setUser] = useState({
    totalUsers: 0,
    totalVerifiedUsers: 0,
  });

  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [debouncedFilter] = useDebounce(globalFilter, 300);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [filterState, setFilterState] = useState({
    active: false,
    3: false,
    7: false,
    permanent: false,
  });

  async function isLoggedIn() {
    try {
      setIsLoading(true);
      const response = await api.get("/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      setIsLoading(false);
      router.push("/");
    }
  }

  useEffect(() => {
    isLoggedIn();
  }, []);

  const fetTotalUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get("/user/total-users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      console.log(response.data);
      setUser(response.data);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetTotalUsers();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { pageIndex, pageSize } = pagination;

      const response = await api.post(
        "/user/search-users",
        {
          identifier: debouncedFilter || "",
          limit: pageSize,
          offset: pageIndex * pageSize,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data.users);
      const { users, totalUsers } = response.data;

      const transformedData = users.map((user) => ({
        ...user,
        totalPosts: user._count.posts, // Extract posts count and assign to totalPosts
      }));
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching reporters:", error);
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedFilter, pagination]);

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
      3: false,
      7: false,
      permanent: false,
    });
  };

  // Filter options array
  const filterOptions = [
    { label: "Active", key: "active" },
    { label: "Temporary Block (3 Days)", key: "3" },
    { label: "Extended Block (10 Days)", key: "7" },
    { label: "Permanent Block", key: "7" },
  ];

  const table = useReactTable({
    data,
    columns: createColumns(
      fetchData,
      setIsLoading,
      isEditEnabled,
      actionDetails,
      setActionDetails,
      actionMessage,
      setActionMessage
    ),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: {
      sorting,
      globalFilter,
      pagination,
    },
    pageCount: Math.ceil(user.totalUsers / pagination.pageSize),
    manualPagination: true,
  });

  if (isLoading) return <Loader />;

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
              <p className="text-brandText text-lg">
                Total Users: {user.totalUsers}
              </p>
              <span className="text-brandBlue text-xl">
                ({user.totalVerifiedUsers} verified)
              </span>
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

            <DropdownMenu open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className={`w-1/2 sm:w-fit flex items-center justify-center gap-2 text-lg ${
                    isFilterOpen ? "bg-brandAccent text-white" : ""
                  }`}
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
