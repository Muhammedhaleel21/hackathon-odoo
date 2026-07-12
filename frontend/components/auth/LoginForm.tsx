'use client';

import Image from "next/image"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useLogin } from "@/hooks/useLogin";


const LoginForm = () => {

  const loginMutation = useLogin();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    userId: "",
    password: ""
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");

    loginMutation.mutate(
      {
        id: formData.userId,
        password: formData.password,
      },
      {
        onError: (error) => {
          console.log("Mutation error caught:", error);
        },
      }
    );
  };

  return (
    <>
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Image
            src="https://cdn-dev.watermetro.co.in/logo_c478d0c525.png"
            alt="Logo"
            width={150}
            height={100}
            className="mt-2"
            unoptimized
          />

          <h1 className="text-2xl font-bold text-gray-900">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance text-sm text-gray-500">Enter your ID below to login to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">

          <div className="grid gap-2">
            <label htmlFor="userId" className="text-sm font-medium">
              ID
            </label>

            <input
              id="userId"
              type="text"
              className="h-10 rounded-md border border-gray-300 px-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.userId}
              onChange={handleChange}
            />
          </div>

          <div className="grid gap-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className="h-10 w-full rounded-md border border-gray-300 px-3 pr-10 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-500 cursor-pointer"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>

            </div>
          </div>

          {loginMutation.isError && (
            <p className="text-red-500 text-sm">
              {loginMutation.error instanceof Error
                ? loginMutation.error.message
                : 'Login failed. Please check your credentials.'}
            </p>
          )}

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="mt-2 h-10 w-full rounded-md bg-[#2b80ff] text-white text-sm font-medium hover:bg-[#1f6fe0] transition-colors duration-200 cursor-pointer"
          >
            Submit
          </button>

          <div className="text-center">
            <Link
              href="/forgot-password"
              className="text-sm text-[#2b80ff] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

        </form>

      </div>
    </>
  )
}

export default LoginForm