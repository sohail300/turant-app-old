"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, PlusCircle, UserCog, LogOut } from "lucide-react";
import Image from "next/image";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { PopoverClose } from "@radix-ui/react-popover";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navigation = [
    {
      name: "User Details",
      href: "/user-details",
      icon: Users,
      current: true,
    },
    {
      name: "Ad Overview",
      href: "/ad-overview",
      icon: FileText,
      current: false,
    },
    {
      name: "New Ad",
      href: "/new-ad",
      icon: PlusCircle,
      current: false,
    },
    {
      name: "Manage Reporter",
      href: "/manage-reporter",
      icon: UserCog,
      current: false,
    },
  ];

  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      router.push("/");
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col h-screen w-60 bg-[#FFF6F6] border-r border-gray-200">
      {/* Logo */}
      <div className="p-6 m-auto">
        <Image
          src="/logo-red.png"
          alt="Turant News"
          width={80}
          height={60}
          className="w-auto h-auto"
        />
      </div>

      {/* Navigation */}
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

        <div className=" h-[16px] border-b border-brandBorder"></div>
        <div className=" h-[12px]"></div>

        {/* Logout Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"ghost"}
              className="font-hind500 text-lg text-brandText flex justify-start items-center hover:bg-white w-full px-4 py-6"
            >
              <LogOut className="mr-2 h-5 w-5 text-brandText" />
              Logout
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className=" py-8 px-6 space-y-6">
              <div className="flex flex-col text-center font-hind500 text-lg text-brandText">
                <span>Are your sure,</span>
                <span className=" leading-6">you want to logout?</span>
              </div>
              <div className=" flex flex-row gap-4 font-hind500 text-balance">
                <PopoverClose asChild>
                  <Button
                    variant="outline"
                    className="w-full text-white bg-brandAccent hover:bg-brandAccent/80 hover:text-white border-white px-4"
                    onClick={() => handleLogout()}
                  >
                    Log Out
                  </Button>
                </PopoverClose>
                <PopoverClose asChild>
                  <Button
                    variant="outline"
                    className="w-full text-brandAccent border-brandAccent hover:text-brandAccent px-4"
                  >
                    Cancel
                  </Button>
                </PopoverClose>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </nav>
    </div>
  );
};

export default Sidebar;
