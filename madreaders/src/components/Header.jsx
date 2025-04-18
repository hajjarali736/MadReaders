import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Header() {
    const { isAuthenticated, user, signOut } = useAuth();
    const location = useLocation();
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const categories = [
        { name: 'Horror', path: '/category/horror' },
        { name: 'Romance', path: '/category/romance' },
        { name: 'Comedy', path: '/category/comedy' },
        { name: 'Mystery', path: '/category/mystery' },
        { name: 'Science Fiction', path: '/category/scifi' },
        { name: 'Fantasy', path: '/category/fantasy' }
    ];

    return (
        <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
            <nav className="container mx-auto px-4">
                <div className="flex justify-between items-center h-24">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-4xl font-bold text-[#212e53]">
                            MadReaders
                        </Link>
                        <div className="flex space-x-8">
                            <Link to="/" className="text-[#212e53] hover:text-[#212e53] font-medium">
                                Home
                            </Link>
                            <div className="relative">
                                <button 
                                    onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                    className="text-[#212e53] hover:text-[#212e53] font-medium flex items-center"
                                >
                                    Categories
                                    <svg 
                                        className={`w-4 h-4 ml-1 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`}
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                {isCategoriesOpen && (
                                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                        {categories.map((category) => (
                                            <Link
                                                key={category.path}
                                                to={category.path}
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                onClick={() => setIsCategoriesOpen(false)}
                                            >
                                                {category.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <Link to="/contact" className="text-[#212e53] hover:text-[#212e53] font-medium">
                                Contact Us
                            </Link>
                            <Link to="/faq" className="text-[#212e53] hover:text-[#212e53] font-medium">
                                FAQ
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-6">
                        <Link to="/cart" className="relative inline-flex items-center p-2 text-[#212e53] hover:text-[#212e53]">
                            <svg 
                                className="h-6 w-6" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth="2" 
                                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
                                />
                            </svg>
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                0
                            </span>
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link 
                                    to="/wishlist" 
                                    className="relative inline-flex items-center p-2 text-[#212e53] hover:text-[#212e53] font-medium group"
                                >
                                    <svg 
                                        className="h-6 w-6 transition-transform group-hover:scale-110" 
                                        fill={location.pathname === '/wishlist' ? 'currentColor' : 'none'} 
                                        viewBox="0 0 24 24" 
                                        stroke="currentColor"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            strokeWidth="2" 
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
                                        />
                                    </svg>
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                        0
                                    </span>
                                    <span className="sr-only">Wishlist</span>
                                </Link>
                                <div className="relative group">
                                    <button className="flex items-center space-x-2 text-sm focus:outline-none hover:animate-scale-up">
                                        <span className="text-[#212e53]">{user?.given_name || 'User'}</span>
                                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                                            {user?.given_name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    </button>
                                    <div className="hidden group-hover:block absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                                        <Link
                                            to="/wishlist"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            My Wishlist
                                        </Link>
                                        <button
                                            onClick={signOut}
                                            className="block w-full text-left px-4 py-2 text-sm text-[#212e53] hover:bg-gray-100"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex space-x-4">
                                <Link to="/login" className="bg-[#212e53] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a243f]">
                                    Login
                                </Link>
                                <Link to="/signup" className="bg-white text-[#212e53] border border-[#212e53] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#f0f2f5]">
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Header; 