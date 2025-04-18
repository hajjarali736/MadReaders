import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch book details from backend
    const fetchBookDetails = async () => {
      try {
        // const response = await fetch(`/api/books/${id}`);
        // const data = await response.json();
        // setBook(data);
        
        // Mock data for now
        setBook({
          id: id,
          title: "Sample Book Title",
          author: "Sample Author",
          description: "This is a sample book description. It would contain detailed information about the book's content, themes, and other relevant details.",
          cover: "https://via.placeholder.com/300x450",
          price: 29.99,
          category: "Fiction",
          availability: true,
        });
        
        // Fetch recommendations
        // const recResponse = await fetch(`/api/books/${id}/recommendations`);
        // const recData = await recResponse.json();
        // setRecommendations(recData);
        
        // Mock recommendations
        setRecommendations([
          {
            id: 1,
            title: "Recommended Book 1",
            author: "Author 1",
            cover: "https://via.placeholder.com/150x225",
          },
          {
            id: 2,
            title: "Recommended Book 2",
            author: "Author 2",
            cover: "https://via.placeholder.com/150x225",
          },
        ]);
      } catch (error) {
        console.error('Error fetching book details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleAddToWishlist = async () => {
    try {
      // TODO: Implement wishlist functionality with backend
      console.log('Adding to wishlist:', book.id);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      // TODO: Implement cart functionality with backend
      console.log('Adding to cart:', book.id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  if (!book) {
    return <div className="container mx-auto px-4 py-8">Book not found</div>;
  }

  return (
    <div className="min-h-screen bg-[#4a919e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Book Details */}
          <div className="w-full md:w-2/3">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/3">
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full rounded-lg shadow-md"
                  />
                </div>
                <div className="w-full md:w-2/3">
                  <h1 className="text-3xl font-bold mb-2 text-[#212e53]">{book.title}</h1>
                  <p className="text-xl text-[#212e53] mb-4">by {book.author}</p>
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-[#212e53]">
                      ${book.price}
                    </span>
                    <span className={`ml-4 px-3 py-1 rounded-full text-sm ${
                      book.availability 
                        ? 'bg-green-100 text-[#212e53]' 
                        : 'bg-red-100 text-[#212e53]'
                    }`}>
                      {book.availability ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <p className="text-[#212e53] mb-6">{book.description}</p>
                  <div className="flex gap-4">
                    <button
                      onClick={handleAddToWishlist}
                      className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add to Wishlist
                    </button>
                    <button
                      onClick={handleAddToCart}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      disabled={!book.availability}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="w-full md:w-1/3">
            <h2 className="text-2xl font-bold mb-4">You May Also Like</h2>
            <div className="space-y-4">
              {recommendations.map((rec) => (
                <div
                  key={rec.id}
                  className="bg-white rounded-lg shadow p-4 flex gap-4 hover:shadow-md transition-shadow cursor-pointer"
                >
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
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails; 