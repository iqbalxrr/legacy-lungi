"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load from LocalStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
  }, []);

  // Save to LocalStorage whenever cartItems change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Add to cart
  const addToCart = (product) => {
    toast.dismiss();

    const existingItem = cartItems.find(
      (item) => item._id === product._id && item.selectedSize === product.selectedSize
    );

    if (existingItem) {
      toast.error("❌ প্রোডাক্টটি এই সাইজে ইতিমধ্যে কার্টে আছে!", {
        position: "top-center",
        autoClose: 3000,
        theme: "light",
        transition: Bounce,
      });
      return;
    }

    setCartItems([...cartItems, { ...product, quantity: product.quantity || 1 }]);

    toast.success("✅ প্রোডাক্টটি কার্টে যোগ হয়েছে!", {
      position: "top-center",
      autoClose: 3000,
      theme: "light",
      transition: Bounce,
    });
  };

  // Remove
  const removeFromCart = (_id, selectedSize) => {
    setCartItems((prev) =>
      prev.filter((item) => !(item._id === _id && item.selectedSize === selectedSize))
    );
  };

  // Update quantity
  const updateQuantity = (_id, quantity, selectedSize) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === _id && item.selectedSize === selectedSize
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  // Update size
  const updateSize = (_id, newSize) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item._id === _id ? { ...item, selectedSize: newSize } : item
      )
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        updateSize,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => useContext(CartContext);
