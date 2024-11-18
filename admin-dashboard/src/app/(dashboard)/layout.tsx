import Sidebar from "@/components/Sidebar";
import React from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative">
      <div className=" absolute top-0 left-0 hidden lg:flex">
        <Sidebar />
      </div>
      <div className=" lg:ml-60">{children}</div>
    </div>
  );
}
