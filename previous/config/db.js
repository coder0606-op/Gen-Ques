import mongoose from "mongoose";


const MONGODB_URI =   process.env.MONGO_URI ||
"mongodb+srv://mrkeshav:keshavmaheshwari@cluster0.qvlon.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
export async function connectDB() {
  try {
    
    await mongoose.connect(MONGODB_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
}
