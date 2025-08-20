"use client";
import { useCart } from "@/app/context/CartContext";
import Spinner from "@/components/Spinner";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { IoCheckmarkCircle } from "react-icons/io5";
import { TbCurrencyTaka } from "react-icons/tb";

export default function ProductDetails({ product }) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");

  // Set default selected size when product loads
  useEffect(() => {
    if (product?.sizes?.length > 0) {
      setSelectedSize(product.sizes[0]);
    }
  }, [product]);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => (q > 1 ? q - 1 : q));

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("❌ Please select a size!");
      return;
    }
    addToCart({
      ...product,
      selectedSize,
      quantity
    });
  };

  const extraFeatures = [
    "Premium Quality",
    "Secure Payments",
    "Stylish Design",
    "Satisfaction Guarantee",
    "Money Back Guarantee",
    "Fast Shipping",
  ];

  if (!product) return <Spinner/>

  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8 py-10 grid md:grid-cols-2 gap-8">
      {/* Product Images */}
      <div>
        <div className="border">
          <img src={product.image} alt={product.name} className="w-full h-[500px] object-contain" />
        </div>
      </div>

      {/* Product Details */}
      <div>
        <h1 className="text-2xl font-semibold">{product.name}</h1>
        <div className="flex gap-4 my-4">
          <span className="text-xl font-bold flex justify-center items-center"><TbCurrencyTaka size={20} /> {product?.newPrice}</span>
          <span className="line-through text-gray-400 flex justify-center items-center">  <TbCurrencyTaka size={20} /> {product?.oldPrice}</span>
        </div>

        <div className="mb-4">
          <p className="font-semibold mb-2">Select Size:</p>
          <div className="flex gap-2">
            {product.sizes?.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`px-4 py-2 border rounded ${
                  selectedSize === size ? "bg-yellow-400 text-white" : "bg-white text-black"
                }`}
              >
                {size.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 my-4">
          <button onClick={decrement} className="border px-3 py-1"><FaMinus /></button>
          <span>{quantity}</span>
          <button onClick={increment} className="border px-3 py-1"><FaPlus /></button>
        </div>

        <div className="flex gap-4 mb-6">
          <button onClick={handleAddToCart} className="bg-yellow-400 px-6 py-2 rounded">
            Add to cart
          </button>
          <Link
            href={`/checkout?productId=${product._id}&quantity=${quantity}&size=${selectedSize}`}
            className="bg-yellow-400 px-6 py-2 rounded"
          >
            Buy Now
          </Link>
        </div>

        <p><strong>Brand:</strong> {product.brand}</p>
        <p><strong>Category:</strong> {product.category}</p>
        <p><strong>Description:</strong> {product.description}</p>
        <p><strong>Discount:</strong> {product.discount}%</p>

        <h3 className="mt-4 font-semibold">Extra Features</h3>
        <ul>
          {extraFeatures.map((f, i) => (
            <li key={i} className="flex gap-2 items-center">
              <IoCheckmarkCircle className="text-green-500" /> {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
