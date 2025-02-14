"use client";

import BlogEditor from "@/components/blog/BlogEditor";
import Link from "next/link";
import { use } from "react";

export default function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);

  return (
    <div>
      <Link href="/admin/blog">
        <button className="p-2">
          <i className="fa-solid fa-arrow-left"></i> back
        </button>
        <button onClick={() => window.location.reload()}>refresh</button>
      </Link>
      <BlogEditor blogId={resolvedParams.id} />
    </div>
  );
}