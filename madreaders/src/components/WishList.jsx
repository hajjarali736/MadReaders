import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser } from "../auth/cognito"; // Adjust path if needed

function WishList() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  function generatePriceFromTitle(title) {
    if (!title || typeof title !== "string") return 10;

    const normalized = title.trim().toUpperCase();
    let hash = 0;

    // Generate a basic hash from character codes
    for (let i = 0; i < normalized.length; i++) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Clamp the price between $10 and $90
    const min = 10;
    const max = 90;
    const price = min + Math.abs(hash % (max - min + 1));

    return price;
  }

  const fetchWishlist = async () => {
    const user = getCurrentUser();
    if (!user) return;

    const username = user.getUsername();

    try {
      const res = await fetch(`http://localhost:3001/api/wishlist/${username}`);
      const data = await res.json();

      if (res.ok && data.success) {
        const wishlist = data.data;

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        const detailedBooks = [];

        for (let i = 0; i < wishlist.length; i++) {
          const item = wishlist[i];

          try {
            const response = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${item.BookID}`
            );
            const result = await response.json();

            detailedBooks.push({
              ...item,
              title: result.volumeInfo?.title || "Untitled",
              author:
                result.volumeInfo?.authors?.join(", ") || "Unknown Author",
              cover:
                result.volumeInfo?.imageLinks?.thumbnail ||
                "https://via.placeholder.com/150x200",
              price: Math.floor(Math.random() * 40) + 10,
            });
          } catch {
            detailedBooks.push({
              ...item,
              title: "Unavailable Book",
              author: "Unknown",
              cover: "https://via.placeholder.com/150x200",
              price: 0,
            });
          }

          // 🔐 Small delay before next request to avoid HTTP 429
          await delay(200); // 200ms = 5 requests per second
        }

        setWishlistItems(detailedBooks);
      }
    } catch (err) {
      console.error("Failed to fetch wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleAddToCart = async (item) => {
    const user = getCurrentUser();
    if (!user) return;

    const username = user.getUsername();

    try {
      const res = await fetch("http://localhost:3001/api/cart/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          bookID: item.BookID,
          price: item.price,
          quantity: 1,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        console.log("✅ Book added to cart");

        // Optional: Update cart count in UI
        const savedCart = localStorage.getItem("cart") || "[]";
        const currentCart = JSON.parse(savedCart);

        const cartItem = {
          id: item.BookID,
          title: item.title,
          author: item.author,
          cover: item.cover,
          price: item.price,
        };

        const updatedCart = [...currentCart, cartItem];
        localStorage.setItem("cart", JSON.stringify(updatedCart));

        const cartCount = document.getElementById("cart-count");
        if (cartCount) cartCount.textContent = updatedCart.length;

        // Remove from wishlist after adding
        handleRemoveFromWishlist(item.BookID);
        setTimeout(() => window.location.reload(), 1200);
      } else {
        console.error("❌ Failed to add to cart:", data.message);
      }
    } catch (err) {
      console.error("❌ Error adding to cart:", err);
    }
  };

  const handleRemoveFromWishlist = async (bookID) => {
    const user = getCurrentUser();
    if (!user) return;

    const username = user.getUsername();

    try {
      const res = await fetch(`http://localhost:3001/api/wishlist/remove`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, bookID }),
      });

      if (res.ok) {
        setWishlistItems((prev) =>
          prev.filter((item) => item.BookID !== bookID)
        );

        const wishlistCount = document.getElementById("wishlist-count");
        if (wishlistCount) wishlistCount.textContent = wishlistItems.length - 1;
        setTimeout(() => window.location.reload(), 1200);
      }
    } catch (err) {
      console.error("Error removing from wishlist:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#DDE6ED] pt-20 flex justify-center items-center">
        <p className="text-black text-xl">Loading wishlist...</p>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#DDE6ED] pt-20">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16 bg-gradient-to-r from-[#27374D] to-[#526D82] rounded-lg shadow-sm">
            <div className="mb-6">
              <svg
                className="mx-auto h-12 w-12 text-white"
                fill="none"
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
            </div>
            <h3 className="mt-2 text-xl font-medium text-white">
              Your wishlist is empty
            </h3>
            <p className="mt-1 text-sm text-white">
              Browse our collection and add items to your wishlist!
            </p>
            <div className="mt-6">
              <Link
                to="/books"
                className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
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
    <div className="min-h-screen bg-[#DDE6ED] pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold text-black mb-6">My Wishlist</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="bg-gradient-to-r from-[#27374D] to-[#526D82] rounded-lg shadow-sm overflow-hidden"
            >
              <div className="p-3">
                <div className="mb-3">
                  <img
                    src={item.cover || "https://via.placeholder.com/150x200"}
                    alt={item.title}
                    className="object-contain w-[150px] h-[200px] rounded-md mx-auto"
                  />
                </div>
                <h3 className="text-base font-medium text-white truncate">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-white truncate">
                  {item.author}
                </p>
                <div className="mt-2 text-base font-medium text-white">
                  ${generatePriceFromTitle(item.title)}
                </div>
                <div className="mt-3 space-y-2">
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="w-full px-4 py-2 bg-[#DDE6ED] text-black rounded-md shadow-sm hover:bg-[#3a7a85]"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleRemoveFromWishlist(item.BookID)}
                    className="w-full px-4 py-2 bg-white border border-gray-300 text-[#212e53] rounded-md hover:bg-gray-100"
                  >
                    Remove
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
