"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, Upload, X } from "lucide-react";
import React, { useContext, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { PopoverContent } from "@radix-ui/react-popover";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { addAdSchema } from "@/zod/ad/addAd";
import { Form } from "@/components/ui/form";
import { toast } from "react-toastify";
import { api } from "@/utils/config";
import { LoaderContext } from "@/context/LoaderContext";
import Loader from "@/components/Loader";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const { isLoading, setIsLoading } = useContext(LoaderContext);

  async function getStates() {
    try {
      setIsLoading(true);
      const response = await api.get("/reporter/get-states");
      setStates(response.data.states);
    } catch (error) {
      toast.error("Error fetching states");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getStates();
  }, []);

  async function getCities(selectedState) {
    try {
      setIsLoading(true);
      const response = await api.get(
        `/reporter/get-cities?state=${selectedState}`
      );
      setCities(response.data.cities);
    } catch (error) {
      toast.error("Error fetching cities");
    } finally {
      setIsLoading(false);
    }
  }

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm({
    resolver: zodResolver(addAdSchema),
  });

  const onSubmit = async (formData) => {
    console.log(formData);

    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value instanceof Date) {
        console.log(typeof value);
        data.append(key, format(value, "yyyy-MM-dd"));
      } else {
        data.append(key, value);
      }
    });
    data.append("file", file);

    try {
      setIsLoading(true);
      const response = await api.post("/ad/add-ad", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);
      if (response) {
        toast.success("Advertisement added successfully");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add reporter";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      <form
        className="w-full lg:max-w-4xl px-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="space-y-2">
              <label className=" text-brandGray font-hind500 text-lg">
                Advertiser Company Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Enter Company Name"
                className="w-full placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Select Media Type <span className="text-red-500">*</span>
              </label>
              <Controller
                name="media_type"
                control={control}
                rules={{ required: "Media Type is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select"
                        className="placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                      />
                    </SelectTrigger>
                    <SelectContent defaultValue={"Image"}>
                      <SelectItem value="image">Image</SelectItem>
                      <SelectItem value="video">Video</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.media_type && (
                <p className="text-red-500 text-sm">
                  {errors.media_type.message}
                </p>
              )}
            </div>

            <div
              className={`border-2 border-dashed border-gray-300 rounded-lg p-8 transition-colors
              ${!file ? "hover:border-gray-400" : ""}`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                className="hidden"
                accept="image/*,video/*"
              />

              {!file ? (
                <div className="flex flex-col items-center justify-center text-center space-y-2">
                  <p className="text-brandText font-hind500 text-lg">
                    Drag and drop an image or
                  </p>
                  <p className="text-brandText font-hind500 text-lg">
                    browse to upload
                  </p>
                  <Button
                    variant="ghost"
                    className="mt-4 text-brandAccent flex flex-row justify-center items-center font-hind500 text-lg hover:text-brandAccent/80"
                    onClick={handleBrowseClick}
                  >
                    <Upload className="h-8 w-8 text-brandAccent" />
                    Upload
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-white rounded-md">
                      <Upload className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {file.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeFile}
                    className="text-gray-500 hover:text-brandAccent"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Enter Target URL (Link)
              </label>
              <Input
                placeholder="www.company.com"
                className="w-full placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                {...register("target_url")}
              />
              {errors.target_url && (
                <p className="text-red-500 text-sm">
                  {errors.target_url.message}
                </p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 md:pl-8 md:border-l md:border-brandBorder">
            <div className="space-y-2 flex flex-col">
              <label className="text-brandGray font-hind500 text-lg">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Controller
                name="start_date"
                control={control}
                rules={{ required: "Start date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal")}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span className="font-hind400 text-brandBorder text-base">
                            dd/mm/yyyy
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 text-brandText" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        className="bg-white rounded-lg border border-brandBorder"
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.start_date && (
                <p className="text-red-500 text-sm">
                  {errors.start_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2 flex flex-col">
              <label className="text-brandGray font-hind500 text-lg">
                End Date <span className="text-red-500">*</span>
              </label>
              <Controller
                name="end_date"
                control={control}
                rules={{ required: "End date is required" }}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn("w-full pl-3 text-left font-normal")}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
                        ) : (
                          <span className="font-hind400 text-brandBorder text-base">
                            dd/mm/yyyy
                          </span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 text-brandText" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 z-50" align="start">
                      <Calendar
                        className="bg-white rounded-lg border border-brandBorder"
                        mode="single"
                        selected={field.value}
                        onSelect={(date) => field.onChange(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm">
                  {errors.end_date.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Duration
              </label>
              <div className="flex relative">
                <Input
                  {...register("duration")}
                  type="number"
                  className="rounded-r-md placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                  placeholder="Enter Duration"
                />
                <div className="absolute right-0 bg-brandHeader px-4 py-0 h-full border border-l-0 rounded-r-md text-brandText font-hind500 text-lg flex justify-center items-center">
                  Days
                </div>
              </div>
              {errors.duration && (
                <p className="text-red-500 text-sm">
                  {errors.duration.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Target State <span className="text-red-500">*</span>
              </label>

              <Controller
                name="state"
                control={control}
                rules={{ required: "State is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value); // Update form value
                      getCities(value); // Trigger your async function
                    }}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select"
                        className="placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {states?.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.state && (
                <p className="text-red-500 text-sm">{errors.state.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Target City <span className="text-red-500">*</span>
              </label>
              <Controller
                name="city"
                control={control}
                rules={{ required: "City is required" }}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select"
                        className="placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {cities?.map((city) => (
                        <SelectItem value={city} key={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.city && (
                <p className="text-red-500 text-sm">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Cost
              </label>
              <div className="flex relative">
                <Input
                  {...register("cost")}
                  type="number"
                  className="rounded-r-md placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base pl-12"
                  placeholder="Enter Amount"
                />
                <div className="absolute left-0 bg-brandHeader px-4 py-0 h-full border border-l-0 rounded-l-md text-brandText font-hind500 text-lg flex justify-center items-center">
                  ₹
                </div>
              </div>
              {errors.cost && (
                <p className="text-red-500 text-sm">{errors.cost.message}</p>
              )}
            </div>
          </div>

          <div />
          <div className="flex justify-end space-x-4 mt-8 py-4 border-t border-brandBorder">
            <Button
              variant="outline"
              className="text-brandAccent border-brandAccent"
            >
              Cancel
            </Button>
            <Button
              className="bg-brandAccent hover:bg-brandAccent/80 text-white"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
