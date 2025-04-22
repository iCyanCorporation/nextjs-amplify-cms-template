"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiArticleLine,
  RiImageLine,
  RiMenuFoldLine,
  RiMenuUnfoldLine,
} from "react-icons/ri";
import { FaHome } from "react-icons/fa";

import SignOutButton from "./SignOutButton";
import ThemeToggle from "./ThemeToggle";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const pathname = usePathname();

  const navItems = [
    // { href: "/admin", icon: RiDashboardLine, label: "Dashboard" },
    { href: "/admin/image", icon: RiImageLine, label: "Images" },
    { href: "/admin/blog", icon: RiArticleLine, label: "Blog" },
    // shop
    { href: "/admin/products", icon: RiArticleLine, label: "Shop" },
    { href: "/admin/orders", icon: RiArticleLine, label: "Orders" },
    { href: "/admin/settings", icon: RiArticleLine, label: "Settings" },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 z-50
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b">
          {!isCollapsed && (
            <>
              <Link
                href="/admin"
                className="flex text-xl font-bold text-gray-800 gap-2"
              >
                <FaHome className="h-6 w-6 hover:opacity-80" />
                <p>HOME</p>
              </Link>
              <ThemeToggle />
            </>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <RiMenuUnfoldLine className="w-5 h-5" />
            ) : (
              <RiMenuFoldLine className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center ${
                    isCollapsed ? "justify-center" : "justify-start"
                  } p-3 rounded-lg transition-colors ${
                    isActive(item.href)
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {!isCollapsed && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t">
          <Link href={"/"}>
            <button className="flex p-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hover:opacity-80">
              <FaHome className="h-5 w-5" />
              {!isCollapsed && <span className="ml-3">Go Homepage</span>}
            </button>
          </Link>
          <SignOutButton isCollapsed={isCollapsed} />
        </div>
      </div>
    </div>
  );
}
