import express from "express";
import {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  isBookInWishlist,
  countWishlist,
} from "../wishlistOperations.js";

const router = express.Router();

// Check if book is in wishlist
router.post("/check", async (req, res) => {
  try {
    const { username, bookID } = req.body;

    if (!username || !bookID) {
      return res.status(400).json({
        success: false,
        message: "Username and BookID are required",
      });
    }

    const result = await isBookInWishlist(username, bookID);
    res.status(200).json({
      success: true,
      isInWishlist: result
    });
  } catch (error) {
    console.error("Error checking wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error checking wishlist status",
      error: error.message,
    });
  }
});

// Add a book to wishlist
router.post("/add", async (req, res) => {
  try {
    const { username, bookID } = req.body;

    if (!username || !bookID) {
      return res.status(400).json({
        success: false,
        message: "Username and BookID are required",
      });
    }

    // First check if the book is already in the wishlist
    const isInWishlist = await isBookInWishlist(username, bookID);
    if (isInWishlist) {
      return res.status(400).json({
        success: false,
        message: "Book is already in wishlist",
      });
    }

    const result = await addToWishlist(username, bookID);
    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error adding to wishlist",
      error: error.message,
    });
  }
});

// Remove a book from wishlist
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
    console.error("Error removing from wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
      error: error.message,
    });
  }
});

// Get user's wishlist
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
    console.error("Error fetching wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
      error: error.message,
    });
  }
});

// Get wishlist count
router.get("/count/:username", async (req, res) => {
  try {
    const { username } = req.params;
    if (!username) {
      return res.status(400).json({
        success: false,
        message: "Username is required",
      });
    }

    const result = await countWishlist(username);
    res.status(result.success ? 200 : 400).json(result);
  } catch (error) {
    console.error("Error counting wishlist:", error);
    res.status(500).json({
      success: false,
      message: "Error counting wishlist items",
      error: error.message,
    });
  }
});

export default router;
