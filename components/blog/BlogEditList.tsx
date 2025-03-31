"use client";

import { useState, useEffect } from 'react';
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import type { Blog } from '@/types/blog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from 'next/navigation';
import { convertAWSDate2Datetime } from '@/lib/common';
import { Edit, Trash2 } from 'lucide-react';

const client = generateClient<Schema>();

export function BlogList() {
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
          (typeof blog.imgUrl === "string" || blog.imgUrl === null) &&
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
      // sort data by createdAt
      cleanedBlogs.sort((a: Blog, b: Blog) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
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
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 relative">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Button onClick={() => router.push('/admin/blog/new')}>Create New Blog Post</Button>
      </div>
      {isLoading && <LoadingSpinner className='absolute top-1/2' />}
      <Table className={isLoading ? 'opacity-50' : ''}>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>CreatedAt</TableHead>
            <TableHead>UpdatedAt</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {blogs.map((blog) => (
            <TableRow key={blog.id}>
              <TableCell>{blog.title}</TableCell>
              <TableCell className="w-1/6">
                {blog.category && (
                  <Badge variant="secondary" className="capitalize">
                    {blog.category}
                  </Badge>
                )}
              </TableCell>
              <TableCell className="w-1/6">{convertAWSDate2Datetime(`${blog.createdAt}`)}</TableCell>
              <TableCell className="w-1/6">{convertAWSDate2Datetime(`${blog.updatedAt}`)}</TableCell>
              <TableCell className="space-x-2">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => startEdit(blog)}
                  disabled={isLoading}
                  className="hover:opacity-80"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                  className="hover:opacity-80 text-red-500"
                  disabled={isLoading}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
