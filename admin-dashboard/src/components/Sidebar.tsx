"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, FileText, PlusCircle, UserCog, LogOut } from "lucide-react";
import Image from "next/image";

const Sidebar = () => {
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

        <hr className="border-brandBorder" />
        {/* Logout Button */}
        <button className="flex items-center w-full px-4 py-3 font-hind500 text-lg text-brandText rounded-lg hover:bg-white">
          <LogOut className="mr-3 h-5 w-5 text-brandText" />
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;
