import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import "./App.css";
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import SearchResults from "./components/SearchResults.jsx";
import Cart from "./components/Cart.jsx";
import Check from "./components/Checkout.jsx";
import BookDetails from "./components/BookDetails.jsx";
import WishList from "./components/WishList.jsx";
import CategoryPage from "./components/CategoryPage.jsx";
import Layout from "./components/Layout.jsx";
import Order from "./components/OrderHistory.jsx";
import Contact from "./components/Contactus.jsx";
import Faq from "./components/Faq.jsx";
import Dash from "./components/Dashboard.jsx";
import CouponManager from "./components/CouponManager.jsx";

import UserList from "./components/UserList.jsx";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a proper loading component
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Homepage />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route
            path="/search"
            element={
              <Layout>
                <SearchResults />
              </Layout>
            }
          />
          <Route
            path="/book/:id"
            element={
              <Layout>
                <BookDetails />
              </Layout>
            }
          />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Check />} />
          <Route path="/order" element={<Order />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/dashboard" element={<Dash />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/coupons" element={<CouponManager />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Layout>
                  <WishList />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
