import express from 'express';
import {
    addToWishlist,
    removeFromWishlist,
    getWishlist,
    isBookInWishlist
} from '../wishlistOperations.js';

const router = express.Router();

// Add a book to wishlist
router.post('/add', async (req, res) => {
    try {
        const { userID, bookID } = req.body;
        
        if (!userID || !bookID) {
            return res.status(400).json({
                success: false,
                message: 'UserID and BookID are required'
            });
        }

        const result = await addToWishlist(userID, bookID);
        
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

// Remove a book from wishlist
router.delete('/remove', async (req, res) => {
    try {
        const { userID, bookID } = req.body;
        
        if (!userID || !bookID) {
            return res.status(400).json({
                success: false,
                message: 'UserID and BookID are required'
            });
        }

        const result = await removeFromWishlist(userID, bookID);
        
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

// Get user's wishlist
router.get('/:userID', async (req, res) => {
    try {
        const { userID } = req.params;
        
        if (!userID) {
            return res.status(400).json({
                success: false,
                message: 'UserID is required'
            });
        }

        const result = await getWishlist(userID);
        
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

// Check if book is in wishlist
router.get('/check/:userID/:bookID', async (req, res) => {
    try {
        const { userID, bookID } = req.params;
        
        if (!userID || !bookID) {
            return res.status(400).json({
                success: false,
                message: 'UserID and BookID are required'
            });
        }

        const result = await isBookInWishlist(userID, bookID);
        
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