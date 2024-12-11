"use client";
import React, { useContext, useEffect } from "react";
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
import TableComponent, { createColumns } from "@/components/AdOverviewTable";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoaderContext } from "@/context/LoaderContext";
import { useDebounce } from "use-debounce";
import { api } from "@/utils/config";
import { toast } from "react-toastify";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState("");

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [data, setData] = useState<Advertiser[]>([]);
  const [totalAds, setTotalAds] = useState(0);

  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const [debouncedFilter] = useDebounce(globalFilter, 300);

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [currentCallTotalAds, setCurrentCallTotalAds] = useState(0);

  const [timeFilter, setTimeFilter] = useState("active");

  const fetchTotalAds = async () => {
    try {
      const response = await api.get("/ad/total-active-ads", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);
      setTotalAds(response.data.getTotalActiveAds);
    } catch (error) {
      console.error("Error fetching reporters:", error);
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchTotalAds();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { pageIndex, pageSize } = pagination;

      const response = await api.post(
        "/ad/search-ads",
        {
          identifier: debouncedFilter || "",
          timeFilter,
          limit: pageSize,
          offset: pageIndex * pageSize,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const transformedData = response.data.ads.map((ad) => ({
        ...ad,
        total_views: ad._count.ad_views,
        total_clicks: ad._count.ad_clicks,
      }));
      console.log(transformedData);
      setData(transformedData);
      setCurrentCallTotalAds(response.data.totalAds);
    } catch (error) {
      console.error("Error fetching reporters:", error);
      toast.error("Error fetching data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedFilter, pagination, timeFilter]);

  const table = useReactTable({
    data,
    columns: createColumns(fetchData, fetchTotalAds, setIsLoading),
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
    pageCount: Math.ceil(currentCallTotalAds / pagination.pageSize),
    manualPagination: true,
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

  if (isLoading) return <Loader />;

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
              Total Active Ads:{" "}
              <span className=" font-hind500">{totalAds}</span>
            </div>
          </div>

          <div className="w-full sm:hidden">
            <Select value={timeFilter} onValueChange={setTimeFilter}>
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
              value={timeFilter}
              onValueChange={setTimeFilter}
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
