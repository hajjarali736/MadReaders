import express from "express";
import { User } from "../Schema";

const userRoutes = express.Router();

// ➕ Create new user profile
userRoutes.post("/", async (req, res) => {
  try {
    const { Username, Name, Email, PhoneNumber, Address, Role } = req.body;

    if (!Username || !Name || !Email || !PhoneNumber || !Address) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const user = await User.create({
      Username,
      Name,
      Email,
      PhoneNumber,
      Address,
      Role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (err) {
    console.log(err.message);
    res.status(400).json({
      success: false,
      message:
        err.code === 11000 ? "Username or email already exists" : err.message,
    });
  }
});

// 📥 Get all users
userRoutes.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 📄 Get one user by ID
userRoutes.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ✏️ Update user by ID
userRoutes.put("/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// ❌ Delete user by ID
userRoutes.delete("/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 🔍 Check if user is admin by username
userRoutes.get("/is-admin/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ Username: username });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isAdmin = user.Role === "admin";

    res.json({
      success: true,
      isAdmin,
      message: isAdmin ? "User is admin" : "User is not admin",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

export default userRoutes;
