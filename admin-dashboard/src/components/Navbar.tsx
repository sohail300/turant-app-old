"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import BreadcrumbComponent from "./Breadcrumb";
import { navigation } from "@/lib/navigation";
import formatRoute from "@/lib/formatRoute";

const Navbar = ({ isOpen, setIsOpen }) => {
  const pathname = window.location.pathname;

  // Create a single toggle handler to manage menu state
  const handleMenuToggle = () => {
    setIsOpen((prev) => !prev);
  };
  return (
    <>
      {/* Desktop NavBar */}
      <div className="hidden md:flex flex-row justify-between items-center w-full bg-[#FFF6F6] px-4 py-4 mb-4">
        <div className="text-xl font-hind500 text-brandText">
          {formatRoute(pathname)}
        </div>
        <div className="flex flex-row items-center space-x-2">
          <div className="bg-brandAccent/20 rounded-full p-2">
            <LayoutDashboard className="h-4 w-4" />
          </div>
          <div className="text-lg text-brandText font-hind500">
            Turant Admin Dashboard
          </div>
        </div>
      </div>

      {/* Mobile NavBar */}
      <div className="md:hidden flex flex-row justify-between items-center w-full bg-[#FFF6F6] px-4 py-4 mb-4">
        <BreadcrumbComponent />
        <button onClick={handleMenuToggle} className="flex items-center">
          <Menu className="h-6 w-6 text-brandText" />
        </button>
      </div>

      {/* Mobile Sliding Menu */}
      <div
        className={`
          border-l border-brandBorder
          fixed inset-y-0 right-0 transform md:hidden
          w-64 bg-[#FFF6F6] p-0
          transition-transform duration-300 ease-in-out z-30
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex flex-col h-full">
          <button onClick={handleMenuToggle} className="p-2">
            <X className="h-6 w-6 text-brandText" />
          </button>
          <div className="mb-8">
            <Image
              src="/logo-red.png"
              alt="Turant News"
              width={72}
              height={60}
              className="w-auto h-auto m-auto"
            />
          </div>
          <nav className="flex-1 space-y-1 px-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center px-4 py-3 text-lg rounded-lg font-hind500
                    ${
                      isActive
                        ? "bg-brandAccent/20 text-brandAccent"
                        : "text-brandText hover:bg-white"
                    }
                  `}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? "text-brandAccent" : "text-brandText"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}

            <hr className="border-brandBorder" />
            {/* Logout Button */}
            <button
              onClick={handleMenuToggle} // Close menu when logout is clicked
              className="flex items-center w-full px-4 py-3 font-hind500 text-lg text-brandText rounded-lg hover:bg-white"
            >
              <LogOut className="mr-3 h-5 w-5 text-brandText" />
              Logout
            </button>
          </nav>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={handleMenuToggle}
        />
      )}
    </>
  );
};

export default Navbar;
