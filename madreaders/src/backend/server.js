import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRoutes from "./routes/user.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 Hardcoded URI instead of process.env
const MONGO_URI =
  "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";
const PORT = 5000;

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ DB connection error:", err.message));

// ✅ Routes
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🎉 Backend is alive!");
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
