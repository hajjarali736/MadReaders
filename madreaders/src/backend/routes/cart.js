import express from "express";
import {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
  countCartItems,
} from "../cartOperations.js";

const router = express.Router();

// ✅ Add book to cart
router.post("/add", async (req, res) => {
  const { username, bookID, price, quantity } = req.body;

  // Validate all required fields
  if (!username || !bookID || !price || !quantity) {
    return res.status(400).json({
      success: false,
      message:
        "Missing fields: username, bookID, price, and quantity are required",
    });
  }

  // Add or update cart item
  const result = await addToCart(username, bookID, price, quantity);
  res.status(result.success ? 200 : 400).json(result);
});

// ✅ Get all cart items for a user
router.get("/:username", async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  const result = await getCart(username);
  res.status(result.success ? 200 : 400).json(result);
});

// ✅ Update quantity for a specific cart item
router.put("/update", async (req, res) => {
  const { username, bookID, quantity } = req.body;

  if (!username || !bookID || !quantity) {
    return res.status(400).json({
      success: false,
      message: "Missing fields: username, bookID, and quantity are required",
    });
  }

  const result = await updateCartItemQuantity(username, bookID, quantity);
  res.status(result.success ? 200 : 400).json(result);
});

// ✅ Remove a specific item from cart
router.delete("/remove", async (req, res) => {
  const { username, bookID } = req.body;

  if (!username || !bookID) {
    return res.status(400).json({
      success: false,
      message: "Missing fields: username and bookID are required",
    });
  }

  const result = await removeFromCart(username, bookID);
  res.status(result.success ? 200 : 400).json(result);
});

// ✅ Get total count of items in cart
router.get("/count/:username", async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({
      success: false,
      message: "Username is required",
    });
  }

  const result = await countCartItems(username);
  res.status(result.success ? 200 : 400).json(result);
});

export default router;
