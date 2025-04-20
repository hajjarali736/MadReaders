import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "./Layout";
import { getCurrentUser } from "../auth/cognito";

function Cart() {
  const [cartItems, setCartItems] = useState([]);

  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function generatePriceFromTitle(title) {
    if (!title || typeof title !== "string") return 12;

    const normalized = title.trim().toUpperCase();

    // Create a numeric hash based on character codes
    let hash = 0;
    for (let i = 0; i < normalized.length; i++) {
      hash = normalized.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Normalize hash to a range: 10 to 50
    const min = 10;
    const max = 50;
    const price = min + Math.abs(hash % (max - min + 1));

    return price;
  }

  const fetchCartItems = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      const res = await fetch(
        `http://localhost:3001/api/cart/${user.getUsername()}`
      );
      const data = await res.json();

      if (res.ok && data.success) {
        const detailed = await Promise.all(
          data.data.map(async (item) => {
            const bookRes = await fetch(
              `https://www.googleapis.com/books/v1/volumes/${item.BookID}`
            );
            const book = await bookRes.json();
            const title = book.volumeInfo?.title || "Untitled";
            const author =
              book.volumeInfo?.authors?.join(", ") || "Unknown Author";
            const cover =
              book.volumeInfo?.imageLinks?.thumbnail ||
              "https://via.placeholder.com/150x200";

            const price = generatePriceFromTitle(title); // use your deterministic price function

            return {
              ...item,
              title,
              author,
              cover,
              price,
            };
          })
        );

        setCartItems(detailed);
      }
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []);

  // Calculate total
  const subtotal = cartItems.reduce(
    (total, item) => total + (item.price || 0),
    0
  );
  const discountAmount = discount
    ? discount.type === "percentage"
      ? (subtotal * discount.value) / 100
      : discount.value
    : 0;
  const total = subtotal - discountAmount;

  const handleQuantityChange = async (bookID, newQuantity) => {
    const user = getCurrentUser();
    if (!user || newQuantity < 1) return;

    const res = await fetch("http://localhost:3001/api/cart/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: user.getUsername(),
        bookID,
        quantity: newQuantity,
      }),
    });

    if (res.ok) {
      setCartItems((prev) =>
        prev.map((item) =>
          item.BookID === bookID ? { ...item, Quantity: newQuantity } : item
        )
      );
    }
  };

  const removeItem = async (bookID) => {
    const user = getCurrentUser();
    if (!user) return;

    const res = await fetch("http://localhost:3001/api/cart/remove", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: user.getUsername(), bookID }),
    });

    if (res.ok) {
      setCartItems((prev) => prev.filter((item) => item.BookID !== bookID));
    }
  };

  const applyCoupon = () => {
    if (couponCode === "READ20") {
      setDiscount({ value: 20, type: "percentage" });
    } else if (couponCode === "BOOK10") {
      setDiscount({ value: 10, type: "fixed" });
    } else {
      alert("Invalid coupon code");
    }
  };

  const CartContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-[#4a919e] pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
              <p className="mt-4 text-white">Loading your cart...</p>
            </div>
          </div>
        </div>
      );
    }

    if (cartItems.length === 0) {
      return (
        <div className="min-h-screen bg-[#4a919e] pt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <div className="mb-6">
                <svg
                  className="mx-auto h-12 w-12 text-[#212e53]"
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
              </div>
              <h3 className="mt-2 text-xl font-medium text-[#212e53]">
                Your cart is empty
              </h3>
              <p className="mt-1 text-sm text-[#212e53]">
                Browse our collection and add items to your cart!
              </p>
              <div className="mt-6">
                <Link
                  to="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#212e53] hover:bg-[#1a243f]"
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
          <h1 className="text-2xl font-semibold text-white mb-6">
            Shopping Cart
          </h1>
          <div className="grid grid-cols-1 gap-6">
            {cartItems.map((item) => (
              <div
                key={item.BookID}
                className="bg-white rounded-lg shadow-sm overflow-hidden"
              >
                <div className="p-4 flex items-center">
                  <div className="flex-shrink-0 w-24">
                    <img
                      src={item.cover}
                      alt={item.title}
                      className="w-full h-32 object-contain rounded-md"
                    />
                  </div>
                  <div className="ml-6 flex-1">
                    <h3 className="text-lg font-medium text-[#212e53]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm text-[#212e53]">{item.author}</p>
                    <div className="mt-2 text-lg font-medium text-[#212e53]">
                      ${item.price}
                      <div className="mt-2">
                        <input
                          type="number"
                          min="1"
                          value={item.Quantity}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.BookID,
                              parseInt(e.target.value)
                            )
                          }
                          className="w-16 px-2 py-1 border border-gray-300 rounded"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-6">
                    <button
                      onClick={() => removeItem(item.BookID)}
                      className="text-red-500 hover:text-red-700"
                    >
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
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex-1 mr-4">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon code"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={applyCoupon}
                className="px-4 py-2 bg-[#212e53] text-white rounded-md hover:bg-[#1a243f]"
              >
                Apply Coupon
              </button>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Discount</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/checkout"
                className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#4a919e] hover:bg-[#3a7a85]"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Layout>
      <CartContent />
    </Layout>
  );
}

export default Cart;
