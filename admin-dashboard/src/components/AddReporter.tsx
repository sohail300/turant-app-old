"use client";

import React, { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";

const AddReporter = ({ isOpen, setIsOpen }) => {
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
  };

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
    <>
      {/* Mobile Sliding Menu */}
      <div
        className={`fixed inset-y-16 right-0 w-1/3 h-screen bg-white z-50 transition-transform duration-300 ease-in-out border-l border-t px-4 border-brandBorder overflow-y-auto pb-16 scroll-smooth add-reporter-scrollbar ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center py-3 border-b">
          <h3 className="text-brandText font-hind500 text-xl">Add Reporter</h3>
          <button onClick={handleMenuToggle}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <label
              htmlFor="reporterName"
              className="block mb-2 text-brandText font-hind500 text-lg"
            >
              Reporter Name
            </label>
            <input
              type="text"
              id="reporterName"
              className="border rounded px-3 py-2 w-full placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
              placeholder="Enter Reporter Name"
            />
          </div>

          <div>
            <label className="block mb-2 text-brandText font-hind500 text-lg">
              Upload Image
            </label>
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
          </div>

          <div>
            <label
              htmlFor="phoneNumber"
              className="block mb-2 text-brandText font-hind500 text-lg"
            >
              Phone Number
            </label>
            <div className="flex items-center border rounded">
              <span className="px-3 py-2">+91</span>
              <input
                type="tel"
                id="phoneNumber"
                className="flex-1 border-l px-3 py-2 placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
                placeholder="Enter 10 digit"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="state"
              className="block mb-2 text-brandText font-hind500 text-lg"
            >
              State
            </label>
            <select id="state" className="border rounded px-3 py-2 w-full">
              <option value="Jharkhand">Jharkhand</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="district"
              className="block mb-2 text-brandText font-hind500 text-lg"
            >
              District
            </label>
            <select id="district" className="border rounded px-3 py-2 w-full">
              <option value="Koderma">Koderma</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="block"
              className="block mb-2  text-brandText font-hind500 text-lg"
            >
              Block
            </label>
            <input
              type="text"
              id="block"
              className="border rounded px-3 py-2 w-full placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
              placeholder="Enter Block"
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              className={`px-4 text-brandAccent border-brandAccent hover:text-brandAccent font-hind500 text-base`}
              onClick={handleMenuToggle}
            >
              Cancel
            </Button>
            <Button className="px-4 py-2 bg-brandAccent hover:bg-brandAccent/80 text-white font-hind500 text-base">
              Submit
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddReporter;
