import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { User } from "./Schema.js";
import wishlistRoutes from "./routes/wishlist.js";
import cartRoutes from "./routes/cart.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// 🧠 Hardcoded URI instead of process.env
const MONGO_URI =
  "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";
const PORT = process.env.PORT || 3001;

//CONNECT TO MONGO DB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Sample route to test user creation
app.post("/api/users", async (req, res) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Wishlist routes
app.use("/api/wishlist", wishlistRoutes);

// Cart routes
app.use("/api/cart", cartRoutes);

// User routes
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
