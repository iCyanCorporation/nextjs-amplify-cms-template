"use client";

import { useState, useEffect } from "react";
import type { Schema } from "@/amplify/data/resource";
import { BlogCard } from "@/app/[lng]/(auth)/admin/blog/components/BlogCard";
import { BlogPagination } from "@/app/[lng]/(auth)/admin/blog/components/BlogPagination";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";
import { stripHtml } from "@/lib/common";
import type { Blog } from "@/types/blog";
// import { getAuthToken } from "@/hooks/useAmplifyClient";
import { useTranslation } from "@/app/i18n/client";

export function BlogList({ lng }: { lng?: string }) {
  const { t } = useTranslation(lng, "blog");

  const [blogs, setBlogs] = useState<Array<Schema["Blog"]["type"]>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(6);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  async function getBlogs() {
    try {
      const response = await fetch(`/api/blogs/`, {
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) throw new Error("Failed to fetch blogs");
      return response.json();
    } catch (error) {
      console.error("Error loading blogs:", error);
      return [];
    }
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1024) setBlogsPerPage(9);
      else if (width >= 768) setBlogsPerPage(8);
      else setBlogsPerPage(6);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleGetBlogs = async () => {
      setIsLoading(true);
      const data = await getBlogs();
      console.log(data);

      // sort data by createdAt
      data.sort((a: Blog, b: Blog) => {
        if (a.createdAt && b.createdAt) {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
        return 0;
      });
      setBlogs(data);
      setIsLoading(false);
    };

    handleGetBlogs();
  }, []);

  // Get unique categories from blogs
  const categories = Array.from(
    new Set(blogs.map((blog) => blog.category ?? "other"))
  ).filter(Boolean);

  // Filter blogs by selected category
  const filteredBlogs =
    selectedCategory === "all"
      ? blogs
      : blogs.filter((blog) => (blog.category ?? "other") === selectedCategory);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  if (isLoading)
    return (
      <LoadingSpinner className="w-10 h-10" text={t("loading", "Loading...")} />
    );
  if (error) return <ErrorMessage message={t("error", error)} />;
  if (filteredBlogs.length === 0)
    return <EmptyState message={t("empty", "No blogs found")} icon="box" />;

  return (
    <div className="mt-6">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded ${
            selectedCategory === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => {
            setSelectedCategory("all");
            setCurrentPage(1);
          }}
        >
          {t("all", "All")}
        </button>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`px-3 py-1 rounded uppercase text-sm ${
              selectedCategory === cat
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentPage(1);
            }}
          >
            {t(`category.${cat}`, cat)}
          </button>
        ))}
      </div>
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
              createdAt: blog.createdAt
                ? new Date(blog.createdAt).toLocaleDateString()
                : "",
              updatedAt: blog.updatedAt
                ? new Date(blog.updatedAt).toLocaleDateString()
                : "",
              tags: blog.tags ?? [],
            }}
          />
        ))}
      </div>

      <BlogPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
