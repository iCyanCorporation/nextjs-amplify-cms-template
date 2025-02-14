"use client";

import BlogEditor from "@/components/blog/BlogEditor";
import Link from "next/link";

export default function NewBlogPost() {
  return (
    <div>
      <Link href="/admin/blog">
        <button className="p-2">
          <i className="fa-solid fa-arrow-left"></i> back
        </button>
      </Link>
      <BlogEditor />
    </div>
  );
}
