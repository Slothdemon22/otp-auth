import mongoose from "mongoose";
import User from "@/app/api/schemas/userSchema";  // Ensure this path is correct
import dbConnect from "@/utils/dbConnect";
import { NextResponse, NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Connect to the database
        console.log("Connected to the database");
        await dbConnect();

        // Parse the request body
        const body = await req.json();
        const { name, address, email, password } = body;

        // Create a new user document
        const user = new User({
            name,
            address,
            email,
            password,
            isVerified: false,
        });

        // Save the user to the database
        await user.save();

        // Return a response
        return NextResponse.json({
            success: true,
            status: 200,
            message: "User created successfully",
        });
    } catch (error) {
        console.error("Error creating user:", error);

        return NextResponse.json({
            success: false,
            status: 500,
            message: "Failed to create user",
        });
    }
}
