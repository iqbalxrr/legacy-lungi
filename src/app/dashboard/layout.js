"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, Package, PlusSquare, User, LogOut, Search, ShoppingBag } from "lucide-react";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("loggedIn");
    if (!loggedIn) {
      router.replace("/login"); 
    } else {
      setLoading(false);
    }
  }, [router]);

  if (loading)
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  // NavLink Component
  const NavItem = ({ href, label, Icon }) => (
    <Link
      href={href}
      className={`flex flex-col items-center px-4 py-2 rounded-md transition-colors duration-300
        ${pathname === href ? "text-[#0d5967]" : "text-gray-400 hover:text-white"}`}
    >
      <Icon size={22} />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar (Desktop only) */}
      <aside className="hidden md:flex md:flex-col md:w-64 xl:w-72 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
        <nav className="space-y-3">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              pathname === "/dashboard" ? "bg-[#0d5967]" : "hover:bg-gray-700"
            }`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link
            href="/dashboard/products"
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              pathname === "/dashboard/products" ? "bg-[#0d5967]" : "hover:bg-gray-700"
            }`}
          >
            <Package size={20} /> All Products
          </Link>
          <Link
            href="/dashboard/products/add"
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              pathname === "/dashboard/products/add" ? "bg-[#0d5967]" : "hover:bg-gray-700"
            }`}
          >
            <PlusSquare size={20} /> Add Product
          </Link>
          <Link
            href="/dashboard/products/myOrders"
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              pathname === "/dashboard/products/myOrders" ? "bg-[#0d5967]" : "hover:bg-gray-700"
            }`}
          >
            <ShoppingBag size={20} /> My Orders
          </Link>
          <Link
            href="/dashboard/profile"
            className={`flex items-center gap-3 px-4 py-2 rounded-md ${
              pathname === "/dashboard/profile" ? "bg-[#0d5967]" : "hover:bg-gray-700"
            }`}
          >
            <User size={20} /> Profile
          </Link>

          <button
            onClick={() => {
              localStorage.removeItem("loggedIn");
              router.push("/login");
            }}
            className="flex items-center gap-3 text-red-500 mt-5 px-4 py-2 hover:bg-red-600 hover:text-white rounded-md"
          >
            <LogOut size={20} /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-5 pb-20 md:pb-5">{children}</main>

      {/* Mobile Top Navbar */}
      <div className="bg-[#063238] w-full text-white shadow-md fixed top-0 left-0 z-50 right-0 flex justify-between items-center px-4 py-4 md:hidden">
        <div className="text-xl font-bold uppercase flex gap-3">
          <span>Admin</span>
          <span>Dashboard</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Link href="/dashboard/profile">
            <User size={24} />
          </Link>

        

        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-md md:hidden z-50">
        <div className="flex justify-around items-center py-2">
          <NavItem href="/dashboard" label="Dashboard" Icon={LayoutDashboard} />
          <NavItem href="/dashboard/products" label="Products" Icon={Package} />
          <NavItem href="/dashboard/products/add" label="Add" Icon={PlusSquare} />
          <NavItem href="/dashboard/products/myOrders" label="Orders" Icon={ShoppingBag} />         
         
        </div>
      </div>
    </div>
  );
}
