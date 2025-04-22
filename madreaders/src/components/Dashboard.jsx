/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaBook,
  FaTags,
  FaChartLine,
  FaSearch,
  FaEdit,
  FaPlus,
} from "react-icons/fa";
import Header from "./Header";
import * as db from "../backend/dbOperations.js";

export default function AdminDashboard() {
  const navigate = useNavigate();
  // State management
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBooks: 0,
    activeCoupons: 0,
  });

  const [inquiries, setInquiries] = useState([]);

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    try {
      setLoading(true);

      // Fetch users count from API
      const usersResponse = await fetch(
        "http://localhost:3001/api/users/list",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!usersResponse.ok) {
        const errorData = await usersResponse.json();
        throw new Error(errorData.error || "Failed to fetch users");
      }

      const usersData = await usersResponse.json();
      setUsers(usersData.users);

      // Fetch coupon count
      const couponsResponse = await fetch(
        "http://localhost:3001/api/coupons/count",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!couponsResponse.ok) {
        throw new Error("Failed to fetch coupon count");
      }

      const couponsData = await couponsResponse.json();

      // Set stats
      setStats({
        totalUsers: usersData.count,
        totalBooks: books.length,
        activeCoupons: couponsData.count, // Use the count from the API
      });
    } catch (err) {
      setError(err.message);
      console.error("Error fetching dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }
  const handleCouponCountClick = () => {
    setActiveTab("coupons");
  };

  // Function to handle user deletion
  async function handleDeleteUser(userId) {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await db.deleteUser(userId);
        setUsers(users.filter((user) => user._id !== userId));
      } catch (err) {
        console.error("Error deleting user:", err);
      }
    }
  }

  // Function to handle coupon creation
  async function handleCreateCoupon() {
    try {
      const newCoupon = await db.createCoupon({
        DiscountPercentage: 20,
        ExpiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        MaxUses: 100,
      });
      setCoupons([...coupons, newCoupon]);
    } catch (err) {
      console.error("Error creating coupon:", err);
    }
  }

  // Function to handle order status update
  async function handleUpdateOrderStatus(orderId, newStatus) {
    try {
      const updatedOrder = await db.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((order) => (order._id === orderId ? updatedOrder : order))
      );
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  }

  // Function to handle user count click
  const handleUserCountClick = () => {
    navigate("/users");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-gray-100">
      <Header />

      {/* Dashboard Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 p-8 px-4 sm:px-6 lg:px-8 pt-25 pb-12">
        {/* Navigation Panel */}

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              icon={<FaBook className="text-green-400" />}
              title="Books in Library"
              value={"45 821"}
              color="bg-green-900/30"
            />
            <div
              onClick={handleUserCountClick}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <StatCard
                icon={<FaUsers className="text-blue-400" />}
                title="Total Users"
                value={stats.totalUsers.toString()}
                color="bg-blue-900/30"
              />
            </div>

            <div
              onClick={() => navigate("/coupons")}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <StatCard
                icon={<FaTags className="text-yellow-400" />}
                title="Active Coupons"
                value={stats.activeCoupons.toString()}
                color="bg-yellow-900/30"
              />
            </div>
            <div
              onClick={() => navigate("/contact-inquiries")}
              className="cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <StatCard
                icon={<FaSearch className="text-pink-400" />}
                title="User Inquiries"
                value={"View"}
                color="bg-pink-900/30"
              />
            </div>
          </div>

          {/* Content Area */}
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
                <p className="mt-4 text-gray-400">
                  Loading the ancient texts...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-400">
                <p>Error: {error}</p>
                <button
                  onClick={fetchDashboardData}
                  className="mt-4 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold flex items-center">
                    {activeTab === "users" && (
                      <>
                        <FaUsers className="mr-2 text-blue-400" /> User
                        Management
                      </>
                    )}
                    {activeTab === "books" && (
                      <>
                        <FaBook className="mr-2 text-green-400" /> Book
                        Management
                      </>
                    )}
                    {activeTab === "coupons" && (
                      <>
                        <FaTags className="mr-2 text-yellow-400" /> Coupon
                        Management
                      </>
                    )}
                    {activeTab === "orders" && (
                      <>
                        <FaChartLine className="mr-2 text-purple-400" /> Order
                        Management
                      </>
                    )}
                  </h2>
                  {activeTab === "coupons" && (
                    <button
                      onClick={handleCreateCoupon}
                      className="bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-lg flex items-center text-sm"
                    >
                      <FaPlus className="mr-1" /> New Coupon
                    </button>
                  )}
                </div>

                <div className="overflow-x-auto">
                  {activeTab === "users" && (
                    <UserTable users={users} onDelete={handleDeleteUser} />
                  )}
                  {activeTab === "orders" && (
                    <OrderTable
                      orders={orders}
                      onUpdateStatus={handleUpdateOrderStatus}
                    />
                  )}
                  {/* Add other tables as needed */}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
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
        <div className="text-3xl opacity-70">{icon}</div>
      </div>
    </div>
  );
}

// User Table Component
function UserTable({ users, onDelete }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-3 text-left">Name</th>
          <th className="py-3 text-left">Email</th>
          <th className="py-3 text-left">Role</th>
          <th className="py-3 text-left">Join Date</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr
            key={user._id}
            className="border-b border-gray-700/50 hover:bg-gray-700/30"
          >
            <td className="py-3">{user.Name}</td>
            <td className="py-3">{user.Email}</td>
            <td className="py-3">{user.Role}</td>
            <td className="py-3">
              {new Date(user.CreatedAt).toLocaleDateString()}
            </td>
            <td className="py-3">
              <div className="flex space-x-2">
                <button
                  onClick={() => onDelete(user._id)}
                  className="text-red-400 hover:text-red-300"
                ></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Order Table Component
function OrderTable({ orders, onUpdateStatus }) {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b border-gray-700">
          <th className="py-3 text-left">Order ID</th>
          <th className="py-3 text-left">User</th>
          <th className="py-3 text-left">Total</th>
          <th className="py-3 text-left">Status</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr
            key={order._id}
            className="border-b border-gray-700/50 hover:bg-gray-700/30"
          >
            <td className="py-3">{order._id}</td>
            <td className="py-3">{order.UserID?.Name || "Unknown"}</td>
            <td className="py-3">${order.TotalAmount}</td>
            <td className="py-3">
              <select
                value={order.OrderStatus}
                onChange={(e) => onUpdateStatus(order._id, e.target.value)}
                className="bg-gray-900/50 px-2 py-1 rounded border border-gray-700"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </td>
            <td className="py-3">
              <div className="flex space-x-2">
                <button className="text-blue-400 hover:text-blue-300">
                  <FaEdit />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
