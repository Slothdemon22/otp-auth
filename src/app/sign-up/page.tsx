"use client";
import { Spinner } from "@/components/spinner";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Define Zod schema
const signUpSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  email: z.string().min(1, { message: "Email is required" }).email("Invalid email address"),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type SignUpFormInputs = z.infer<typeof signUpSchema>;

const SignUp = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SignUpFormInputs>({
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUpFormInputs> = async (data) => {
    try {
      setLoading(true);
      setMessage("");

      const res = await axios.post("/api/signup", data);
      console.log("Response:", res.data);

      setMessage("Sign-up successful!");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        setMessage("Failed to sign up.");
      } else {
        console.error("Unexpected error:", error);
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white w-full">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>Please enter your details to sign up.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Name"
                {...register("name")}
                onBlur={() => trigger("name")}
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="address">
                Address
              </label>
              <Input
                id="address"
                type="text"
                placeholder="Address"
                {...register("address")}
                onBlur={() => trigger("address")}
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && (
                <p className="text-red-500 text-sm mt-1">{errors.address?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="Email"
                {...register("email")}
                onBlur={() => trigger("email")}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="password">
                Password
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                {...register("password")}
                onBlur={() => trigger("password")}
                className={errors.password ? "border-red-500" : ""}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password?.message}</p>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button className="w-full p-6" variant={"ghost"} type="submit" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner  />
                </div>
              ) : (
                "Sign Up"
              )}
            </Button>
            {message && <p className="text-sm mt-4">{message}</p>}
          </CardFooter>
          <div className="flex items-center justify-center p-2">
          <Link href="/sign-in">
            <span className="text-blue-500 hover:underline cursor-pointer">Already have an account? Sign In.</span>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default SignUp;
