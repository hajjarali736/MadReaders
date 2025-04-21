import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import { User } from "./Schema.js";
import wishlistRoutes from "./routes/wishlist.js";
import cartRoutes from "./routes/cart.js";
import userRoutes from "./routes/userRoutes.js";
import couponRoutes from "./routes/coupon.js";
import contactRoutes from "./routes/contact.js";
import checkoutRoutes from "./routes/checkout.js";

const app = express();
const PORT = 3001;

// 🧠 MongoDB Atlas URI
const MONGO_URI =
  "mongodb+srv://admin:admin@madreaders.dvcyjvw.mongodb.net/?retryWrites=true&w=majority&appName=madreaders";

// ✅ MongoDB connection with dbName explicitly set
mongoose
  .connect(MONGO_URI, {
    dbName: "madreaders",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected to 'madreaders' database"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// Middlewares
app.use(cors());
app.use(express.json());

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

// Route registrations
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/users", userRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/checkout", checkoutRoutes);
// Start server
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
