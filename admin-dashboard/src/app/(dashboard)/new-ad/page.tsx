"use client";

import { Button } from "@/components/ui/button";
import { CalendarIcon, LayoutDashboard, Upload, X } from "lucide-react";
import React from "react";
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

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

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

  return (
    <div className="bg-white">
      <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="w-full lg:max-w-4xl px-4">
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
              />
            </div>

            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Select Media Type <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Image" />
                </SelectTrigger>
                <SelectContent className=" font-hind500 text-brandText">
                  <SelectItem value="image">Image</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                </SelectContent>
              </Select>
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
                accept="image/*"
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
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6 md:pl-8 md:border-l md:border-brandBorder">
            <div className="space-y-2 flex flex-col">
              <label className="text-brandGray font-hind500 text-lg">
                Start Date <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal")}
                  >
                    {startDate ? (
                      format(startDate, "dd/MM/yyyy")
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
                    className=" bg-white rounded-lg border border-brandBorder"
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2 flex flex-col">
              <label className="text-brandGray font-hind500 text-lg">
                End Date <span className="text-red-500">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn("w-full pl-3 text-left font-normal")}
                  >
                    {endDate ? (
                      format(endDate, "dd/MM/yyyy")
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
                    className=" bg-white rounded-lg border border-brandBorder"
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Duration
              </label>
              <div className="flex relative">
                <Input
                  className="rounded-r-md placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                  placeholder="Enter Duration"
                />
                <div className="absolute right-0 bg-brandHeader px-4 py-0 h-full border border-l-0 rounded-r-md text-brandText font-hind500 text-lg flex justify-center items-center">
                  Days
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Target State <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select"
                    className="placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="state1">State 1</SelectItem>
                  <SelectItem value="state2">State 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Target City <span className="text-red-500">*</span>
              </label>
              <Select>
                <SelectTrigger>
                  <SelectValue
                    placeholder="Select"
                    className="placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="city1">City 1</SelectItem>
                  <SelectItem value="city2">City 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-brandGray font-hind500 text-lg">
                Cost
              </label>
              <div className="flex relative">
                <Input
                  className="rounded-r-md placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base pl-12"
                  placeholder="Enter Amount"
                />
                <div className="absolute left-0 bg-brandHeader px-4 py-0 h-full border border-l-0 rounded-l-md text-brandText font-hind500 text-lg flex justify-center items-center">
                  ₹
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4 mt-8 py-4 border-t border-brandBorder">
          <Button
            variant="outline"
            className="text-brandAccent border-brandAccent"
          >
            Cancel
          </Button>
          <Button className="bg-brandAccent hover:bg-brandAccent/80 text-white">
            Submit
          </Button>
        </div>
      </div>
    </div>
  );
}
