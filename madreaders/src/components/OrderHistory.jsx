import { useState } from 'react';
import { FaBook, FaShippingFast, FaCheckCircle, FaTimesCircle, FaUndo, FaSearch, FaHistory } from 'react-icons/fa';

export default function OrderHistoryPage() {
  // Sample book orders data (mimicking Google Books API structure)
  const [orders, setOrders] = useState([
    {
      id: '#BOOK-78945',
      date: '2023-05-15',
      status: 'delivered',
      items: [
        { 
          id: '1',
          title: 'The Midnight Library', 
          authors: ['Matt Haig'],
          price: 14.99, 
          quantity: 1, 
          image: 'http://books.google.com/books/content?id=1&printsec=frontcover&img=1&zoom=1'
        },
        { 
          id: '2',
          title: 'Atomic Habits', 
          authors: ['James Clear'],
          price: 11.99, 
          quantity: 1, 
          image: 'http://books.google.com/books/content?id=2&printsec=frontcover&img=1&zoom=1'
        }
      ],
      shipping: 'Standard Shipping',
      total: 26.98,
      tracking: 'TRK123456789'
    },
    {
      id: '#BOOK-78234',
      date: '2023-06-22',
      status: 'shipped',
      items: [
        { 
          id: '3',
          title: 'Project Hail Mary', 
          authors: ['Andy Weir'],
          price: 18.99, 
          quantity: 1, 
          image: 'http://books.google.com/books/content?id=3&printsec=frontcover&img=1&zoom=1'
        }
      ],
      shipping: 'Express Shipping',
      total: 24.98,
      tracking: 'TRK987654321'
    },
    {
      id: '#BOOK-78123',
      date: '2023-07-10',
      status: 'processing',
      items: [
        { 
          id: '4',
          title: 'Dune', 
          authors: ['Frank Herbert'],
          price: 9.99, 
          quantity: 1, 
          image: 'http://books.google.com/books/content?id=4&printsec=frontcover&img=1&zoom=1'
        },
        { 
          id: '5',
          title: 'The Hobbit', 
          authors: ['J.R.R. Tolkien'],
          price: 12.99, 
          quantity: 1, 
          image: 'http://books.google.com/books/content?id=5&printsec=frontcover&img=1&zoom=1'
        }
      ],
      shipping: 'Priority Shipping',
      total: 22.98,
      tracking: null
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Cancel order function
  const cancelOrder = (orderId) => {
    if (window.confirm('Are you sure you want to cancel this book order?')) {
      setOrders(orders.map(order => 
        order.id === orderId && order.status === 'processing' 
          ? { ...order, status: 'cancelled' } 
          : order
      ));
    }
  };

  // Filter orders based on search and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items.some(item => item.title.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const statusConfig = {
      delivered: { 
        color: 'bg-green-100 text-green-800', 
        icon: <FaCheckCircle className="mr-1" />,
        text: 'Delivered'
      },
      shipped: { 
        color: 'bg-blue-100 text-blue-800', 
        icon: <FaShippingFast className="mr-1" />,
        text: 'Shipped'
      },
      processing: { 
        color: 'bg-yellow-100 text-yellow-800', 
        icon: <FaBook className="mr-1" />,
        text: 'Processing'
      },
      cancelled: { 
        color: 'bg-red-100 text-red-800', 
        icon: <FaTimesCircle className="mr-1" />,
        text: 'Cancelled'
      }
    };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusConfig[status]?.color || ''}`}>
        {statusConfig[status]?.icon}
        {statusConfig[status]?.text}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center bg-white p-4 rounded-full shadow-lg mb-4">
            <FaHistory className="text-indigo-600 text-3xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Book Orders</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Track your literary journey - from purchase to delivery
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white p-5 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by order ID or book title..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center">
              <label htmlFor="status-filter" className="mr-3 text-base text-gray-600 font-medium">
                Filter by:
              </label>
              <select
                id="status-filter"
                className="block w-full pl-3 pr-10 py-3 text-base border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg font-medium"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Orders</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white shadow-lg overflow-hidden rounded-xl border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                {/* Order Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-gradient-to-r from-blue-50 to-indigo-50">
                  <div className="flex items-center space-x-4">
                    <div className="bg-indigo-100 p-2 rounded-lg">
                      <FaBook className="text-indigo-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        Order {order.id}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Ordered on {new Date(order.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-0">
                    <StatusBadge status={order.status} />
                  </div>
                </div>

                {/* Order Content */}
                <div className="px-6 py-5">
                  {/* Book Items */}
                  <div className="space-y-5">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-24 w-16 rounded-md overflow-hidden shadow-sm border border-gray-200">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '/book-placeholder.jpg';
                            }}
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600 mt-1">by {item.authors.join(', ')}</p>
                              <p className="text-sm text-gray-500 mt-1">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-lg font-medium text-gray-900 ml-4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Summary */}
                  <div className="mt-8 border-t border-gray-200 pt-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Shipping Method</h4>
                        <p className="mt-1 text-base font-medium text-gray-900">{order.shipping}</p>
                      </div>
                      {order.tracking && (
                        <div>
                          <h4 className="text-sm font-medium text-gray-500">Tracking Number</h4>
                          <p className="mt-1 text-base font-medium text-indigo-600">{order.tracking}</p>
                        </div>
                      )}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-lg font-bold text-gray-900">
                        <p>Total Paid</p>
                        <p>${order.total.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>

                  {/* Order Actions */}
                  <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
                    {order.status === 'processing' && (
                      <button
                        type="button"
                        onClick={() => cancelOrder(order.id)}
                        className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <FaTimesCircle className="mr-2" />
                        Cancel Order
                      </button>
                    )}
                    {order.status === 'delivered' && (
                      <button
                        type="button"
                        className="inline-flex items-center px-5 py-3 border border-gray-300 text-base font-medium rounded-lg shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                      >
                        <FaUndo className="mr-2" />
                        Reorder
                      </button>
                    )}
                    <button
                      type="button"
                      className="inline-flex items-center px-5 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white rounded-xl shadow-lg">
              <div className="mx-auto h-24 w-24 flex items-center justify-center bg-indigo-100 rounded-full mb-4">
                <FaBook className="text-indigo-600 text-3xl" />
              </div>
              <h3 className="text-2xl font-medium text-gray-900 mb-2">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No matching orders found'
                  : 'Your book history is empty'}
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start your reading journey by exploring our book collection'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}