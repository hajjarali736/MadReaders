import express from 'express';
import {
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    getCart,
    clearCart
} from '../cartOperations.js';

const router = express.Router();

// Add item to cart
router.post('/add', async (req, res) => {
    try {
        const { userID, bookID, quantity } = req.body;
        
        if (!userID || !bookID || !quantity) {
            return res.status(400).json({
                success: false,
                message: 'UserID, BookID, and quantity are required'
            });
        }

        const result = await addToCart(userID, bookID, parseInt(quantity));
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Update cart item quantity
router.put('/update', async (req, res) => {
    try {
        const { userID, bookID, quantity } = req.body;
        
        if (!userID || !bookID || quantity === undefined) {
            return res.status(400).json({
                success: false,
                message: 'UserID, BookID, and quantity are required'
            });
        }

        const result = await updateCartItemQuantity(userID, bookID, parseInt(quantity));
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Remove item from cart
router.delete('/remove', async (req, res) => {
    try {
        const { userID, bookID } = req.body;
        
        if (!userID || !bookID) {
            return res.status(400).json({
                success: false,
                message: 'UserID and BookID are required'
            });
        }

        const result = await removeFromCart(userID, bookID);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(404).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Get user's cart
router.get('/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        
        if (!userID) {
            return res.status(400).json({
                success: false,
                message: 'UserID is required'
            });
        }

        const result = await getCart(userID);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

// Clear user's cart
router.delete('/clear/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        
        if (!userID) {
            return res.status(400).json({
                success: false,
                message: 'UserID is required'
            });
        }

        const result = await clearCart(userID);
        
        if (result.success) {
            res.status(200).json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

export default router; 