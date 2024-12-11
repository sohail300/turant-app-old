import type { Metadata } from "next";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LoaderProvider } from "@/context/LoaderContext";

export const metadata: Metadata = {
  title: "Turant Admin Dashboard",
  description: "Turant Admin Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased `}>
        <LoaderProvider>
          {children}
          <ToastContainer />
        </LoaderProvider>
      </body>
    </html>
  );
}
