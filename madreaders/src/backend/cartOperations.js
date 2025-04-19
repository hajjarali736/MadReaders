import { ShoppingCart, Book } from './Schema.js';

/**
 * Add item to cart with stock validation
 * @param {string} userID - User's ID
 * @param {string} bookID - Book's ID
 * @param {number} quantity - Quantity to add
 * @returns {Promise<Object>} Operation result
 */
export const addToCart = async (userID, bookID, quantity) => {
    try {
        // Validate quantity
        if (!quantity || quantity < 1) {
            return {
                success: false,
                message: 'Quantity must be at least 1'
            };
        }

        // Check book stock
        const book = await Book.findOne({ BookID: bookID });
        if (!book) {
            return {
                success: false,
                message: 'Book not found'
            };
        }

        if (book.StockQuantity < quantity) {
            return {
                success: false,
                message: `Only ${book.StockQuantity} copies available`
            };
        }

        // Check if item already in cart
        const existingItem = await ShoppingCart.findOne({ UserID: userID, BookID: bookID });
        
        if (existingItem) {
            // Update quantity if total doesn't exceed stock
            const newQuantity = existingItem.Quantity + quantity;
            if (newQuantity > book.StockQuantity) {
                return {
                    success: false,
                    message: `Cannot add ${quantity} more. Only ${book.StockQuantity - existingItem.Quantity} more available`
                };
            }

            existingItem.Quantity = newQuantity;
            await existingItem.save();
            return {
                success: true,
                message: 'Cart updated successfully',
                data: existingItem
            };
        }

        // Add new item to cart
        const cartItem = new ShoppingCart({
            UserID: userID,
            BookID: bookID,
            Quantity: quantity
        });

        const savedItem = await cartItem.save();
        return {
            success: true,
            message: 'Item added to cart successfully',
            data: savedItem
        };

    } catch (error) {
        return {
            success: false,
            message: 'Failed to add item to cart',
            error: error.message
        };
    }
};

/**
 * Update cart item quantity
 * @param {string} userID - User's ID
 * @param {string} bookID - Book's ID
 * @param {number} quantity - New quantity
 * @returns {Promise<Object>} Operation result
 */
export const updateCartItemQuantity = async (userID, bookID, quantity) => {
    try {
        // Validate quantity
        if (!quantity || quantity < 0) {
            return {
                success: false,
                message: 'Invalid quantity'
            };
        }

        // If quantity is 0, remove item
        if (quantity === 0) {
            return removeFromCart(userID, bookID);
        }

        // Check book stock
        const book = await Book.findOne({ BookID: bookID });
        if (!book) {
            return {
                success: false,
                message: 'Book not found'
            };
        }

        if (book.StockQuantity < quantity) {
            return {
                success: false,
                message: `Only ${book.StockQuantity} copies available`
            };
        }

        // Update cart item
        const updatedItem = await ShoppingCart.findOneAndUpdate(
            { UserID: userID, BookID: bookID },
            { Quantity: quantity },
            { new: true }
        );

        if (!updatedItem) {
            return {
                success: false,
                message: 'Item not found in cart'
            };
        }

        return {
            success: true,
            message: 'Cart updated successfully',
            data: updatedItem
        };

    } catch (error) {
        return {
            success: false,
            message: 'Failed to update cart',
            error: error.message
        };
    }
};

/**
 * Remove item from cart
 * @param {string} userID - User's ID
 * @param {string} bookID - Book's ID
 * @returns {Promise<Object>} Operation result
 */
export const removeFromCart = async (userID, bookID) => {
    try {
        const result = await ShoppingCart.findOneAndDelete({
            UserID: userID,
            BookID: bookID
        });

        if (!result) {
            return {
                success: false,
                message: 'Item not found in cart'
            };
        }

        return {
            success: true,
            message: 'Item removed from cart successfully',
            data: result
        };

    } catch (error) {
        return {
            success: false,
            message: 'Failed to remove item from cart',
            error: error.message
        };
    }
};

/**
 * Get user's cart with book details
 * @param {string} userID - User's ID
 * @returns {Promise<Object>} Cart items with book details
 */
export const getCart = async (userID) => {
    try {
        const cartItems = await ShoppingCart.find({ UserID: userID });
        
        // Get book details for each cart item
        const itemsWithDetails = await Promise.all(
            cartItems.map(async (item) => {
                const book = await Book.findOne({ BookID: item.BookID });
                return {
                    ...item.toObject(),
                    bookDetails: book ? {
                        title: book.title,
                        price: book.Price,
                        stockQuantity: book.StockQuantity
                    } : null
                };
            })
        );

        return {
            success: true,
            message: 'Cart retrieved successfully',
            data: itemsWithDetails
        };

    } catch (error) {
        return {
            success: false,
            message: 'Failed to retrieve cart',
            error: error.message
        };
    }
};

/**
 * Clear user's cart
 * @param {string} userID - User's ID
 * @returns {Promise<Object>} Operation result
 */
export const clearCart = async (userID) => {
    try {
        await ShoppingCart.deleteMany({ UserID: userID });
        return {
            success: true,
            message: 'Cart cleared successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: 'Failed to clear cart',
            error: error.message
        };
    }
}; 