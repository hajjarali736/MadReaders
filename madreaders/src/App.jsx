import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";
import "./App.css";
import Homepage from "./components/Homepage.jsx";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import SearchResults from "./components/SearchResults.jsx";
import Cart from "./components/Cart.jsx";
import Check from "./components/Checkout.jsx";
import BookDetails from "./components/BookDetails.jsx";
import WishList from "./components/WishList.jsx";
import CategoryPage from "./components/CategoryPage.jsx";
import Layout from "./components/Layout.jsx";
import Contact from "./components/Contactus.jsx";
import Faq from "./components/Faq.jsx";
import Dash from "./components/Dashboard.jsx";
import CouponManager from "./components/CouponManager.jsx";
import ContactInquiries from "./components/ContactInquiries.jsx";
import UserList from "./components/UserList.jsx";
import BookRecommendationChat from "./components/BookRecommendationChat.jsx";
import ChatRecommendation from "./components/ChatRecommendation.jsx";
import Landing from "./components/LandingPage.jsx";

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
      <CartProvider>
        <WishlistProvider>
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
              <Route path="/login" element={<Layout><Login /></Layout>} />
              <Route path="/signup" element={<Layout><Signup /></Layout>} />
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
              <Route path="/category/:category" element={<Layout><CategoryPage /></Layout>} />
              <Route path="/cart" element={<Layout><Cart /></Layout>} />
              <Route path="/checkout" element={<Layout><Check /></Layout>} />
              <Route path="/contact" element={<Layout><Contact /></Layout>} />
              <Route path="/faq" element={<Layout><Faq /></Layout>} />
              <Route path="/dashboard" element={<Layout><Dash /></Layout>} />
              <Route path="/users" element={<Layout><UserList /></Layout>} />
              <Route path="/coupons" element={<Layout><CouponManager /></Layout>} />
              <Route path="/contact-inquiries" element={<Layout><ContactInquiries /></Layout>} />
              <Route path="/landing" element={<Layout><Landing /></Layout>} />
              <Route
                path="/book-recommendation"
                element={
                  <Layout>
                    <BookRecommendationChat />
                  </Layout>
                }
              />
              <Route
                path="/chat-recommendation"
                element={
                  <Layout>
                    <ChatRecommendation />
                  </Layout>
                }
              />
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
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
