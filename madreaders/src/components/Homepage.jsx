/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Header from "./Header";
import { searchBooks } from "./services/googleBooksService";
import { Link } from "react-router-dom";

function Homepage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [bestsellers, setBestsellers] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [displayedFeatured, setDisplayedFeatured] = useState(20);
  const [displayedBestsellers, setDisplayedBestsellers] = useState(20);
  const [displayedNewReleases, setDisplayedNewReleases] = useState(20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data sequentially to avoid rate limiting
        const featuredData = await searchBooks("romance", {
          orderBy: "relevance",
          maxResults: 20,
        });

        if (featuredData && featuredData.items) {
          setFeaturedBooks(featuredData.items);
        }

        const bestsellersData = await searchBooks("mystery", {
          orderBy: "relevance",
          maxResults: 20,
        });

        if (bestsellersData && bestsellersData.items) {
          setBestsellers(bestsellersData.items);
        }

        const newReleasesData = await searchBooks("fantasy", {
          orderBy: "newest",
          maxResults: 20,
        });

        if (newReleasesData && newReleasesData.items) {
          setNewReleases(newReleasesData.items);
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
        setError("Failed to fetch books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const results = await searchBooks(searchQuery);
      setSearchResults(results.items || []);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const loadMoreFeatured = () => {
    setDisplayedFeatured((prev) => prev + 20);
  };

  const loadMoreBestsellers = () => {
    setDisplayedBestsellers((prev) => prev + 20);
  };

  const loadMoreNewReleases = () => {
    setDisplayedNewReleases((prev) => prev + 20);
  };

  const formatBookData = (book) => {
    const volumeInfo = book.volumeInfo || {};
    return {
      id: book.id,
      title: volumeInfo.title || "No Title",
      author: volumeInfo.authors
        ? volumeInfo.authors.join(", ")
        : "Unknown Author",
      coverImage:
        volumeInfo.imageLinks?.thumbnail ||
        "https://via.placeholder.com/150x200?text=No+Cover",
      description: volumeInfo.description || "No description available",
      publishedDate: volumeInfo.publishedDate || "Unknown",
      averageRating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
    };
  };
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem("hasSeenPopup");
    if (!hasSeenPopup) {
      setShowWelcomePopup(true);
      sessionStorage.setItem("hasSeenPopup", "true");
    }
  }, []);

  const copyCouponCode = () => {
    navigator.clipboard.writeText("MADREADER20");
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col w-full">
      {/* Welcome Popup with Coupon */}
      {showWelcomePopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black bg-opacity-30">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative shadow-lg">
            <button
              onClick={() => setShowWelcomePopup(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-purple-600"
            >
              ✕
            </button>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎉</span>
              </div>
              <h3 className="text-2xl font-bold text-purple-600 mb-2">
                Welcome to MadReaders!
              </h3>
              <p className="text-lg mb-4">Here's a special gift for you!</p>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-dashed border-purple-300 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 mb-1">
                  Use this code at checkout
                </p>
                <div className="flex items-center justify-center">
                  <span className="font-mono text-xl font-bold text-purple-700 mr-2">
                    MADREADER20
                  </span>
                  <button
                    onClick={copyCouponCode}
                    className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors"
                  >
                    {couponCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  20% off your first purchase
                </p>
              </div>

              <p className="text-sm text-gray-600 mb-4">Expires in 7 days</p>

              <button
                onClick={() => setShowWelcomePopup(false)}
                className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-full"
              >
                Start Shopping →
              </button>
            </div>
          </div>
        </div>
      )}
      <Header />
      <main className="w-full max-w-7xl px-8 py-2 mx-auto mt-2 relative bg-gradient-to-br from-blue-50 to-indigo-50 flex-1 z-10">
        <section className="mb-4 bg-white p-6 rounded-lg shadow-sm w-full">
          <form onSubmit={handleSearch} className="flex gap-4 w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for books..."
              className="flex-1 px-3 py-2 border border-[#212e53] rounded-md text-base min-w-[200px] focus:ring-2 focus:ring-[#212e53] focus:border-[#212e53]"
            />
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2 bg-[#212e53] text-white rounded-md cursor-pointer transition-colors hover:bg-[#1a243f] disabled:bg-[#4a5a7a] disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
            {searchResults.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setSearchResults([]);
                  setSearchQuery('');
                }}
                className="px-6 py-2 bg-gray-100 text-[#212e53] border border-[#212e53] rounded-md hover:bg-gray-200 transition-colors whitespace-nowrap"
              >
                Clear Search
              </button>
            )}
          </form>
        </section>

        {searchResults.length > 0 && (
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-[#212e53] mb-6">
              Search Results
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {searchResults.map((book) => {
                const formattedBook = formatBookData(book);
                return (
                  <Link to={`/book/${formattedBook.id}`} key={formattedBook.id}>
                    <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-[450px]">
                      <div className="w-full h-[250px] flex items-center justify-center overflow-hidden rounded mb-4">
                        <img
                          src={formattedBook.coverImage}
                          alt={formattedBook.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="flex flex-col flex-grow">
                        <h3 className="text-lg font-medium text-[#212e53] mb-2 line-clamp-2 min-h-[3.5rem]">
                          {formattedBook.title}
                        </h3>
                        <p className="text-[#212e53] mb-2 line-clamp-1">{formattedBook.author}</p>
                        <div className="mt-auto flex items-center gap-1">
                          {Array(5)
                            .fill()
                            .map((_, i) => (
                              <span
                                key={i}
                                className={`text-xl ${
                                  i < formattedBook.averageRating
                                    ? "text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          <span className="text-sm text-gray-600 ml-2">
                            ({formattedBook.ratingsCount})
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <section className="mb-8 bg-gradient-to-r from-[#27374D] to-[#526D82] p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Featured Books
          </h2>
          <div className="grid grid-cols-4 gap-6 ">
            {featuredBooks.slice(0, 20).map((book) => {
              const formattedBook = formatBookData(book);
              return (
                <Link to={`/book/${formattedBook.id}`} key={formattedBook.id}>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-[450px]">
                    <div className="w-full h-[250px] flex items-center justify-center overflow-hidden rounded mb-4">
                      <img
                        src={formattedBook.coverImage}
                        alt={formattedBook.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg font-medium text-[#212e53] mb-2 line-clamp-2 min-h-[3.5rem]">
                        {formattedBook.title}
                      </h3>
                      <p className="text-[#212e53] mb-2 line-clamp-1">{formattedBook.author}</p>
                      <div className="mt-auto flex items-center gap-1">
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl ${
                                i < formattedBook.averageRating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({formattedBook.ratingsCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {featuredBooks.length > displayedFeatured && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreFeatured}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Load More Featured Books
              </button>
            </div>
          )}
        </section>

        <section className="mb-8 bg-gradient-to-r from-[#27374D] to-[#526D82] p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-white mb-6">
            Best Sellers
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {bestsellers.slice(0, displayedBestsellers).map((book) => {
              const formattedBook = formatBookData(book);
              return (
                <Link to={`/book/${formattedBook.id}`} key={formattedBook.id}>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-[450px]">
                    <div className="w-full h-[250px] flex items-center justify-center overflow-hidden rounded mb-4">
                      <img
                        src={formattedBook.coverImage}
                        alt={formattedBook.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg font-medium text-[#212e53] mb-2 line-clamp-2 min-h-[3.5rem]">
                        {formattedBook.title}
                      </h3>
                      <p className="text-[#212e53] mb-2 line-clamp-1">{formattedBook.author}</p>
                      <div className="mt-auto flex items-center gap-1">
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl ${
                                i < formattedBook.averageRating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({formattedBook.ratingsCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {bestsellers.length > displayedBestsellers && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreBestsellers}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Load More Best Sellers
              </button>
            </div>
          )}
        </section>

        <section className="mb-8 bg-gradient-to-r from-[#27374D] to-[#526D82] p-6 rounded-lg shadow-sm">
          <h2 className="text-2xl font-semibold text-white mb-6">
            New Releases
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {newReleases.slice(0, displayedNewReleases).map((book) => {
              const formattedBook = formatBookData(book);
              return (
                <Link to={`/book/${formattedBook.id}`} key={formattedBook.id}>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col h-[450px]">
                    <div className="w-full h-[250px] flex items-center justify-center overflow-hidden rounded mb-4">
                      <img
                        src={formattedBook.coverImage}
                        alt={formattedBook.title}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex flex-col flex-grow">
                      <h3 className="text-lg font-medium text-[#212e53] mb-2 line-clamp-2 min-h-[3.5rem]">
                        {formattedBook.title}
                      </h3>
                      <p className="text-[#212e53] mb-2 line-clamp-1">{formattedBook.author}</p>
                      <div className="mt-auto flex items-center gap-1">
                        {Array(5)
                          .fill()
                          .map((_, i) => (
                            <span
                              key={i}
                              className={`text-xl ${
                                i < formattedBook.averageRating
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        <span className="text-sm text-gray-600 ml-2">
                          ({formattedBook.ratingsCount})
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          {newReleases.length > displayedNewReleases && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMoreNewReleases}
                className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Load More New Releases
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default Homepage;
