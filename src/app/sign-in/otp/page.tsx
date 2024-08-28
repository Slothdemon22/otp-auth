"use client";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/spinner";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { CardDescription } from "@/components/ui/card";

// Define Zod schema
const otpSchema = z.object({
  otp: z.string().length(6, { message: "OTP must be exactly 6 digits" }),
});

type OTPFormInputs = z.infer<typeof otpSchema>;

export default function Otp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  const { setValue, handleSubmit, formState: { errors } } = useForm<OTPFormInputs>({
    resolver: zodResolver(otpSchema),
  });

  const onChange = (value: string) => {
    setValue("otp", value);
  };

  const onSubmit: SubmitHandler<OTPFormInputs> = async (data) => {
    try {
        setLoading(true);
       // console.log(data.otp)
       const response = await axios.post("/api/verify-otp", {
        otp: data.otp,
      });
      setMessage("OTP verified successfully!");
    } catch (error) {
      setMessage("Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <Card className="w-full max-w-sm p-6 shadow-lg">
        <CardHeader>
          <CardTitle>Enter OTP</CardTitle>
          <CardDescription>We have sent a 6-digit OTP to your email.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <InputOTP maxLength={6} onChange={onChange}>
              <InputOTPGroup >
                <InputOTPSlot index={0} className={errors.otp ? "border-red-500" : ""} />
                <InputOTPSlot index={1} className={errors.otp ? "border-red-500" : ""} />
                <InputOTPSlot index={2} className={errors.otp ? "border-red-500" : ""} />
              </InputOTPGroup>
              <InputOTPSeparator className="mx-2" />
              <InputOTPGroup className="space-x-2">
                <InputOTPSlot index={3} className={errors.otp ? "border-red-500" : ""} />
                <InputOTPSlot index={4} className={errors.otp ? "border-red-500" : ""} />
                <InputOTPSlot index={5} className={errors.otp ? "border-red-500" : ""} />
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && (
              <p className="text-red-500 text-sm mt-1">{errors.otp.message}</p>
            )}
          </CardContent>
          <CardFooter className="flex flex-col items-center space-y-2">
            <Button
              className="w-full p-6"
              variant={"ghost"}
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Spinner />
                </div>
              ) : (
                "Verify OTP"
              )}
            </Button>
            {message && <p className="text-sm mt-4">{message}</p>}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
