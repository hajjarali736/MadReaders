import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function WishList() {
    // This would typically come from your global state management or API
    const [wishlistItems, setWishlistItems] = useState([]);

    const handleAddToCart = (item) => {
        // TODO: Implement add to cart functionality
        console.log('Adding to cart:', item);
        // Remove from wishlist after adding to cart
        setWishlistItems(wishlistItems.filter(wishItem => wishItem.id !== item.id));
    };

    const handleRemoveFromWishlist = (itemId) => {
        setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    };

    if (wishlistItems.length === 0) {
        return (
            <div className="min-h-screen bg-[#4a919e] pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                        <div className="mb-6">
                            <svg className="mx-auto h-12 w-12 text-[#212e53]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="mt-2 text-xl font-medium text-[#212e53]">Your wishlist is empty</h3>
                        <p className="mt-1 text-sm text-[#212e53]">Browse our collection and add items to your wishlist!</p>
                        <div className="mt-6">
                            <Link
                                to="/books"
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600"
                            >
                                Browse Books
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#4a919e] pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-2xl font-semibold text-[#212e53] mb-6">My Wishlist</h1>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {wishlistItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="p-4">
                                <div className="aspect-w-3 aspect-h-4 mb-4">
                                    <img
                                        src={item.coverImage}
                                        alt={item.title}
                                        className="object-cover w-full h-full rounded-md"
                                    />
                                </div>
                                <h3 className="text-lg font-medium text-[#212e53]">{item.title}</h3>
                                <p className="mt-1 text-sm text-[#212e53]">{item.author}</p>
                                <div className="mt-2 text-lg font-medium text-[#212e53]">${item.price}</div>
                                <div className="mt-4 space-y-2">
                                    <button
                                        onClick={() => handleAddToCart(item)}
                                        className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleRemoveFromWishlist(item.id)}
                                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Remove from Wishlist
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default WishList; 