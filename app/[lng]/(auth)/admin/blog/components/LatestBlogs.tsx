"use client";

import { useState, useEffect } from "react";
import { BlogCard } from "@/app/[lng]/(auth)/admin/blog/components/BlogCard";
import { stripHtml } from "@/lib/common";
import { Blog } from "@/types/blog";
import { useTranslation } from "@/app/i18n/client";
import { homepageData } from "@/data/homepage";
import { getAuthToken } from "@/hooks/useAmplifyClient";

export function LatestBlogs({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "homepage");
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/blogs?limit=3", {
          headers: {
            Authorization: `Bearer ${await getAuthToken()}`,
          },
        });
        const data = await response.json();

        // sort data by createdAt
        data.sort((a: Blog, b: Blog) => {
          if (a.createdAt && b.createdAt) {
            return (
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
          }
          return 0;
        });
        setLatestBlogs(data);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-20 md:max-w-6xl m-auto">
      <h2 className="text-4xl font-bold mb-10 text-center">
        {t(homepageData.blog.title)}
        <div className="mt-4 flex justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
          <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"></div>
          <div className="w-2 h-2 rounded-full bg-pink-500 dark:bg-pink-400"></div>
        </div>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!latestBlogs || latestBlogs.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center p-12 rounded-lg backdrop-blur-sm border-4">
            <p className="text-2xl font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent animate-pulse">
              {t(homepageData.blog.noPosts.title)}
            </p>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t(homepageData.blog.noPosts.description)}
            </p>
          </div>
        ) : (
          latestBlogs.map((blog: Blog) => (
            <BlogCard
              key={blog.id}
              post={{
                id: blog.id,
                imgUrl: blog.imgUrl ?? "",
                title: blog.title ?? "",
                content: stripHtml(blog.content ?? ""),
                category: blog.category ?? "other",
                createdAt: blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString()
                  : "",
                tags: blog.tags ?? [],
                owner: blog.owner ?? "",
                updatedAt: blog.updatedAt
                  ? new Date(blog.updatedAt).toLocaleDateString()
                  : "",
              }}
            />
          ))
        )}
      </div>
    </section>
  );
}
