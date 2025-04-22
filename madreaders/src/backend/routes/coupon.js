import express from "express";
import { Coupon } from "../Schema.js";

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

// ✅ Validate coupon and log everything
router.get("/validate/:code", async (req, res) => {
  const { code } = req.params;
  console.log("[🔍] Incoming coupon validation request for code:", code);

  try {
    const coupon = await Coupon.findOne({ code });
    console.log("[📦] Fetched coupon from DB:", coupon);

    if (!coupon) {
      console.log("[❌] Coupon not found");
      return res
        .status(404)
        .json({ success: false, message: "Coupon not found" });
    }

    if (coupon.ExpiryDate < new Date()) {
      console.log("[⏰] Coupon expired:", coupon.ExpiryDate);
      return res
        .status(400)
        .json({ success: false, message: "Coupon has expired" });
    }

    if (coupon.UsedCount >= coupon.MaxUses) {
      console.log(
        "[📊] Coupon usage limit reached:",
        coupon.UsedCount,
        "/",
        coupon.MaxUses
      );
      return res
        .status(400)
        .json({ success: false, message: "Coupon usage limit reached" });
    }

    console.log("[✅] Coupon is valid");
    return res.status(200).json({
      success: true,
      discount: {
        value: coupon.DiscountPercentage,
        type: "percentage",
        code: coupon.code,
      },
    });
  } catch (err) {
    console.error("[🔥] Server error during coupon validation:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GET count of all coupons
router.get("/count", async (req, res) => {
  try {
    const count = await Coupon.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
