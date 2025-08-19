"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Package, ShoppingBag, Star, Flame, Tag } from "lucide-react";

export default function DashboardHome() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [collectionsData, setCollectionsData] = useState([]);
  const COLORS = ["#6366F1", "#F59E0B", "#10B981"];

  // 🔹 Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);

        // Pie chart data
        const premium = data.filter(p => p.category === "Premium Collections").length;
        const popular = data.filter(p => p.category === "Popular Collections").length;
        const discount = data.filter(p => p.category === "Discount Collections").length;

        setCollectionsData([
          { name: "Premium", value: premium },
          { name: "Popular", value: popular },
          { name: "Discount", value: discount },
        ]);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };
    fetchProducts();
  }, []);

  // 🔹 Fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data.orders);

        // Group orders by month for BarChart
        const monthMap = {};
        data.orders.forEach(order => {
          const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
          if (!monthMap[month]) monthMap[month] = { orders: 0, products: 0 };
          monthMap[month].orders += 1;
          monthMap[month].products += order.items?.length || 0;
        });

        const chartData = Object.keys(monthMap).map(month => ({
          name: month,
          orders: monthMap[month].orders,
          products: monthMap[month].products,
        }));

        setSalesData(chartData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="lg:px-6 space-y-6 my-16 md:my-2">
    <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-3 md:p-6 shadow-lg rounded-xl">
  <CardHeader className="space-y-2">
    <CardTitle className="text-3xl font-bold">Welcome Back, Admin!</CardTitle>
    <p className="text-md text-white/90">
      Here’s what’s happening with your store today. Use the sidebar to manage products, orders, and profile settings.
    </p>
  </CardHeader>
</Card>
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Orders</CardTitle>
            <ShoppingBag className="h-6 w-6 text-blue-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{orders.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Total Products</CardTitle>
            <Package className="h-6 w-6 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Premium</CardTitle>
            <Star className="h-6 w-6 text-purple-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{collectionsData.find(c => c.name === "Premium")?.value || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Popular</CardTitle>
            <Flame className="h-6 w-6 text-orange-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{collectionsData.find(c => c.name === "Popular")?.value || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle>Discount</CardTitle>
            <Tag className="h-6 w-6 text-pink-500" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{collectionsData.find(c => c.name === "Discount")?.value || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders vs Products</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#6366F1" />
                <Bar dataKey="products" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Collections Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={collectionsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {collectionsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
