import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Dashboard",
};

import { BlogList } from "@/app/[lng]/(auth)/admin/blog/components/BlogEditList";

export default function AdminBlog() {
  return <BlogList />;
}
