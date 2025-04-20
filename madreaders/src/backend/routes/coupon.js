import express from "express";
import {
  createCoupon,
  listCoupons,
  updateCoupon,
  deleteCoupon,
} from "../dbOperations.js";

const router = express.Router();

// GET active coupons
router.get("/", async (req, res) => {
  try {
    const coupons = await listCoupons();
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create new coupon
router.post("/", async (req, res) => {
  try {
    const coupon = await createCoupon(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PUT update coupon
router.put("/:id", async (req, res) => {
  try {
    const updated = await updateCoupon(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE coupon
router.delete("/:id", async (req, res) => {
  try {
    await deleteCoupon(req.params.id);
    res.json({ message: "Coupon deleted." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
