import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isBookInWishlist,
} from "../wishlistOperations.js";

const router = express.Router();

// ✅ Add a book to wishlist
router.post("/add", async (req, res) => {
  try {
    const { username, bookID } = req.body;

    if (!username || !bookID) {
      return res.status(400).json({
        success: false,
        message: "Username and BookID are required",
      });
    }

    const result = await addToWishlist(username, bookID);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ✅ Remove a book from wishlist
router.delete("/remove", async (req, res) => {
  try {
    const { username, bookID } = req.body;

    if (!username || !bookID) {
      return res.status(400).json({
        success: false,
        message: "Username and BookID are required",
      });
    }

    const result = await removeFromWishlist(username, bookID);
    res.status(result.success ? 200 : 404).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ✅ Get user's wishlist
router.get("/:username", async (req, res) => {
  try {
    const { username } = req.params;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const result = await getWishlist(username);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// ✅ Check if book is in wishlist
router.get("/check/:username/:bookID", async (req, res) => {
  try {
    const { username, bookID } = req.params;

    if (!username || !bookID) {
      return res.status(400).json({
        success: false,
        message: "Username and BookID are required",
      });
    }

    const result = await isBookInWishlist(username, bookID);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

export default router;
