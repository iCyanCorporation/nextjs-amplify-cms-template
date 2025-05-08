import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Dashboard",
};

import BlogEditor from "@/app/[lng]/(auth)/admin/blog/components/BlogEditor";

export default function NewBlogPost() {
  return (
    <div>
      <BlogEditor />
    </div>
  );
}
