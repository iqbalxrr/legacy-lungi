"use client";

import { useCart } from "@/app/context/CartContext";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import { CgEditBlackPoint } from "react-icons/cg";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems } = useCart();

  // Client-only search params
  const [productId, setProductId] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [size, setSize] = useState(null);

  const [product, setProduct] = useState(null);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [shipping, setShipping] = useState("inside");
  const [loading, setLoading] = useState(false);

  // Get search params on client-side
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setProductId(searchParams.get("productId"));
    setQuantity(Number(searchParams.get("quantity") || 0));
    setSize(searchParams.get("size"));
  }, []);

  // Fetch single product if productId exists
  useEffect(() => {
    if (productId) {
      fetch(`/api/products/${productId}`)
        .then((res) => res.json())
        .then((data) => setProduct(data))
        .catch(() => setProduct(null));
    }
  }, [productId]);

  const shippingCost = shipping === "inside" ? 70 : 120;

  // Calculate subtotal & total
  let subtotal = 0;
  if (productId && product) {
    subtotal = product?.newPrice * quantity;
  } else if (!productId) {
    subtotal = cartItems?.reduce(
      (sum, item) => sum + item?.newPrice * item?.quantity,
      0
    );
  }
  const totalPrice = subtotal + shippingCost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !mobile || !address || !shipping) {
      toast.error("সব তথ্য পূরণ করুন");
      return;
    }

    let orderItems = [];

    if (productId && product && quantity > 0) {
      orderItems.push({ productId, quantity, size });
    } else if (cartItems?.length > 0) {
      orderItems = cartItems
        .filter((item) => item?._id && item?.quantity > 0)
        .map((item) => ({
          productId: item?._id,
          quantity: item?.quantity,
          size: item?.selectedSize,
        }));
    } else {
      toast.error("আপনার কার্ট খালি");
      return;
    }

    const orderData = {
      name,
      mobile,
      address,
      shipping,
      total: totalPrice,
      payment: "Cash on Delivery",
      items: orderItems,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      setLoading(false);

      if (!res.ok) {
        toast.error(data.message || "Order failed");
        return;
      }

      toast.success(data.message);
      router.push("/all-products"); // redirect after success
    } catch (err) {
      setLoading(false);
      toast.error("Server error");
    }
  };

  if ((productId && !product) || cartItems?.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="py-20">
      <div className="flex justify-center">
        <div className="py-10 px-6 lg:px-8 rounded-xl shadow-lg max-w-6xl w-full">
          <h1 className="text-center text-2xl font-bold mb-4">
            Customer information
          </h1>

          <div className="border p-3 rounded-md flex justify-between mb-6 bg-purple-50">
            <span>If you have been added to your cart.</span>
            <a href="/cart" className="text-purple-700 font-semibold">
              View cart
            </a>
          </div>

          {/* Order Summary */}
          <div className="border p-4 rounded-md mb-6 bg-gray-50">
            <h2 className="font-semibold text-lg mb-3">Order Summary</h2>

            {productId && product ? (
              <>
                <div className="flex justify-between mb-1">
                  <span>Product :</span>
                  <span className="font-semibold">{product?.name}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Quantity :</span>
                  <span className="font-semibold">{quantity}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Size :</span>
                  <span className="font-semibold">{size}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Price (each) :</span>
                  <span className="font-semibold">৳ {product?.newPrice}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Subtotal :</span>
                  <span className="font-semibold">৳ {product?.newPrice * quantity}</span>
                </div>
              </>
            ) : (
              cartItems?.map((item) => (
                <div
                  key={item._id + item.selectedSize}
                  className="flex justify-between mb-1 border-b pb-1"
                >
                  <span>
                    {item?.name} × {item?.quantity} ({item?.selectedSize})
                  </span>
                  <span className="font-semibold">
                    ৳ {item?.newPrice * item?.quantity}
                  </span>
                </div>
              ))
            )}

            <div className="flex justify-between mb-1">
              <span>Shipping Cost :</span>
              <span className="font-semibold">৳ {shippingCost}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total :</span>
              <span className="font-semibold">৳ {totalPrice}</span>
            </div>
          </div>

          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-6">
            {/* Left */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg mb-3">Billing & Shipping</h2>
              <input
                type="text"
                placeholder="আপনার নাম *"
                className="w-full border p-3 rounded-md mb-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <input
                type="tel"
                placeholder="মোবাইল নাম্বার *"
                className="w-full border p-3 rounded-md mb-3"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
              <textarea
                placeholder="আপনার ঠিকানা *"
                className="w-full border p-3 rounded-md mb-3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
              <h3 className="font-semibold mt-4 mb-2">Shipping</h3>
              <div className="border rounded-md">
                <label className="flex items-center gap-2 border-b p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="inside"
                    checked={shipping === "inside"}
                    onChange={(e) => setShipping(e.target.value)}
                  />
                  Inside Dhaka (+৳70)
                </label>
                <label className="flex items-center gap-2 p-3 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    value="outside"
                    checked={shipping === "outside"}
                    onChange={(e) => setShipping(e.target.value)}
                  />
                  Outside Dhaka (+৳120)
                </label>
              </div>
            </div>

            {/* Right */}
            <div className="w-full md:w-72 border rounded-md p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CgEditBlackPoint size={20} color="#FDC700" />
                  <h2 className="font-semibold">Cash on delivery</h2>
                </div>
                <p className="text-sm text-gray-600 mb-6 pl-4">
                  Pay with cash upon delivery.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || (!productId && cartItems?.length === 0)}
                className="bg-yellow-500 text-white py-3 rounded-md font-semibold hover:bg-yellow-600 transition"
              >
                {loading ? "Processing..." : `Order Now ৳ ${totalPrice}`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
