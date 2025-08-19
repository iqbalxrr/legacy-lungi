"use client";

import { useState } from "react";
import { toast } from "react-toastify";

export default function MyOrdersPage() {
  const [mobile, setMobile] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [productsMap, setProductsMap] = useState({});

  const fetchOrders = async () => {
    if (!mobile) return alert("Mobile number required");
    setLoading(true);

    const res = await fetch(`/api/orders?mobile=${mobile}`);
    const data = await res.json();
    const fetchedOrders = data.orders || [];

    const allProductIds = fetchedOrders.flatMap(order =>
      order.items.map(item => item.productId)
    );
    const uniqueIds = [...new Set(allProductIds)];

    const productsMap = {};
    for (let id of uniqueIds) {
      const res = await fetch(`/api/products/${id}`);
      if (res.ok) {
        const product = await res.json();
        productsMap[id] = product.name;
      } else {
        productsMap[id] = id;
      }
    }

    setProductsMap(productsMap);
    setOrders(fetchedOrders);
    setLoading(false);
  };

  const cancelOrder = async (orderId) => {
    if (!confirm("Are you sure to cancel this order?")) return;

    const res = await fetch(`/api/orders/cancel`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, mobile }),
    });

    const data = await res.json();
    toast.success(data.message);
    fetchOrders();
  };

  return (
    <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-[90vh]">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">
        Your Orders
      </h1>

      {/* input + button */}
      <div className="flex flex-col sm:flex-row mb-6 gap-3">
        <input
          type="tel"
          placeholder="Enter your mobile number"
          className="border p-3 rounded flex-1 text-sm sm:text-base focus:ring-2 focus:ring-yellow-400 outline-none"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <button
          onClick={fetchOrders}
          className="bg-yellow-500 hover:bg-yellow-600 transition text-white px-4 py-2 rounded font-medium text-sm sm:text-base"
        >
          {loading ? "Loading..." : "Check Orders"}
        </button>
      </div>

      {/* empty message */}
      {orders.length === 0 && !loading && (
        <p className="text-center text-gray-500 pt-10">No orders found.</p>
      )}

      {/* orders list */}
      <div className="grid gap-4">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border rounded-lg p-4 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
          >
            <div className="text-sm sm:text-base">
              <p><strong>Name:</strong> {order.name}</p>
              <p><strong>Mobile:</strong> {order.mobile}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p>
                <strong>Items:</strong>{" "}
                {order.items
                  ?.map(
                    (item) =>
                      `${productsMap[item.productId] || item.productId} × ${item.quantity}`
                  )
                  .join(", ")}
              </p>
              <p><strong>Total:</strong> ৳ {order.total}</p>
            </div>

            {order.status === "pending" && (
              <button
                className="bg-red-500 hover:bg-red-600 transition text-white px-4 py-2 rounded text-sm sm:text-base self-start sm:self-center"
                onClick={() => cancelOrder(order._id)}
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
