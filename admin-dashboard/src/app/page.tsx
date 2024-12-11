"use client";
import React, { useContext, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { api } from "@/utils/config";
import { toast } from "react-toastify";
import { loginSchema } from "@/zod/auth/login";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoaderContext } from "@/context/LoaderContext";
import Loader from "@/components/Loader";

const LoginPage = () => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(LoaderContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const { email, password } = data;
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      if (response) {
        localStorage.setItem("token", response.data.user.accessToken);
        router.push("/user-details");
      } else {
      }
    } catch (error) {
      toast.error("Invalid Email or Password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await api.post("/auth/send-forgot-password-otp", {
        email: "email@emai.as",
      });

      if (response) {
        router.push("/forgot-password");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center min-h-screen w-full">
      <Loader />
      {/* Left section - visible only on desktop */}
      <div className="hidden md:flex min-h-screen w-1/2 bg-brandAccent flex-col items-center justify-center gap-4 p-6 md:p-8">
        <Image src="/icon.png" alt="logo" width={240} height={480} />
        <h2 className="text-white text-center text-5xl font-openSans400">
          खबरें कहीं भी कभी भी
        </h2>
      </div>

      {/* Right section - adapts for mobile */}
      <div className="min-h-screen w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-16 relative bg-brandAccent md:bg-white">
        {/* Login Card */}
        <div className="w-full p-6 rounded-lg bg-white">
          <div className="space-y-6">
            <div className="space-y-2 text-center flex flex-col items-center justify-center">
              {/* Mobile Logo - only visible on mobile */}
              <div className="md:hidden">
                <Image
                  src="/logo-red.png"
                  alt="Turant News"
                  width={120}
                  height={60}
                />
              </div>
              <h1 className="text-2xl md:text-[40px] font-hind700">
                Admin Login
              </h1>
              <p className="text-brandGray text-base md:text-xl font-hind500">
                Welcome back! please enter your detail
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-lg md:text-xl font-hind500 text-brandText"
                >
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  className={`h-11 border rounded px-3 ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-lg md:text-xl font-hind500 text-brandText"
                >
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  className={`h-11 border rounded px-3 ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                  {...register("password")}
                />
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="text-right">
                <span
                  className="text-brandAccent text-base md:text-lg font-hind600 cursor-pointer"
                  onClick={handleForgotPassword}
                >
                  Forgot Password?
                </span>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-brandAccent text-white rounded"
              >
                Log In
              </button>
            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="text-base md:text-xl font-hind400 text-center text-white md:w-1/2 md:justify-self-end md:text-brandText border-t border-brandBorder py-4 fixed bottom-0 left-0 right-0 bg-brandAccent md:bg-transparent">
          Developed by{" "}
          <span className="text-base md:text-xl font-hind500">
            Webyapar Solutions Pvt. Ltd.
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
