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
const signInSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email("Invalid email address"),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

type SignInFormInputs = z.infer<typeof signInSchema>;

export default function SignIn() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SignInFormInputs>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignInFormInputs> = async (data) => {
    try {
      setLoading(true);
      setMessage("");

      // First, handle sign-up or sign-in
      const res = await axios.post("/api/signin",
        {
        email: data.email,
        password: data.password,
      });
      //console.log("Sign-up Response:", res.data);
      if (res.data.success === false) {
        setMessage(res.data.message);
        return;

      }
      const otp = res.data.otp;
      console.log("OTP:", otp);

   const emailContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: #f9f9f9;">
    <h2 style="color: #4CAF50; text-align: center;">Welcome to Our Platform!</h2>
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Thank you for signing up with us. We are excited to have you on board!
    </p>
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Your One-Time Password (OTP) for verifying your account is:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <span style="display: inline-block; font-size: 24px; color: #333; background-color: #e9ecef; padding: 10px 20px; border-radius: 4px; letter-spacing: 2px;">
        ${otp}
      </span>
    </div>
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Please enter this OTP within the next 10 minutes to complete your registration. 
      <a href="https://otp-auth-1ghn.vercel.app/sign-in/otp" style="color: #007BFF; text-decoration: none;">Click here to enter your OTP</a>.
    </p>
    <p style="color: #999; font-size: 14px; line-height: 1.6; margin-top: 20px;">
      If you did not request this, please ignore this email or contact our support team.
    </p>
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Thank you and welcome again!
    </p>
    <p style="color: #333; font-size: 16px; line-height: 1.6;">
      Best regards,<br/>
      The Team at [Your Company Name]
    </p>
  </div>
`;

      // Then, send an email
      const mailResponse = await axios.post("/api/sendMail", {
        email: data.email,
        subject: "Welcome!",
        content: emailContent,
      });

      setMessage("Sign-up successful and email sent!");
      console.log("Email Response:", mailResponse.data);

    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data || error.message);
        setMessage("Failed to sign up or send email.");
      } else {
        console.error("Unexpected error:", error);
        setMessage("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Please enter your credentials to sign in.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
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
               <Spinner/>
              ) : (
                "Sign In"
              )}
            </Button>
            {message && <p className="text-sm mt-4">{message}</p>}
            <p className="text-sm text-gray-600">Forgot Password?</p>
          </CardFooter>
        </form>

        <div className="flex items-center justify-center p-2">
            <Link href="/sign-up">
            <span className="text-blue-500 hover:underline cursor-pointer">
    Don&apos;t have an account? Sign Up.
  </span>
            </Link>

        </div>
      </Card>
    </div>
  );
}
