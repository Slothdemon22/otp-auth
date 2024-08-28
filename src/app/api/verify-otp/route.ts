import User from "../schemas/userSchema";
import dbConnect from "@/utils/dbConnect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        await dbConnect();
        console.log("OTP in body:", body.otp);

        // Find the user by OTP
        const user = await User.findOne({ Otp: body.otp });

        // If the user is not found, return an error response
        if (!user) {
            console.log("User not found");
            return NextResponse.json({ message: "Failed to verify OTP." }, { status: 400 });
        }

        // Check if the OTP has expired
        if (user.OtpExpiry && new Date() > user.OtpExpiry) {
            console.log("OTP has expired");
            return NextResponse.json({ message: "OTP has expired." }, { status: 400 });
        }

        console.log("User found and OTP verified:", user);

        // If OTP is valid and not expired, proceed with your logic (e.g., mark user as verified)
        user.isVerified = true;
        await user.save();

        return NextResponse.json({ message: "OTP verified successfully!" });
    } catch (error: any) {
        console.log("Error verifying OTP:", error);
        return NextResponse.json({ message: "Failed to verify OTP." }, { status: 500 });
    }
}
