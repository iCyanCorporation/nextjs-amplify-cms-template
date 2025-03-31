import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Dashboard",
};

import { BlogList } from "@/components/blog/BlogEditList";

export default function AdminBlog() {
  return <BlogList />;
}
