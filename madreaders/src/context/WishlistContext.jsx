import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../auth/cognito';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistCount, setWishlistCount] = useState(0);

  const updateWishlistCount = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3001/api/wishlist/count/${user.getUsername()}`);
      const data = await response.json();
      if (data.success) {
        setWishlistCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching wishlist count:', error);
    }
  };

  useEffect(() => {
    updateWishlistCount();
  }, []);

  return (
    <WishlistContext.Provider value={{ wishlistCount, updateWishlistCount }}>
      {children}
    </WishlistContext.Provider>
  );
}; 