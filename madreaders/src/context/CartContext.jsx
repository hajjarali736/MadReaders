import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from '../auth/cognito';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);

  const updateCartCount = async () => {
    const user = getCurrentUser();
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3001/api/cart/count/${user.getUsername()}`);
      const data = await response.json();
      if (data.success) {
        setCartCount(data.count);
      }
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  useEffect(() => {
    updateCartCount();
  }, []);

  return (
    <CartContext.Provider value={{ cartCount, updateCartCount }}>
      {children}
    </CartContext.Provider>
  );
}; 