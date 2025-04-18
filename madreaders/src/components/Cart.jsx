import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState({ value: 0, type: '' });
  const [isLoading, setIsLoading] = useState(true);
  const API_KEY = 'YOUR_GOOGLE_BOOKS_API_KEY'; // Replace with your actual API key

  // Fetch book details from Google Books API
  const fetchBookDetails = async (bookIds) => {
    try {
      const items = await Promise.all(
        bookIds.map(async (bookId) => {
          const response = await fetch(
            `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${API_KEY}`
          );
          const data = await response.json();
          
          return {
            id: bookId,
            title: data.volumeInfo.title,
            author: data.volumeInfo.authors?.join(', ') || 'Unknown Author',
            price: data.saleInfo?.listPrice?.amount || 9.99, // Default price
            image: data.volumeInfo.imageLinks?.thumbnail || '/book-placeholder.jpg',
            quantity: 1
          };
        })
      );
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching book details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // In a real app, get book IDs from your backend/cart system
    const bookIdsInCart = ['zyTCAlFPjgYC', '1q_xAwAAQBAJ']; // Example Google Books IDs
    
    fetchBookDetails(bookIdsInCart);
  }, []);

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const total = discount.type === 'percentage' 
    ? subtotal * (1 - discount.value / 100)
    : subtotal - discount.value;

  // Cart actions
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const applyCoupon = () => {
    // In a real app, validate with backend
    if (couponCode === 'READ20') {
      setDiscount({ value: 20, type: 'percentage' });
    } else if (couponCode === 'BOOK10') {
      setDiscount({ value: 10, type: 'fixed' });
    } else {
      alert('Invalid coupon code');
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading your cart...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 top-0 left-0 right-0 bottom-0">
      <Header />
      <div className="container mx-auto px-4 pt-8 md:pt-16">
        <h1 className="text-3xl font-bold mb-8 text-indigo-800">Your Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
<div className="text-center py-12">
  <h2 className="text-2xl mb-4 text-gray-700">Your cart is empty</h2>
  <Link 
    to="/" 
    className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
  >
    Browse Books
  </Link>

  {/* Sample Book Suggestions */}
  <div className="mt-12">
    <h3 className="text-xl font-semibold mb-6">Popular Books You Might Like</h3>
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {/* Book 1 */}
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
        <img 
          src="https://books.google.com/books/content?id=zyTCAlFPjgYC&printsec=frontcover&img=1&zoom=1&edge=curl" 
          alt="The Great Gatsby"
          className="w-full h-48 object-contain mb-3"
        />
        <h4 className="font-medium">The Great Gatsby</h4>
        <p className="text-sm text-gray-600">F. Scott Fitzgerald</p>
        <p className="text-indigo-600 font-bold mt-2">$12.99</p>
        <button className="mt-2 w-full bg-indigo-100 text-indigo-700 py-1 rounded hover:bg-indigo-200">
          Add to Cart
        </button>
      </div>

      {/* Book 2 */}
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
        <img 
          src="https://books.google.com/books/content?id=1q_xAwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl" 
          alt="To Kill a Mockingbird"
          className="w-full h-48 object-contain mb-3"
        />
        <h4 className="font-medium">To Kill a Mockingbird</h4>
        <p className="text-sm text-gray-600">Harper Lee</p>
        <p className="text-indigo-600 font-bold mt-2">$10.50</p>
        <button className="mt-2 w-full bg-indigo-100 text-indigo-700 py-1 rounded hover:bg-indigo-200">
          Add to Cart
        </button>
      </div>

      {/* Book 3 */}
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
        <img 
          src="https://books.google.com/books/content?id=PY8bDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl" 
          alt="1984"
          className="w-full h-48 object-contain mb-3"
        />
        <h4 className="font-medium">1984</h4>
        <p className="text-sm text-gray-600">George Orwell</p>
        <p className="text-indigo-600 font-bold mt-2">$9.99</p>
        <button className="mt-2 w-full bg-indigo-100 text-indigo-700 py-1 rounded hover:bg-indigo-200">
          Add to Cart
        </button>
      </div>

      {/* Book 4 */}
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition">
        <img 
          src="https://books.google.com/books/content?id=5EhxDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl" 
          alt="Pride and Prejudice"
          className="w-full h-48 object-contain mb-3"
        />
        <h4 className="font-medium">Pride and Prejudice</h4>
        <p className="text-sm text-gray-600">Jane Austen</p>
        <p className="text-indigo-600 font-bold mt-2">$8.25</p>
        <button className="mt-2 w-full bg-indigo-100 text-indigo-700 py-1 rounded hover:bg-indigo-200">
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {cartItems.map(item => (
                  <div key={item.id} className="border-b last:border-b-0">
                    <div className="flex p-4">
                      <div className="w-24 h-32 flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.title} 
                          className="w-full h-full object-contain rounded"
                        />
                      </div>
                      <div className="ml-4 flex-grow">
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-gray-600">{item.author}</p>
                        <p className="text-indigo-600 font-bold mt-2">
                          ${item.price.toFixed(2)}
                        </p>
                        
                        <div className="flex items-center mt-4">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="bg-gray-200 px-3 py-1 rounded-l"
                          >
                            -
                          </button>
                          <span className="bg-gray-100 px-4 py-1">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="bg-gray-200 px-3 py-1 rounded-r"
                          >
                            +
                          </button>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="ml-auto text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount.value > 0 && (
                    <div className="flex justify-between mb-2 text-green-600">
                      <span>Discount:</span>
                      <span>
                        {discount.type === 'percentage' 
                          ? `${discount.value}%` 
                          : `$${discount.value.toFixed(2)}`}
                      </span>
                    </div>
                  )}
                  
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                {/* Coupon Code */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Coupon Code</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-grow border rounded-l px-3 py-2"
                      placeholder="Enter coupon code"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-r hover:bg-indigo-700"
                    >
                      Apply
                    </button>
                  </div>
                </div>
                
                <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition">
                  Proceed to Checkout
                </button>
                
                <div className="mt-4 text-center text-sm text-gray-500">
                  <Link to="/books" className="text-indigo-600 hover:underline">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <footer className="bg-gray-900 text-white py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} MadReaders Bookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}