import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Admin Dashboard",
};

import BlogEditor from "@/components/blog/BlogEditor";

export default function NewBlogPost() {
  return (
    <div>
      <BlogEditor />
    </div>
  );
}
