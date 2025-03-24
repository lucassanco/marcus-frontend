import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
import { API_URL } from "../constants";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    async function fetchCart() {
      try {
        const response = await fetch(`${API_URL}/cart_items`);
        if (response.ok) {
          const data = await response.json();
          setCartItems(data);
        } else {
          console.error("Failed to load cart items");
        }
      } catch (e) {
        console.error("Error loading cart:", e);
      }
    }

    fetchCart();
  }, []);

  const addItem = (item) => {
    setCartItems((prev) => [...prev, item]);
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
