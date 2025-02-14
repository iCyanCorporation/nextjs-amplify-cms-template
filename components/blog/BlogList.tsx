"use client";

import { useState, useEffect } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { Blog } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useRouter } from 'next/navigation';

const client = generateClient<Schema>();

export default function BlogList() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadBlogs();
  }, []);

  async function loadBlogs() {
    try {
      setIsLoading(true);
      const { data } = await client.models.Blog.list();
      const validBlogs = data.filter(
        (blog): blog is Blog =>
          blog !== null &&
          typeof blog.id === "string" &&
          (typeof blog.title === "string" || blog.title === null) &&
          (typeof blog.content === "string" || blog.content === null) &&
          (typeof blog.category === "string" || blog.category === null) &&
          (blog.owner === null || typeof blog.owner === "string") &&
          (blog.tags === null ||
            (Array.isArray(blog.tags) && blog.tags.every(tag => typeof tag === "string" || tag === null))) &&
          (typeof blog.createdAt === "string" || blog.createdAt === null) &&
          (typeof blog.updatedAt === "string" || blog.updatedAt === null)
      );
      const cleanedBlogs: Blog[] = validBlogs.map(blog => ({
        ...blog,
        tags: blog.tags ? blog.tags.filter((tag): tag is string => tag !== null) : blog.tags,
      }));
      setBlogs(cleanedBlogs);
    } catch (error) {
      console.error("Error loading blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function startEdit(blog: Blog) {
    router.push(`/admin/blog/${blog.id}`);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Are you sure you want to delete this blog post?')) {
      return;
    }

    try {
      setIsLoading(true);
      await client.models.Blog.delete({ id });
      await loadBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button onClick={() => router.push('/admin/blog/new')}>Create New Blog Post</Button>
      </div>
      {isLoading && <LoadingSpinner />}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Title</th>
            <th className="py-2">Category</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {blogs.map((blog) => (
            <tr key={blog.id} className="border-b">
              <td className="py-2">{blog.title}</td>
              <td className="py-2">
                {blog.category && (
                  <Badge variant="secondary" className="capitalize">
                    {blog.category}
                  </Badge>
                )}
              </td>
              <td className="py-2 space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startEdit(blog)}
                  disabled={isLoading}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                  disabled={isLoading}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
