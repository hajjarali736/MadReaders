import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { searchBooks } from './services/googleBooksService';
import Layout from './Layout';

function CategoryPage() {
    const { category } = useParams();
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [displayedBooks, setDisplayedBooks] = useState(20); // Show initial 20 books like homepage

    // Map category names to search terms
    const categorySearchTerms = {
        horror: 'horror fiction',
        romance: 'romance fiction',
        comedy: 'comedy fiction',
        mystery: 'mystery fiction',
        scifi: 'science fiction',
        fantasy: 'fantasy fiction'
    };

    useEffect(() => {
        const fetchCategoryBooks = async () => {
            try {
                setLoading(true);
                const searchTerm = categorySearchTerms[category] || category;
                const response = await searchBooks(searchTerm, {
                    maxResults: 40 // Fetch more books initially
                });
                setBooks(response.items || []);
                setError(null);
            } catch (err) {
                setError('Failed to fetch books. Please try again later.');
                console.error('Error fetching category books:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryBooks();
    }, [category]);

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

    const loadMore = () => {
        setDisplayedBooks(prev => prev + 20); // Load 20 more books like homepage
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-[#4a919e]">
                    <div className="max-w-7xl mx-auto px-8 py-12">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                            <p className="mt-4 text-gray-600">Loading books...</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout>
                <div className="min-h-screen bg-[#4a919e]">
                    <div className="max-w-7xl mx-auto px-8 py-12">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                            <p className="text-red-700">{error}</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-[#4a919e]">
                <main className="w-full max-w-7xl px-8 py-8 mx-auto">
                    <section className="mb-8 bg-white p-6 rounded-lg shadow-sm">
                        <h1 className="text-3xl font-bold text-[#212e53] mb-8 capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()} Books
                        </h1>
                        
                        {books.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-[#212e53] text-lg">No books found in this category.</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-4 gap-4 mx-auto">
                                    {books.slice(0, displayedBooks).map((book) => {
                                        const formattedBook = formatBookData(book);
                                        return (
                                            <Link to={`/book/${formattedBook.id}`} key={formattedBook.id}>
                                                <div className="bg-white rounded-lg p-3 shadow-sm border border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col w-[200px]">
                                                    <img 
                                                        src={formattedBook.coverImage} 
                                                        alt={formattedBook.title} 
                                                        className="w-full h-[180px] object-cover rounded mb-2"
                                                    />
                                                    <h3 className="text-sm font-medium text-blue-500 mb-1 line-clamp-2">
                                                        {formattedBook.title}
                                                    </h3>
                                                    <p className="text-xs text-gray-700 mb-1 line-clamp-1">{formattedBook.author}</p>
                                                    <div className="mt-auto flex items-center gap-0.5">
                                                        {Array(5).fill().map((_, i) => (
                                                            <span 
                                                                key={i} 
                                                                className={`text-sm ${i < formattedBook.averageRating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                            >
                                                                ★
                                                            </span>
                                                        ))}
                                                        <span className="text-xs text-gray-600 ml-1">
                                                            ({formattedBook.ratingsCount})
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                                {books.length > displayedBooks && (
                                    <div className="mt-8 text-center">
                                        <button 
                                            onClick={loadMore}
                                            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                        >
                                            Load More Books
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </main>
            </div>
        </Layout>
    );
}

export default CategoryPage; 