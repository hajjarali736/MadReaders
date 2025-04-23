import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
// import { useWishlist } from "../context/WishlistContext";
import { FaSearch } from "react-icons/fa";

function Header() {
  const { isAuthenticated, user, signOut } = useAuth();
  // const { cartCount } = useCart();
  const cartCount = 1;
  // const { wishlistCount } = useWishlist();
  const wishlistCount = 1;
  const location = useLocation();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const categoriesRef = useRef(null);
  const buttonRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user?.username) {
        try {
          const res = await fetch(
            `http://localhost:3001/api/users/is-admin/${user.username}`
          );
          const data = await res.json();
          setIsAdmin(data.isAdmin);
        } catch (err) {
          console.error("Failed to check admin status", err);
        }
      }
    };

    checkAdminStatus();
  }, [user]);

  // Handle click outside for search
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const categories = [
    { name: "Horror", path: "/category/horror" },
    { name: "Romance", path: "/category/romance" },
    { name: "Comedy", path: "/category/comedy" },
    { name: "Mystery", path: "/category/mystery" },
    { name: "Science Fiction", path: "/category/scifi" },
    { name: "Fantasy", path: "/category/fantasy" },
  ];

  const handleSignOut = async () => {
    await signOut();
    setIsProfileOpen(false);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(!isSearchOpen);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    navigate(`/books?search=${encodeURIComponent(searchQuery)}`);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-4xl font-bold text-[#212e53]">
              <img
                src="/madreaderslogo.png"
                alt="MadReaders Logo"
                className="h-14 w-auto opacity-90 hover:opacity-100 transition-opacity"
              />
            </Link>
            <div className="flex space-x-8">
              <Link
                to="/"
                className="text-[#212e53] hover:text-[#212e53] font-medium"
              >
                Home
              </Link>
              <Link
                to="/books"
                className="text-[#212e53] hover:text-[#212e53] font-medium"
              >
                Library
              </Link>
              <div className="relative">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="text-[#212e53] hover:text-[#212e53] font-medium flex items-center"
                >
                  Categories
                  <svg
                    className={`w-4 h-4 ml-1 transition-transform ${
                      isCategoriesOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
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
              <Link
                to="/contact"
                className="text-[#212e53] hover:text-[#212e53] font-medium"
              >
                Contact Us
              </Link>
              <Link
                to="/faq"
                className="text-[#212e53] hover:text-[#212e53] font-medium"
              >
                FAQ
              </Link>
              <Link
                to="/book-recommendation"
                className="text-[#212e53] hover:text-[#212e53] font-medium"
              >
                Book Buddy
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="relative">
                  <button
                    onClick={handleSearchClick}
                    className="relative inline-flex items-center p-2 text-[#212e53] hover:text-[#212e53] font-medium group"
                  >
                    <FaSearch className="h-5 w-5 transition-transform group-hover:scale-110" />
                  </button>
                  {isSearchOpen && (
                    <div
                      ref={searchInputRef}
                      className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg py-2 px-3 border border-gray-200"
                    >
                      <form
                        onSubmit={handleSearchSubmit}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search for books..."
                          className="flex-1 px-3 py-2 border border-[#212e53] rounded-md text-sm focus:ring-2 focus:ring-[#212e53] focus:border-[#212e53]"
                        />
                        <button
                          type="submit"
                          className="px-3 py-2 bg-[#212e53] text-white rounded-md hover:bg-[#1a243f] transition-colors"
                        >
                          <FaSearch className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  )}
                </div>
                <Link
                  to="/wishlist"
                  className="relative inline-flex items-center p-2 text-[#212e53] hover:text-[#212e53] font-medium group"
                >
                  <svg
                    className="h-6 w-6 transition-transform group-hover:scale-110"
                    fill={
                      location.pathname === "/wishlist"
                        ? "currentColor"
                        : "none"
                    }
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
                    {wishlistCount}
                  </span>
                </Link>
                <Link
                  to="/cart"
                  className="relative inline-flex items-center p-2 text-[#212e53] hover:text-[#212e53] font-medium group"
                >
                  <svg
                    className="h-6 w-6 transition-transform group-hover:scale-110"
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
                    {cartCount}
                  </span>
                </Link>
                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="bg-[#212e53] text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-[#1a243f] mr-2"
                  >
                    Admin
                  </Link>
                )}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 text-sm focus:outline-none"
                  >
                    <span className="text-[#212e53] font-medium">
                      {user?.username || "User"}
                    </span>

                    <div className="h-8 w-8 rounded-full bg-[#212e53] flex items-center justify-center text-white font-medium">
                      {user?.given_name?.[0]?.toUpperCase() || "U"}
                    </div>
                  </button>
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 border border-gray-200">
                      <Link
                        to="/wishlist"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Wishlist
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-[#212e53] hover:bg-gray-100"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-[#212e53] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#1a243f]"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white text-[#212e53] border border-[#212e53] px-4 py-2 rounded-md text-sm font-medium hover:bg-[#f0f2f5]"
                >
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
