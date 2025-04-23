import React from "react";
import Link from "next/link";
import { RiArticleLine, RiImageLine } from "react-icons/ri";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default function Page() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/blog"
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                <RiArticleLine className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Blog Management
                </h2>
                <p className="text-gray-500 mt-1">
                  Create and manage blog posts
                </p>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/image"
            className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                <RiImageLine className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">
                  Image Gallery
                </h2>
                <p className="text-gray-500 mt-1">
                  Manage your image collections
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
