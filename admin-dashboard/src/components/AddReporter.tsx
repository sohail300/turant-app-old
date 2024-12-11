// Frontend: React Integration with React Hook Form and Zod
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload, X } from "lucide-react";
import { Button } from "./ui/button";
import { toast } from "react-toastify";
import { api } from "@/utils/config";

const reporterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  state: z.string().min(1, "State is required"),
  district: z.string().min(1, "District is required"),
  block: z.string().min(1, "Block is required"),
});

const AddReporter = ({ isOpen, setIsOpen, fetchReporters }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [states, setStates] = useState([]);

  async function getStates() {
    try {
      const response = await api.get("/reporter/get-states");
      setStates(response.data.states);
    } catch (error) {
      toast.error("Error fetching states");
    }
  }

  useEffect(() => {
    getStates();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(reporterSchema),
  });

  const handleMenuToggle = () => {
    setIsOpen(!isOpen);
    reset();
    setFile(null);
  };

  const onSubmit = async (formData) => {
    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });
    data.append("image", file);

    try {
      setLoading(true);
      const response = await api.post("/reporter/add-reporter", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(response.data);
      if (response) {
        toast.success("Reporter added successfully");
        fetchReporters();
        handleMenuToggle(); // Close the menu
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to add reporter";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
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
    <div
      className={`fixed inset-y-16 right-0 w-1/3 h-screen bg-white z-50 transition-transform duration-300 ease-in-out border-l border-t px-4 border-brandBorder overflow-y-auto pb-16 scroll-smooth add-reporter-scrollbar ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center py-3 border-b">
        <h3 className="text-brandText font-hind500 text-xl">Add Reporter</h3>
        <button onClick={handleMenuToggle} disabled={loading}>
          <X className="w-6 h-6" />
        </button>
      </div>

      <form className="py-4 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="name"
            className="block mb-2 text-brandText font-hind500 text-lg"
          >
            Reporter Name
          </label>
          <input
            type="text"
            id="name"
            {...register("name")}
            className="border rounded px-3 py-2 w-full placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
            placeholder="Enter Reporter Name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block mb-2 text-brandText font-hind500 text-lg">
            Upload Image
          </label>
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8"
            onClick={() => fileInputRef.current.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
            />

            {file ? (
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
                  onClick={() => setFile(null)}
                  className="text-gray-500 hover:text-brandAccent"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-2">
                <Upload className="h-8 w-8 text-brandAccent" />
                <p className="text-brandText font-hind500 text-lg">
                  Drag and drop an image or click to browse
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block mb-2 text-brandText font-hind500 text-lg"
          >
            Phone Number
          </label>
          <div className="flex items-center border rounded">
            <span className="px-3 py-2">+91</span>
            <input
              type="tel"
              id="phone"
              {...register("phone")}
              className="flex-1 border-l px-3 py-2 placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
              placeholder="Enter 10 digit"
            />
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="state"
            className="block mb-2 text-brandText font-hind500 text-lg"
          >
            State
          </label>
          <select
            id="state"
            {...register("state")}
            className="border rounded px-3 py-2 w-full"
          >
            <option value="">Select State</option>
            {states?.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="district"
            className="block mb-2 text-brandText font-hind500 text-lg"
          >
            District
          </label>
          <input
            type="text"
            id="district"
            {...register("district")}
            className="border rounded px-3 py-2 w-full placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
            placeholder="Enter District"
          />
          {errors.district && (
            <p className="text-red-500 text-sm">{errors.district.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="block"
            className="block mb-2 text-brandText font-hind500 text-lg"
          >
            Block
          </label>
          <input
            type="text"
            id="block"
            {...register("block")}
            className="border rounded px-3 py-2 w-full placeholder:font-hind400 placeholder:text-brandBorder placeholder:text-base"
            placeholder="Enter Block"
          />
          {errors.block && (
            <p className="text-red-500 text-sm">{errors.block.message}</p>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            variant="outline"
            className="px-4 text-brandAccent border-brandAccent hover:text-brandAccent"
            onClick={handleMenuToggle}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="px-4 py-2 bg-brandAccent hover:bg-brandAccent/80 text-white"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddReporter;
