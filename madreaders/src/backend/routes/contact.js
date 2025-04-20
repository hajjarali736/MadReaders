import express from "express";
import {
  submitContactForm,
  getContactSubmissions,
  updateContactStatus,
} from "../dbOperations.js";

const router = express.Router();

// Submit form
router.post("/", async (req, res) => {
  try {
    const saved = await submitContactForm(req.body);
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all submissions
router.get("/", async (req, res) => {
  try {
    const contacts = await getContactSubmissions();
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update status
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateContactStatus(req.params.id, req.body.Status);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
