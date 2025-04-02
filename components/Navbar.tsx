"use client";

import React from "react";
import Link from "next/link";
import {
  RiDashboardLine,
  RiMenu2Line,
  RiShoppingBag2Line,
} from "react-icons/ri";
import { Cart } from "@/components/ui/cart";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center text-xl font-bold text-gray-800"
            >
              Toyofumi
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:flex sm:items-center gap-4">
            <Link
              href="/shop"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <RiShoppingBag2Line className="w-5 h-5 mr-2" />
              Shop
            </Link>
            <Link
              href="/admin"
              className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <RiDashboardLine className="w-5 h-5 mr-2" />
              Dashboard
            </Link>
            <Cart />
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              <RiMenu2Line className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-3 px-4">
          <Link
            href="/shop"
            className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            Shop
          </Link>
          <Link
            href="/admin"
            className="block px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          >
            Dashboard
          </Link>
          <div className="flex items-center">
            <Cart />
          </div>
        </div>
      </div>
    </nav>
  );
}
