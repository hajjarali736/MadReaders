import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { GOOGLE_BOOKS_API_KEY } from "./services/googleBooksService";
import { getCurrentUser } from "../auth/cognito";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });
  const [showMessage, setShowMessage] = useState("");

  // Save cart and wishlist to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
    // Update cart count in navbar
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      cartCount.textContent = cart.length;
    }
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    // Update wishlist count in navbar
    const wishlistCount = document.getElementById("wishlist-count");
    if (wishlistCount) {
      wishlistCount.textContent = wishlist.length;
    }
  }, [wishlist]);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);

        // Fetch book details from Google Books API
        const response = await fetch(
          `https://www.googleapis.com/books/v1/volumes/${id}?key=${GOOGLE_BOOKS_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch book details");
        }

        const data = await response.json();
        const volumeInfo = data.volumeInfo;

        // Format book data
        const formattedBook = {
          id: data.id,
          title: volumeInfo.title || "No Title",
          author: volumeInfo.authors
            ? volumeInfo.authors.join(", ")
            : "Unknown Author",
          description: volumeInfo.description || "No description available",
          cover:
            volumeInfo.imageLinks?.thumbnail ||
            "https://via.placeholder.com/300x450",
          price: data.saleInfo?.listPrice?.amount || 29.99,
          category: volumeInfo.categories?.[0] || "Fiction",
          availability: data.saleInfo?.saleability === "FOR_SALE",
          publishedDate: volumeInfo.publishedDate || "Unknown",
          publisher: volumeInfo.publisher || "Unknown",
          pageCount: volumeInfo.pageCount || "Unknown",
          averageRating: volumeInfo.averageRating || 0,
          ratingsCount: volumeInfo.ratingsCount || 0,
        };

        setBook(formattedBook);

        // Fetch recommendations based on the book's category
        if (volumeInfo.categories?.[0]) {
          const recResponse = await fetch(
            `https://www.googleapis.com/books/v1/volumes?q=subject:${encodeURIComponent(
              volumeInfo.categories[0]
            )}&maxResults=4&key=${GOOGLE_BOOKS_API_KEY}`
          );

          if (recResponse.ok) {
            const recData = await recResponse.json();
            const formattedRecs = recData.items
              ?.filter((item) => item.id !== id)
              .slice(0, 2)
              .map((item) => ({
                id: item.id,
                title: item.volumeInfo.title,
                author: item.volumeInfo.authors?.join(", ") || "Unknown Author",
                cover:
                  item.volumeInfo.imageLinks?.thumbnail ||
                  "https://via.placeholder.com/150x225",
              }));

            setRecommendations(formattedRecs || []);
          }
        }
      } catch (error) {
        console.error("Error fetching book details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (book) {
      // Get current cart items
      const savedCart = localStorage.getItem("cart") || "[]";
      const currentCart = JSON.parse(savedCart);

      // Check if book is already in cart
      const isInCart = currentCart.some((item) => item.id === book.id);

      if (!isInCart) {
        // Create a simplified book object with only necessary data
        const bookToAdd = {
          id: book.id,
          title: book.title,
          author: book.author,
          cover: book.cover,
          price: book.price,
        };

        // Add to cart
        const updatedCart = [...currentCart, bookToAdd];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCart(updatedCart);
        setShowMessage("Added to cart!");

        // Update cart count in navbar
        const cartCount = document.getElementById("cart-count");
        if (cartCount) {
          cartCount.textContent = updatedCart.length;
        }
      } else {
        setShowMessage("Already in cart!");
      }
      setTimeout(() => setShowMessage(""), 3000);
    }
  };

  const handleAddToWishlist = async () => {
    if (!book) return;

    const user = getCurrentUser();
    if (!user) {
      setShowMessage("You must be logged in to use the wishlist.");
      return;
    }

    const username = user.getUsername();

    try {
      const response = await fetch("http://localhost:3001/api/wishlist/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          bookID: book.id,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setShowMessage("Added to wishlist!");
      } else {
        setShowMessage(data.message || "Already in wishlist.");
      }
    } catch (err) {
      console.error("Error adding to wishlist:", err);
      setShowMessage("An error occurred. Please try again.");
    }

    setTimeout(() => setShowMessage(""), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#4a919e] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-[#4a919e] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#212e53] mb-4">
            Book not found
          </h2>
          <Link to="/" className="text-blue-500 hover:underline">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#4a919e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Book Details</h1>
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Details */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-[200px] h-[300px] object-contain rounded-lg shadow-md"
                  />
                </div>
                <div className="w-full md:w-3/4">
                  <h1 className="text-3xl font-bold mb-2 text-[#212e53]">
                    {book.title}
                  </h1>
                  <p className="text-xl text-[#212e53] mb-4">
                    by {book.author}
                  </p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-[#212e53]">
                      ${book.price}
                    </span>
                    <span
                      className={`ml-4 px-3 py-1 rounded-full text-sm ${
                        book.availability
                          ? "bg-green-100 text-[#212e53]"
                          : "bg-red-100 text-[#212e53]"
                      }`}
                    >
                      {book.availability ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                  <div className="mb-4">
                    <div className="flex items-center gap-1">
                      {Array(5)
                        .fill()
                        .map((_, i) => (
                          <span
                            key={i}
                            className={`text-xl ${
                              i < book.averageRating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                      <span className="text-sm text-gray-600 ml-2">
                        ({book.ratingsCount})
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 text-sm text-gray-600">
                    <p>
                      <span className="font-semibold">Published:</span>{" "}
                      {book.publishedDate}
                    </p>
                    <p>
                      <span className="font-semibold">Publisher:</span>{" "}
                      {book.publisher}
                    </p>
                    <p>
                      <span className="font-semibold">Pages:</span>{" "}
                      {book.pageCount}
                    </p>
                    <p>
                      <span className="font-semibold">Category:</span>{" "}
                      {book.category}
                    </p>
                  </div>
                  <p className="text-[#212e53] mb-6" dangerouslySetInnerHTML={{ __html: book.description }}></p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToWishlist}
                      className="px-6 py-2 bg-[#212e53] text-white rounded-lg hover:bg-[#1a243f] transition-colors flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Add to Wishlist
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="px-6 py-2 bg-[#4a919e] text-white rounded-lg hover:bg-[#3a7a85] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!book?.availability}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                      </svg>
                      Add to Cart
                    </button>
                  </div>
                  {showMessage && (
                    <div className="mt-4 p-2 bg-green-100 text-green-800 rounded-lg">
                      {showMessage}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold mb-4 text-white">
              You May Also Like
            </h2>
            <div className="space-y-4">
              {recommendations.length > 0 ? (
                recommendations.map((rec) => (
                  <Link to={`/book/${rec.id}`} key={rec.id}>
                    <div className="bg-white rounded-lg shadow p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer">
                      <img
                        src={rec.cover}
                        alt={rec.title}
                        className="w-20 h-30 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{rec.title}</h3>
                        <p className="text-sm text-gray-600">{rec.author}</p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-white">No recommendations available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
