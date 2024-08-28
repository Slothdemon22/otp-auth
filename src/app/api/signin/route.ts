import User from "@/app/api/schemas/userSchema";
import dbConnect from "@/utils/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        console.log("Connected to the database");

        const body = await req.json();
        const { email, password } = body;

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit OTP
        console.log("Generated OTP in route:", otp);

        const result = await User.findOneAndUpdate(
            { email: email, password: password },
            {
                Otp: otp,
                OtpExpiry: new Date(Date.now() + 15 * 60 * 1000),
            },
            { new: true } // Return updated document and run validators
        );

        if (result) {
            // console.log("Raw Result:", result);
            // console.log("OTP Field:", result?.Otp);
            // console.log("OTP Expiry Field:", result?.OtpExpiry);
            
            return NextResponse.json({
                success: true,
                status: 200,
                message: "User found and OTP updated successfully",
                otp: result.Otp
            });
        } else {
            console.log("User not found");
            return NextResponse.json({
                success: false,
                status: 404,
                message: "User not found",
            });
        }
    } catch (error) {
        console.error("Error finding or updating user:", error);
        return NextResponse.json({
            success: false,
            status: 500,
            message: "Failed to find or update user",
        });
    }
}
