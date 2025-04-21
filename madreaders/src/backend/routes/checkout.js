import express from "express";
import { submitOrder } from "../checkoutOperations.js";

const router = express.Router();

router.post("/submit", async (req, res) => {
  const { username, userInfo, couponCode } = req.body;

  if (!username || !userInfo) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields." });
  }

  const result = await submitOrder(username, userInfo, couponCode);
  res.status(result.success ? 200 : 400).json(result);
});

export default router;
