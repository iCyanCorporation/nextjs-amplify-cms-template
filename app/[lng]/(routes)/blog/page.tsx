"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { Schema } from "@/amplify/data/resource";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { BlogCard } from "@/components/BlogCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { amplifyClient } from "@/hooks/useAmplifyClient";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RiArrowDropLeftFill, RiArrowDropRightFill } from "react-icons/ri";
import { stripHtml } from "@/utils/html";

import { Amplify } from "aws-amplify";
Amplify.configure(outputs);
import outputs from "@/amplify_outputs.json";

export default function Page() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Array<Schema["Blog"]["type"]>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(6);

  useEffect(() => {
    setIsLoading(true);
    const subscription = amplifyClient.models.Blog.observeQuery().subscribe({
      next: (data) => {
        setBlogs([...data.items]);
        setIsLoading(false);
        setError(null);
      },
      error: (err) => {
        console.error('Error fetching blogs:', err);
        setError('Failed to load blogs');
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        // lg breakpoint
        setBlogsPerPage(9);
      } else if (width >= 768) {
        // md breakpoint
        setBlogsPerPage(8);
      } else {
        setBlogsPerPage(6);
      }
    };

    // Only run on client side
    if (typeof window !== 'undefined') {
      handleResize(); // Initial check
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(blogs.length / blogsPerPage);

  // Calculate reading time based on content
  const calculateReadTime = (content: string): string => {
    const wordsPerMinute = 225;
    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return `${minutes} min read`;
  };

  // State to store read times
  const [readTimes, setReadTimes] = useState<Record<string, string>>({});

  // Load read times from localStorage on client side
  useEffect(() => {
    const storedReadTimes = localStorage.getItem("blogReadTimes");
    if (storedReadTimes) {
      setReadTimes(JSON.parse(storedReadTimes));
    }
  }, []);

  // Save reading time to localStorage
  const saveReadTime = (blogId: string, readTime: string) => {
    const updatedReadTimes = { ...readTimes, [blogId]: readTime };
    setReadTimes(updatedReadTimes);
    localStorage.setItem("blogReadTimes", JSON.stringify(updatedReadTimes));
  };

  // Get reading time from state or calculate it
  const getReadTime = (blogId: string, content: string): string => {
    if (readTimes[blogId]) {
      return readTimes[blogId];
    }
    const readTime = calculateReadTime(content);
    saveReadTime(blogId, readTime);
    return readTime;
  };

  return (
    <div className="w-screen max-w-6xl m-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold dark:text-white">My Blogs</h1>
      </div>
      
      {isLoading && <LoadingSpinner text="Loading blogs..." />}

      {error && <ErrorMessage message={error} />}

      {!isLoading && !error && blogs.length === 0 && (
        <EmptyState message="No blogs found" icon="box" />
      )}

      {!isLoading && !error && blogs.length > 0 && (
        <div className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
            {currentBlogs.map((blog) => (
              <BlogCard
                key={blog.id}
                post={{
                  id: blog.id,
                  title: blog.title ?? "",
                  imgUrl: blog.imgUrl ?? "",
                  content: stripHtml(blog.content ?? ""),
                  category: blog.category ?? "other",
                  owner: blog.owner ?? "",
                  createdAt: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : "",
                  updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : "",
                  tags: blog.tags ?? [],
                  
                }}
                onClick={() => {
                  router.push(`/blog/${blog.id}`);
                }}
              />
            ))}
          </div>

          <Pagination className="mt-8 flex justify-center">
            <PaginationContent>
              <PaginationItem>
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  className="hover:text-gray-500"
                >
                  <RiArrowDropLeftFill className="h-9 w-9" />
                </button>
              </PaginationItem>

              {/* First page */}
              <PaginationItem>
                <PaginationLink
                  isActive={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>

              {/* Show ellipsis dropdown if there are pages between 1 and currentPage - 1 */}
              {currentPage > 3 && (
                <PaginationItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center">
                      <PaginationEllipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-24 overflow-y-scroll">
                      {Array.from(
                        { length: currentPage - 2 },
                        (_, i) => i + 2
                      ).map((page) => (
                        <DropdownMenuItem
                          key={page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </PaginationItem>
              )}

              {/* Previous page if not first page */}
              {currentPage > 2 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    {currentPage - 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Current page */}
              {currentPage !== 1 && currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationLink isActive={true}>{currentPage}</PaginationLink>
                </PaginationItem>
              )}

              {/* Next page if not last page */}
              {currentPage < totalPages - 1 && (
                <PaginationItem>
                  <PaginationLink
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    {currentPage + 1}
                  </PaginationLink>
                </PaginationItem>
              )}

              {/* Show ellipsis dropdown if there are pages between currentPage + 1 and last page */}
              {currentPage < totalPages - 2 && (
                <PaginationItem>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-9 w-9 flex items-center justify-center">
                      <PaginationEllipsis />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="max-h-24 overflow-y-scroll">
                      {Array.from(
                        { length: totalPages - currentPage - 1 },
                        (_, i) => currentPage + i + 2
                      ).map((page) => (
                        <DropdownMenuItem
                          key={page}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </PaginationItem>
              )}

              {/* Last page */}
              {totalPages > 1 && (
                <PaginationItem>
                  <PaginationLink
                    isActive={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              )}

              <PaginationItem>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  className="hover:text-gray-500"
                >
                  <RiArrowDropRightFill className="h-9 w-9" />
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
