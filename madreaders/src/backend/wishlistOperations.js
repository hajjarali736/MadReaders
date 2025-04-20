import { Wishlist } from "./Schema.js";

/**
 * Add a book to user's wishlist
 * @param {string} username - The username of the user
 * @param {string} bookID - The ID of the book to add
 * @returns {Promise<Object>} The created wishlist item
 */
export const addToWishlist = async (username, bookID) => {
  try {
    const wishlistItem = new Wishlist({
      Username: username,
      BookID: bookID,
    });

    const savedItem = await wishlistItem.save();
    return {
      success: true,
      message: "Book added to wishlist successfully",
      data: savedItem,
    };
  } catch (error) {
    if (error.code === 11000) {
      return {
        success: false,
        message: "Book is already in wishlist",
        error: error.message,
      };
    }
    return {
      success: false,
      message: "Failed to add book to wishlist",
      error: error.message,
    };
  }
};

/**
 * Remove a book from user's wishlist
 * @param {string} username - The username of the user
 * @param {string} bookID - The ID of the book to remove
 * @returns {Promise<Object>} Result of the operation
 */
export const removeFromWishlist = async (username, bookID) => {
  try {
    const result = await Wishlist.findOneAndDelete({
      Username: username,
      BookID: bookID,
    });

    if (!result) {
      return {
        success: false,
        message: "Book not found in wishlist",
      };
    }

    return {
      success: true,
      message: "Book removed from wishlist successfully",
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to remove book from wishlist",
      error: error.message,
    };
  }
};

/**
 * Get user's wishlist
 * @param {string} username - The username of the user
 * @returns {Promise<Object>} List of books in user's wishlist
 */
export const getWishlist = async (username) => {
  try {
    const wishlistItems = await Wishlist.find({ Username: username }).sort({
      AddedAt: -1,
    });

    return {
      success: true,
      message: "Wishlist retrieved successfully",
      data: wishlistItems,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to retrieve wishlist",
      error: error.message,
    };
  }
};

/**
 * Check if a book is in user's wishlist
 * @param {string} username - The username of the user
 * @param {string} bookID - The ID of the book to check
 * @returns {Promise<Object>} Result indicating if book is in wishlist
 */
export const isBookInWishlist = async (username, bookID) => {
  try {
    const wishlistItem = await Wishlist.findOne({
      Username: username,
      BookID: bookID,
    });

    return {
      success: true,
      isInWishlist: !!wishlistItem,
      data: wishlistItem,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to check wishlist status",
      error: error.message,
    };
  }
};

export async function countWishlist(username) {
  try {
    const count = await Wishlist.countDocuments({ Username: username });
    return {
      success: true,
      count,
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to count wishlist items",
      error: error.message,
    };
  }
}
