"use client";

import { useState, useEffect } from "react";
import AnimatedTitle from "@/components/AnimatedTitle";
import { BlogCard } from "@/components/BlogCard";
import { homepageData } from "@/data/homepage";
import type { Schema } from "@/amplify/data/resource";
import { amplifyClient } from "@/hooks/useAmplifyClient";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { stripHtml } from "@/utils/html";
import { useRouter } from "next/navigation";

Amplify.configure(outputs);

export default function PaginationContent() {
  const router = useRouter();
  const [latestBlogs, setLatestBlogs] = useState<Array<Schema["Blog"]["type"]>>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLatestBlogs = async () => {
      try {
        const blogs = await amplifyClient.models.Blog.list({
          limit: 3,
        });
        setLatestBlogs(blogs.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLatestBlogs();
  }, []);

  return (
    <div className="justify-center items-center m-auto p-5 md:p-0 dark:text-white">
      {/* Introduce */}
      <div className="flex md:flex-row flex-col md:max-w-6xl m-auto md:py-24">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 md:max-w-xl md:min-h-[180px] min-h-[100px] dark:text-white">
            <AnimatedTitle 
              sequences={homepageData.intro.title.sequences.flat()}
              speed={homepageData.intro.title.speed}
            />
          </h1>
          <h2 className="md:max-w-2xl dark:text-gray-300">{homepageData.intro.description}</h2>
          <div className="mt-8">
            <a
              href="/about"
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-black dark:bg-gray-800 rounded-full hover:bg-gray-800 dark:hover:bg-gray-700 hover:scale-105 transition-colors transition-all duration-300 group"
            >
              About me
              <svg
                className="w-5 h-5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex-1 relative ml-8 p-6 m-auto">
          <div className="relative w-full h-full aspect-square">
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="relative w-full h-full overflow-hidden">
              <div className="w-full h-full rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] overflow-hidden p-1">
                <img
                  src={homepageData.intro.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-[30%_70%_70%_30%_/_30%_30%_70%_70%] hover:scale-125 transition-transform duration-300"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto">
        {/* Work Section - Masonry-style layout with hover effects */}
        <section className="py-20 md:max-w-6xl m-auto">
          <h2 className="text-4xl font-bold mb-10 relative inline-block dark:text-white">
            {homepageData.selection.title}
            <div className="absolute -bottom-2 left-0 w-1/2 h-1 bg-black dark:bg-white transform origin-left transition-all duration-300 ease-out hover:w-full"></div>
          </h2>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {homepageData.selection.items.map((item, index) => (
              <div
                key={item.id}
                className={`group relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 p-1 transition-all duration-300 hover:scale-[1.02] break-inside-avoid ${(index+1) % 3 === 0 ? "min-h-[500px]" : "min-h-[350px]"} min-h-[200px]`}
                style={{
                  backgroundImage: `url(${item.imgUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                  <p className="text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery Section - Diagonal layout with perspective */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 dark:from-purple-900 dark:via-blue-900 dark:to-pink-900 animate-gradient-flow animate-morph-blob bg-[length:200%_150%] -skew-y-5 scale-75 opacity-80 dark:opacity-30"></div>

          <div className="relative">
            <h2 className="text-4xl font-bold mb-10 text-center dark:text-white">
              {homepageData.gallery.title}
              <span className="block w-20 h-1 bg-black dark:bg-white mx-auto mt-4 rounded-full"></span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
              {homepageData.gallery.items.map((item) => (
                <div
                  key={item.id}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden transform perspective-1000 hover:rotate-y-12 transition-all duration-500 bg-white dark:bg-gray-800"
                  style={{
                    backgroundImage: `url(${item.imgUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 dark:from-purple-400/10 dark:to-blue-400/10"></div>
                  <div className="absolute inset-0 flex flex-col justify-end p-6 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white text-xl font-bold transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      {item.title}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Section - Modified to use real data */}
        <section className="py-20 md:max-w-6xl m-auto">
          <h2 className="text-4xl font-bold mb-10 text-center">
            {homepageData.blog.title}
            <div className="mt-4 flex justify-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-purple-500 dark:bg-purple-400"></div>
              <div className="w-2 h-2 rounded-full bg-pink-500 dark:bg-pink-400"></div>
            </div>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div></div>
            ) : (
              latestBlogs.map((blog) => (
                <BlogCard
                  key={blog.id}
                  post={{
                    id: blog.id,
                    imgUrl: blog.imgUrl ?? "",
                    title: blog.title ?? "",
                    content: stripHtml(blog.content ?? ""),
                    category: blog.category ?? "other",
                    createdAt: blog.createdAt ? new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "",
                    tags: blog.tags ?? [],
                    owner: blog.owner ?? "",
                    updatedAt: blog.updatedAt ? new Date(blog.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    }) : "",
                  }}
                  onClick={() => {
                    router.push(`/blog/${blog.id}`);
                  }}
                />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
