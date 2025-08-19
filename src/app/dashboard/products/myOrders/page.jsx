"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

export default function MyOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  // ✅ Filter state
  const [filter, setFilter] = useState("All"); // All | Approved | Pending

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const handleApprove = async (orderId) => {
    try {
      const res = await fetch("/api/orders/approve", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (res.ok) {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "Approved" } : order
          )
        );
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to approve order");
      }
    } catch (error) {
      console.error("Error approving order:", error);
      toast.error("Server error. Try again later.");
    }
  };

  const handleViewDetails = async (order) => {
    setSelectedOrder(order);
    const productDetails = await Promise.all(
      order.items.map(async (item) => {
        try {
          const res = await fetch(`/api/products/${item.productId}`);
          const data = await res.json();
          return { ...data, quantity: item.quantity, size: item.size };
        } catch (err) {
          console.error("Error fetching product:", err);
          return null;
        }
      })
    );
    setOrderItems(productDetails.filter(Boolean));
    setModalOpen(true);
  };

  if (loading) return <Spinner/>;

  // ✅ Filter orders (case-insensitive)
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter(
          (o) => o.status.toLowerCase() === filter.toLowerCase()
        );

  return (
    <div className="min-h-screen p-4 md:p-2  py-20">
      {/* Title + Filter buttons (Right Side) */}
      <div className="flex flex-col gap-5 md:flex-row justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
        <div className="flex gap-2">
          <Button
            variant={filter === "All" ? "default" : "outline"}
            onClick={() => setFilter("All")}
          >
            All
          </Button>
          <Button
            variant={filter === "Approved" ? "default" : "outline"}
            onClick={() => setFilter("Approved")}
          >
            Approved
          </Button>
          <Button
            variant={filter === "Pending" ? "default" : "outline"}
            onClick={() => setFilter("Pending")}
          >
            Pending
          </Button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-center">Customer</th>
              <th className="p-3 text-center">Address</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-center">Date</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id} className="border-b">
                <td className="p-3 text-center">{order.name}</td>
                <td className="p-3 text-center">{order.address}</td>
                <td className="p-3 text-center">
                  <span
                    className={`font-semibold ${
                      order.status.toLowerCase() === "pending"
                        ? "text-yellow-500"
                        : order.status.toLowerCase() === "cancelled"
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {new Date(order.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="p-3 text-center flex flex-col justify-center md:flex-row gap-2">
                  <Button onClick={() => handleViewDetails(order)}>
                    View Details
                  </Button>
                  <Button
                    className="bg-green-600 text-white hover:bg-blue-700"
                    onClick={() => handleApprove(order._id)}
                    disabled={
                      order.status.toLowerCase() === "approved" ||
                      order.status.toLowerCase() === "cancelled"
                    }
                  >
                    Approve
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="border p-4 rounded-md bg-white shadow-sm"
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-semibold">Name: {order.name}</h2>
              <span
                className={`font-semibold ${
                  order.status.toLowerCase() === "pending"
                    ? "text-yellow-500"
                    : order.status.toLowerCase() === "cancelled"
                    ? "text-red-500"
                    : "text-green-600"
                }`}
              >
                {order.status}
              </span>
            </div>
            <p className="text-sm text-gray-700 mb-2">
              Address : {order.address}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              Date : {new Date(order.createdAt).toLocaleDateString("en-GB")}
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                onClick={() => handleViewDetails(order)}
              >
                View Details
              </Button>
              <Button
                className="flex-1 bg-green-600 text-white hover:bg-blue-700"
                onClick={() => handleApprove(order._id)}
                disabled={order.status.toLowerCase() === "approved"}
              >
                Approve
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md max-w-3xl w-full mx-5 p-6 relative max-h-[70vh] overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-lg"
              onClick={() => setModalOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">Order Details</h2>
            {selectedOrder && (
              <div className="text-sm text-gray-700 mb-4 space-y-1">
                <p>
                  <strong>Customer:</strong> {selectedOrder.name}
                </p>
                <p>
                  <strong>Mobile:</strong> {selectedOrder.mobile}
                </p>
                <p>
                  <strong>Address:</strong> {selectedOrder.address}
                </p>
                <p>
                  <strong>Shipping:</strong> {selectedOrder.shipping}
                </p>
                <p>
                  <strong>Payment:</strong> {selectedOrder.payment}
                </p>
                <p>
                  <strong>Total:</strong> {selectedOrder.total}
                </p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {orderItems.map((item) => (
                <div
                  key={item._id}
                  className="border p-3 rounded-md flex gap-3"
                >
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p>Price: ${item.price}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Size: {item.size}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
