/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import Header from './Header';
import { searchBooks } from './services/googleBooksService';

function Homepage() {
    const [searchQuery, setSearchQuery] = useState('');
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
                const featuredData = await searchBooks('romance', { 
                    orderBy: 'relevance',
                    maxResults: 20
                });
                
                if (featuredData && featuredData.items) {
                    setFeaturedBooks(featuredData.items);
                }

                const bestsellersData = await searchBooks('mystery', { 
                    orderBy: 'relevance',
                    maxResults: 20
                });
                
                if (bestsellersData && bestsellersData.items) {
                    setBestsellers(bestsellersData.items);
                }

                const newReleasesData = await searchBooks('fantasy', { 
                    orderBy: 'newest',
                    maxResults: 20
                });

                if (newReleasesData && newReleasesData.items) {
                    setNewReleases(newReleasesData.items);
                }
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError('Failed to fetch books. Please try again later.');
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
            console.error('Error searching books:', error);
        } finally {
            setIsSearching(false);
        }
    };

    const loadMoreFeatured = () => {
        setDisplayedFeatured(prev => prev + 20);
    };

    const loadMoreBestsellers = () => {
        setDisplayedBestsellers(prev => prev + 20);
    };

    const loadMoreNewReleases = () => {
        setDisplayedNewReleases(prev => prev + 20);
    };

    const formatBookData = (book) => {
        const volumeInfo = book.volumeInfo || {};
        return {
            id: book.id,
            title: volumeInfo.title || 'No Title',
            author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown Author',
            coverImage: volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Cover',
            description: volumeInfo.description || 'No description available',
            publishedDate: volumeInfo.publishedDate || 'Unknown',
            averageRating: volumeInfo.averageRating || 0,
            ratingsCount: volumeInfo.ratingsCount || 0
        };
    };

    return (
        <div className="min-h-screen bg-[#4a919e] flex flex-col w-full">
            <Header />
            <main className="w-full max-w-7xl px-8 py-4 mx-auto mt-4 relative bg-[#4a919e] flex-1 z-10">
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
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </form>
                </section>

                {searchResults.length > 0 && (
                    <section className="mb-12">
                        <h2 className="text-2xl font-semibold text-[#212e53] mb-6">Search Results</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {searchResults.map((book) => {
                                const formattedBook = formatBookData(book);
                                return (
                                    <div key={formattedBook.id} className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                                        <img src={formattedBook.coverImage} alt={formattedBook.title} className="w-full h-[250px] object-cover rounded mb-4" />
                                        <h3 className="text-lg font-medium text-[#212e53] mb-2">{formattedBook.title}</h3>
                                        <p className="text-[#212e53]">{formattedBook.author}</p>
                                        <div className="mt-auto flex items-center gap-1">
                                            {Array(5).fill().map((_, i) => (
                                                <span key={i} className={`text-xl ${i < formattedBook.averageRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                    ★
                                                </span>
                                            ))}
                                            <span className="text-sm text-gray-600 ml-2">({formattedBook.ratingsCount})</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                )}

                <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#212e53] mb-6">Featured Books</h2>
                    <div className="grid grid-cols-4 gap-6">
                        {featuredBooks.slice(0, 20).map((book) => {
                            const formattedBook = formatBookData(book);
                            return (
                                <div key={formattedBook.id} className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                                    <img src={formattedBook.coverImage} alt={formattedBook.title} className="w-full h-[250px] object-cover rounded mb-4" />
                                    <h3 className="text-lg font-medium text-[#212e53] mb-2">{formattedBook.title}</h3>
                                    <p className="text-[#212e53]">{formattedBook.author}</p>
                                    <div className="mt-auto flex items-center gap-1">
                                        {Array(5).fill().map((_, i) => (
                                            <span key={i} className={`text-xl ${i < formattedBook.averageRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                ★
                                            </span>
                                        ))}
                                        <span className="text-sm text-gray-600 ml-2">({formattedBook.ratingsCount})</span>
                                    </div>
                                </div>
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

                <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#212e53] mb-6">Best Sellers</h2>
                    <div className="grid grid-cols-4 gap-6">
                        {bestsellers.slice(0, 20).map((book) => {
                            const formattedBook = formatBookData(book);
                            return (
                                <div key={formattedBook.id} className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                                    <img src={formattedBook.coverImage} alt={formattedBook.title} className="w-full h-[250px] object-cover rounded mb-4" />
                                    <h3 className="text-lg font-medium text-[#212e53] mb-2">{formattedBook.title}</h3>
                                    <p className="text-[#212e53]">{formattedBook.author}</p>
                                    <div className="mt-auto flex items-center gap-1">
                                        {Array(5).fill().map((_, i) => (
                                            <span key={i} className={`text-xl ${i < formattedBook.averageRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                ★
                                            </span>
                                        ))}
                                        <span className="text-sm text-gray-600 ml-2">({formattedBook.ratingsCount})</span>
                                    </div>
                                </div>
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

                <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                    <h2 className="text-2xl font-semibold text-[#212e53] mb-6">New Releases</h2>
                    <div className="grid grid-cols-4 gap-6">
                        {newReleases.slice(0, 20).map((book) => {
                            const formattedBook = formatBookData(book);
                            return (
                                <div key={formattedBook.id} className="bg-white rounded-lg p-4 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col">
                                    <img src={formattedBook.coverImage} alt={formattedBook.title} className="w-full h-[250px] object-cover rounded mb-4" />
                                    <h3 className="text-lg font-medium text-[#212e53] mb-2">{formattedBook.title}</h3>
                                    <p className="text-[#212e53]">{formattedBook.author}</p>
                                    <div className="mt-auto flex items-center gap-1">
                                        {Array(5).fill().map((_, i) => (
                                            <span key={i} className={`text-xl ${i < formattedBook.averageRating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                                ★
                                            </span>
                                        ))}
                                        <span className="text-sm text-gray-600 ml-2">({formattedBook.ratingsCount})</span>
                                    </div>
                                </div>
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
            <footer className="bg-gray-900 text-white py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} MadReaders Bookstore. All rights reserved.</p>
        </div>
      </footer>
        </div>
    );
}

export default Homepage; 