import React from "react";
import Link from "next/link";
import {
  RiArticleLine,
  RiImageLine,
  RiShoppingCart2Line,
} from "react-icons/ri";
import { Metadata } from "next";
import { Card } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

const menuItems = [
  {
    title: "Image Gallery",
    icon: <RiImageLine className="w-6 h-6 text-green-600" />,
    description: "Manage your image collections",
    link: "/admin/image",
  },
  {
    title: "Blog Management",
    icon: <RiArticleLine className="w-6 h-6 text-blue-600" />,
    description: "Create and manage blog posts",
    link: "/admin/blog",
  },
  {
    title: "Shop Management",
    icon: <RiShoppingCart2Line className="w-6 h-6 text-purple-600" />,
    description: "Create and manage blog posts",
    link: "/admin/shop",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-all duration-200"
            >
              <Link href={item.link} className="group p-6 rounded-xl block">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                    {item.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <p className="mt-1">{item.description}</p>
                  </div>
                </div>
              </Link>
            </Card>
          ))}
          {/* <Card className="hover:shadow-md transition-all duration-200">
            <Link href="/admin/blog" className="group p-6 rounded-xl block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                  <RiArticleLine className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold ">Blog Management</h2>
                  <p className="mt-1">Create and manage blog posts</p>
                </div>
              </div>
            </Link>
          </Card>

          <Card className="hover:shadow-md transition-all duration-200">
            <Link href="/admin/image" className="group p-6 rounded-xl block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                  <RiImageLine className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold ">Image Gallery</h2>
                  <p className="mt-1">Manage your image collections</p>
                </div>
              </div>
            </Link>
          </Card> */}
        </div>
      </div>
    </div>
  );
}
