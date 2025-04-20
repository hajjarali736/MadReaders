import express from "express";
import { createUser, listUsers } from "../dbOperations.js";

const router = express.Router();

// Create a new user
router.post("/create", async (req, res) => {
  try {
    const result = await createUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// List all users
router.get("/list", async (req, res) => {
  try {
    const users = await listUsers();
    res.status(200).json({
      count: users.length,
      users: users,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
