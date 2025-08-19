"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import { FaTrash } from "react-icons/fa";

export default function CartPage() {
  const { cartItems, updateQuantity, updateSize, removeFromCart } = useCart();
  const [shipping, setShipping] = useState(70);
  const router = useRouter();


console.log("Cart Items:", cartItems);
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.newPrice * item.quantity,
    0
  );
  const total = subtotal + shipping;

  const handleProceedToCheckout = () => {
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        cartItems,
        shipping,
      })
    );
    router.push("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className="max-w-6xl mx-auto p-5 min-h-[90vh] ">
        <h1 className="text-2xl font-bold mb-5">Your Cart</h1>
        <p className="text-center">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto min-h-[90vh] p-5 md:flex gap-6">
      {/* Left Side: Cart Table */}
      <div className="flex-1 bg-white p-4 rounded-md shadow">
        <h1 className="text-2xl font-bold mb-5">Your Cart</h1>

        {/* Table Header */}
        <div className="hidden md:grid grid-cols-8 gap-4 border-b pb-2 font-semibold">
          <span className="col-span-3">Product</span>
          <span className="col-span-2">Size</span>
          <span className="col-span-1">Quantity</span>
          <span className="text-right">Subtotal</span>
        </div>

        {/* Cart Items */}
        {cartItems.map((item) => (
          <div
            key={item._id + item.selectedSize}
            className="grid grid-cols-2 md:grid-cols-8 gap-4 items-center border-b py-3"
          >
            {/* Product Info */}
            <div className="flex items-center gap-3 col-span-3">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-gray-600">৳ {item.newPrice}</p>
              </div>
            </div>

            {/* Size Selector */}
            <div className="col-span-2 flex gap-2 flex-wrap">
              {item.sizes?.map((size) => (
                <button
                  key={size}
                  onClick={() => updateSize(item._id, size)}
                  className={`px-3 py-1 border rounded ${
                    item.selectedSize === size
                      ? "bg-yellow-400 text-white"
                      : "bg-white text-black"
                  }`}
                >
                  {size.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Quantity Control */}
            <div className="flex items-center border rounded w-fit col-span-1">
              <button
                className="px-3 py-1 border-r"
                onClick={() =>
                  updateQuantity(item._id, item.quantity - 1, item.selectedSize)
                }
              >
                -
              </button>
              <span className="px-4">{item.quantity}</span>
              <button
                className="px-3 py-1 border-l"
                onClick={() =>
                  updateQuantity(item._id, item.quantity + 1, item.selectedSize)
                }
              >
                +
              </button>
            </div>

            {/* Subtotal */}
            <p className="text-center md:ml-4 lg:ml-0 lg:text-right">
              ৳ {item.newPrice * item.quantity}
            </p>

            {/* Remove Button */}
            <button
              className="text-red-500 hover:text-red-700 ml-4"
              onClick={() => removeFromCart(item._id, item.selectedSize)}
            >
              <FaTrash />
            </button>
          </div>
        ))}

        {/* Coupon Section */}
        <div className="flex flex-col md:flex-row items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Coupon code"
            className="border px-3 py-2 w-full md:w-3/5 rounded"
          />
          <button className="w-full md:w-2/5 bg-yellow-400 hover:bg-yellow-500 text-white px-4 py-2 rounded">
            Apply coupon
          </button>
        </div>
      </div>

      {/* Right Side: Cart Summary */}
      <div className="bg-white p-4 rounded-md shadow-xl w-full md:h-screen md:w-64 lg:w-80 mt-6 md:mt-0">
        <h2 className="text-lg font-semibold mb-4">Cart totals</h2>

        <div className="flex justify-between mb-3">
          <span>Subtotal</span>
          <span>৳ {subtotal}</span>
        </div>

        {/* Shipping Options */}
        <div className="mb-4">
          <p className="font-semibold mb-2">Shipping</p>
          <label className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              checked={shipping === 70}
              onChange={() => setShipping(70)}
            />
            Inside Dhaka: ৳ 70
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={shipping === 120}
              onChange={() => setShipping(120)}
            />
            Outside Dhaka: ৳ 120
          </label>
        </div>

        <div className="flex justify-between font-semibold text-lg mb-4">
          <span>Total</span>
          <span>৳ {total}</span>
        </div>

        <button
          onClick={handleProceedToCheckout}
          className="bg-yellow-400 hover:bg-yellow-500 text-white w-full py-2 rounded"
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  );
}
