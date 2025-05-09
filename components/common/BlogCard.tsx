"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Blog } from "@/types/blog";

// Add date formatting helper after imports
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

// Add this helper function after imports
const formatContent = (content: string) => {
  return content.split('\n').map((line, i) => (
    <span key={i}>
      {line}
      {i !== content.split('\n').length - 1 && <br />}
    </span>
  ));
};

interface BlogCardProps {
  post: Blog;
  variant?: "modern" | "simple";
  onClick?: () => void;
  className?: string;
}

export function BlogCard({ post, variant = "modern", onClick, className }: BlogCardProps) {
  if (variant === "simple") {
    return (
      <Card
        className={cn(
          "cursor-pointer hover:shadow-lg dark:hover:shadow-gray-900/30 transition-all duration-300 bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col",
          className
        )}
        onClick={onClick}
      >
        <CardHeader className="break-words">
          <CardTitle className="line-clamp-2 break-words overflow-hidden text-ellipsis whitespace-normal dark:text-white">
            {post.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="mt-auto">
          <div
            className="line-clamp-3 break-words dark:text-gray-300"
            dangerouslySetInnerHTML={{ __html: `${post.content}` }}
          />
          {post.createdAt && (
            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div
      className={cn(
        "group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 transition-all duration-300 backdrop-blur-lg cursor-pointer flex flex-col",
        className
      )}
      onClick={onClick}
    >
      {post.imgUrl ? (<img className="aspect-[16/9]" />) : (
        <div className="aspect-[16/9] bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50 group-hover:from-blue-200 group-hover:to-purple-200 dark:group-hover:from-blue-800/50 dark:group-hover:to-purple-800/50 transition-colors duration-300 items-center justify-center flex">
          <h3 className="relative px-4 py-2 text-gray-400 dark:text-white font-bold">
            NEW POST
          </h3>
        </div>
      )}
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-4 space-x-2">
          {post.category && (
            <span className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 rounded-full dark:text-gray-200">
              {post.category}
            </span>
          )}

        </div>
        <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 dark:text-white transition-colors duration-300">
          {post.title}
        </h3>
        <div className="mt-auto flex flex-col space-y-2 justify-between">
          <div
            className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2 mb-4"
            dangerouslySetInnerHTML={{ __html: `${post.content}` }}
          />
          {post.createdAt && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(post.createdAt)}
            </span>
          )}

        </div>

      </div>
    </div>

  );
}
