"use client";

import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User, Search } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";


export default function Navbar() {
  const pathname = usePathname();
  const { cartItems } = useCart();

  // Navbar link component
  const navLink = (href, label, Icon) => (
    <Link
      href={href}
      className={`flex flex-col items-center px-4 py-2 rounded-md transition-colors duration-300 relative
        ${pathname === href ? "bg-[#0d5967] text-white" : "hover:bg-[#0a4a55] text-white"}`}
    >
      <Icon className="mb-1" size={20} />
      {label === "Cart" && cartItems.length > 0 && (
        <span className="absolute -top-1 right-2 bg-red-500 text-xs px-1.5 rounded-full">
          {cartItems.length}
        </span>
      )}
      <span className="text-xs">{label}</span>
    </Link>
  );

  return (
    <div className="bg-[#063238]">
      {/* Desktop Navbar */}
      <nav className="text-white shadow-md sticky top-0 z-50 hidden md:flex justify-between items-center max-w-6xl mx-auto px-6 lg:px-8 py-8">
        {/* Logo */}
        <div className="flex items-center">
          <span className="flex gap-2 text-2xl lg:text-3xl font-bold uppercase">
            <span>legacy</span>
            <span>lungi</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="flex space-x-4 font-semibold">
          <Link
            href="/"
            className={`px-3 py-2 rounded-md transition-colors duration-300 ${
              pathname === "/" ? "bg-[#0d5967]" : "hover:bg-[#0a4a55]"
            }`}
          >
            HOME
          </Link>
          <Link
            href="/all-products"
            className={`px-3 py-2 rounded-md transition-colors duration-300 ${
              pathname === "/all-products" ? "bg-[#0d5967]" : "hover:bg-[#0a4a55]"
            }`}
          >
            PRODUCTS
          </Link>
          <Link
            href="/about"
            className={`px-3 py-2 rounded-md transition-colors duration-300 ${
              pathname === "/about" ? "bg-[#0d5967]" : "hover:bg-[#0a4a55]"
            }`}
          >
            ABOUT US
          </Link>
          <Link
            href="/contact"
            className={`px-3 py-2 rounded-md transition-colors duration-300 ${
              pathname === "/contact" ? "bg-[#0d5967]" : "hover:bg-[#0a4a55]"
            }`}
          >
            CONTACT
          </Link>
        </div>

        {/* Right Icons */}
        <div className="flex items-center space-x-4 relative">
          <Link href="/cart" className="relative">
            <ShoppingCart className="cursor-pointer" size={26} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-1.5 rounded-full">
                {cartItems.length}
              </span>
            )}
          </Link>
          <Link href="/myorders" className="text-sm">
           <User size={26} />
            
          </Link>
        </div>
      </nav>

      {/* Mobile Top Navbar */}
      <div className="bg-[#063238] text-white shadow-md fixed top-0 left-0 z-50 right-0 flex justify-between items-center px-4 py-4 md:hidden">
        <div className="text-xl font-bold uppercase flex gap-1">
          <span>legacy</span>
          <span>lungi</span>
        </div>
        <div className="flex items-center space-x-2 cursor-pointer">
          <Search size={24} />
        </div>
      </div>

      {/* Mobile Bottom Navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#063238] text-white shadow-md md:hidden z-50">
        <div className="flex justify-around items-center">
          {navLink("/", "Home", Home)}
          {navLink("/all-products", "Shop", ShoppingBag)}
          {navLink("/cart", "Cart", ShoppingCart)}
          {navLink("/myorders", "Orders", User)}
        </div>
      </div>
    </div>
  );
}
