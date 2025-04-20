import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";

// Initialize mongoose connection
let isConnected = false;

const connectDB = async () => {
  try {
    if (isConnected) {
      console.log("✅ MongoDB already connected");
      return;
    }

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
