import mongoose from "mongoose";

export default async function dbConnect(): Promise<void> {
    try {
        if (mongoose.connection.readyState >= 1) {
            console.log("Already connected to MongoDB.");
            return;
        }

        const conn = await mongoose.connect(process.env.MONGO_URI!);

        console.log("MongoDB connected");
        // Optional: log connection details if needed
        // console.log(conn);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
}
