/* eslint-disable no-unused-vars */
import { FaUsers, FaBook, FaTags, FaChartLine, FaSearch, FaTrash, FaEdit, FaPlus } from 'react-icons/fa';
import Header from './Header';
export default function AdminDashboard() {
  // Sample data
// Sample data initialization
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', joinDate: '2023-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'customer', joinDate: '2023-02-20' },
    // Add more users as needed
  ];
  
  const orders = [
    { id: 1001, userId: 2, bookId: 5, total: 29.99, status: 'completed', date: '2023-05-10' },
    { id: 1002, userId: 1, bookId: 3, total: 19.99, status: 'shipped', date: '2023-05-12' },
    // Add more orders
  ];
  
  const coupons = [
    { code: 'SUMMER20', discount: 20, validUntil: '2023-08-31', used: 45 },
    { code: 'WELCOME10', discount: 10, validUntil: '2023-12-31', used: 102 },
    // Add more coupons
  ];
  
  const books = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, stock: 24 },
    { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee', price: 10.99, stock: 15 },
    // Add more books
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <Header />

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-8 px-4 sm:px-6 lg:px-8 pt-25 pb-12">
        {/* Navigation Panel */}
        <div className="lg:col-span-1 bg-gray-800/50 rounded-xl p-6 border border-gray-700">
          <h2 className="text-xl font-semibold mb-6 flex items-center">
            <FaBook className="mr-2 text-blue-400" /> Admin Grimoire
          </h2>
          <nav className="space-y-3">
            <button className="w-full flex items-center space-x-3 bg-blue-600/30 px-4 py-3 rounded-lg border border-blue-400/20">
              <FaUsers className="text-blue-300" />
              <span>User Scrolls</span>
            </button>
            <button className="w-full flex items-center space-x-3 hover:bg-gray-700/50 px-4 py-3 rounded-lg transition">
              <FaBook className="text-green-300" />
              <span>Book Tomes</span>
            </button>
            <button className="w-full flex items-center space-x-3 hover:bg-gray-700/50 px-4 py-3 rounded-lg transition">
              <FaTags className="text-yellow-300" />
              <span>Coupon Spells</span>
            </button>
            <button className="w-full flex items-center space-x-3 hover:bg-gray-700/50 px-4 py-3 rounded-lg transition">
              <FaChartLine className="text-purple-300" />
              <span>Order Chronicles</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search Bar */}
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 flex">
            <input 
              type="text" 
              placeholder="Search the archives..." 
              className="bg-gray-900/50 flex-grow px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg">
              <FaSearch />
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard 
              icon={<FaUsers className="text-blue-400" />} 
              title="Total Users" 
              value="1,243" 
              color="bg-blue-900/30"
            />
            <StatCard 
              icon={<FaBook className="text-green-400" />} 
              title="Books in Library" 
              value="589" 
              color="bg-green-900/30"
            />
            <StatCard 
              icon={<FaTags className="text-yellow-400" />} 
              title="Active Coupons" 
              value="24" 
              color="bg-yellow-900/30"
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <FaBook className="mr-2 text-purple-400" /> Recent Book Scrolls
              </h2>
              <button className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg flex items-center text-sm">
                <FaPlus className="mr-1" /> Add New
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 text-left">Title</th>
                    <th className="py-3 text-left">Author</th>
                    <th className="py-3 text-left">Price</th>
                    <th className="py-3 text-left">Stock</th>
                    <th className="py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.slice(0,5).map(book => (
                    <tr key={book.id} className="border-b border-gray-700/50 hover:bg-gray-700/30">
                      <td className="py-3">{book.title}</td>
                      <td className="py-3">{book.author}</td>
                      <td className="py-3">${book.price}</td>
                      <td className="py-3">{book.stock}</td>
                      <td className="py-3">
                        <div className="flex space-x-2">
                          <button className="text-blue-400 hover:text-blue-300">
                            <FaEdit />
                          </button>
                          <button className="text-red-400 hover:text-red-300">
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <footer className="bg-gray-900 text-white py-8 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} MadReaders Bookstore. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Stat Card Component
function StatCard({ icon, title, value, color }) {
  return (
    <div className={`${color} rounded-xl p-4 border border-gray-700`}>
      <div className="flex justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
        <div className="text-3xl opacity-70">
          {icon}
        </div>
      </div>
    </div>
  );
}