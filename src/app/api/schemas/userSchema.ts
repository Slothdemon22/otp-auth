import mongoose, { Schema, Document, model, models } from "mongoose";

export interface IUser extends Document {
    name: string;
    address: string;
    email: string;
    password: string; 
    Otp?: string;
    OtpExpiry?: Date;
    isVerified?: boolean;
}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    Otp: { type: String },
    OtpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
});

// Use consistent model naming
const User = models.authUser || model<IUser>("authUser", userSchema);

export default User;
