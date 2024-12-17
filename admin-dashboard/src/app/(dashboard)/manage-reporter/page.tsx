"use client";
import React, { useContext, useEffect } from "react";
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
import TableComponent, {
  createColumns,
} from "@/components/ManageReporterTable";
import AddReporter from "@/components/AddReporter";
import { useDebounce } from "use-debounce";
import { toast } from "react-toastify";
import { api } from "@/utils/config";
import Loader from "@/components/Loader";
import { LoaderContext } from "@/context/LoaderContext";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState("");

  const [isAddReporterOpen, setIsAddReporterOpen] = useState(false);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [data, setData] = useState<Reporter[]>([]);
  const [totalReporters, setTotalReporters] = useState(0);

  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [debouncedFilter] = useDebounce(globalFilter, 300);

  const [currentCallTotalReporters, setCurrentCallTotalReporters] = useState(0);

  const fetchTotalReporters = async () => {
    try {
      const response = await api.get("/reporter/total-reporters", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);
      setTotalReporters(response.data.totalReporters);
    } catch (error) {
      console.error("Error fetching reporters:", error);
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchTotalReporters();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        "/reporter/search-reporters",
        {
          identifier: debouncedFilter || "",
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data.users);
      setCurrentCallTotalReporters(response.data.totalReporters);
      setData(response.data.users);
    } catch (error) {
      console.error("Error fetching reporters:", error);
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedFilter]);

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

  const table = useReactTable({
    data,
    columns: createColumns(fetchData, fetchTotalReporters, setIsLoading),
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
            <div className="font-hind400 text-lg text-brandAccent">
              Total Reporter:{" "}
              <span className="font-hind500">{totalReporters}</span>
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
        fetchReporters={fetchData}
        fetchTotalReporters={fetchTotalReporters}
      />
    </div>
  );
};

export default Page;
