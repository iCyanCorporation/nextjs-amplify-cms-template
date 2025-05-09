"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  RiDashboardLine,
  RiArticleLine,
  RiImageLine,
  RiShoppingCartLine,
  RiFileList2Line,
  RiSettings3Line,
} from "react-icons/ri";
import { FaHome, FaUserCircle } from "react-icons/fa";
import { useUserContext } from "@/app/contexts/UserContext.js";
import { useSettingContext } from "@/app/contexts/SettingContext";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarProvider,
} from "@/components/ui/sidebar";
import SignOutButton from "./SignOutButton";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function SidebarNav() {
  const pathname = usePathname();
  const lng = pathname.split("/")[1] || "en";
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { getSetting } = useSettingContext();

  const navItems = [
    { href: "/admin/image", icon: RiImageLine, label: "Images" },
    { href: "/admin/blog", icon: RiArticleLine, label: "Blog" },
    { href: "/admin/shop", icon: RiShoppingCartLine, label: "Shop" },
    // { href: "/admin/orders", icon: RiFileList2Line, label: "Orders" },
    { href: "/admin/settings", icon: RiSettings3Line, label: "Settings" },
  ];

  // Get user info from context
  const { user } = useUserContext();

  return (
    <Sidebar className="fixed left-0 top-0 h-screen z-50 flex flex-col justify-between border-r-2 border-neutral-200 dark:border-neutral-800">
      <SidebarHeader className="flex flex-col gap-2 px-4 py-4 border-b border-neutral-200 dark:border-neutral-800">
        {/* Organization Info */}
        <div className="flex flex-col mb-2">
          <span className="font-semibold text-lg">
            {getSetting("store_name") || "Store"}
          </span>
          <span className="text-xs text-neutral-400">DASHBOARD</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="uppercase text-xs text-neutral-400 tracking-widest">
            Platform
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent className="flex-1 flex flex-col justify-between px-2 py-2">
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} className="flex items-center w-full">
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  className={`flex items-center gap-3 w-full px-2 py-2 rounded-md transition
                    hover:bg-neutral-100 dark:hover:bg-neutral-800
                    ${pathname === item.href ? "bg-neutral-200 dark:bg-neutral-800 font-semibold" : ""}
                  `}
                >
                  <span className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <SidebarSeparator />
      </SidebarContent>
      <SidebarFooter className="px-2 py-4 border-t border-neutral-200 dark:border-neutral-800">
        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            className="flex items-center gap-3 w-full px-2 py-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
            onClick={() => setProfileMenuOpen((v) => !v)}
          >
            <FaUserCircle className="w-8 h-8 text-neutral-400" />
            <div className="flex flex-col items-start">
              <span className="font-medium text-sm">
                {user?.name || "User"}
              </span>
              <span className="text-xs text-neutral-400">
                {user?.email || ""}
              </span>
            </div>
            <svg
              className={`ml-auto w-4 h-4 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {profileMenuOpen && (
            <div className="absolute left-0 bottom-12 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-md shadow-lg z-50">
              <div className="flex items-center justify-between px-2 py-3 border-b border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-3 w-full">
                  <FaUserCircle className="w-10 h-10 text-neutral-400" />
                  <div className="flex flex-col">
                    <span className="font-medium text-sm">
                      {user?.name || "User"}
                    </span>
                    <span className="text-xs text-neutral-400">
                      {user?.email || ""}
                    </span>
                  </div>
                </div>
                <ThemeToggle />
                <LanguageSwitcher lng={lng} />
              </div>

              <div className="flex flex-col py-1">
                <button
                  className="flex items-center gap-2 p-2  hover:bg-neutral-100 dark:hover:bg-neutral-800 text-sm"
                  onClick={() => {
                    window.location.href = `/${lng}`;
                  }}
                >
                  <FaHome className="w-4 h-4" />
                  <span className="uppercase">Homepage</span>
                </button>
              </div>

              <div className="flex items-center justify-between px-2 py-4 border-t border-neutral-200 dark:border-neutral-800">
                <SignOutButton isCollapsed={false} />
              </div>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
