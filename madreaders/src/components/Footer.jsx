import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-[#212e53] text-white py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap justify-between items-center gap-4">
                    <div className="flex items-center space-x-4">
                        <h3 className="text-sm font-bold">MadReaders</h3>
                        <div className="flex space-x-4">
                            <Link to="/" className="text-gray-300 hover:text-white text-xs">
                                Home
                            </Link>
                            <Link to="/contact" className="text-gray-300 hover:text-white text-xs">
                                Contact
                            </Link>
                            <Link to="/faq" className="text-gray-300 hover:text-white text-xs">
                                FAQ
                            </Link>
                        </div>
                    </div>
                    <div className="text-gray-300 text-xs">
                        <span>info@madreaders.com</span>
                    </div>
                </div>
                <div className="mt-2 text-center text-gray-300 text-xs">
                    <p>&copy; {new Date().getFullYear()} MadReaders. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 