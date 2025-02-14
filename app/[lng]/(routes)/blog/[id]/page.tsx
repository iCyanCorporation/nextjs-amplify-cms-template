"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Blog } from "@/types/blog";
import { FaTwitter, FaFacebook, FaLinkedin, FaLink } from "react-icons/fa";
import { amplifyClient as client } from "@/hooks/useAmplifyClient";

const BlogDetail = ({ params }: { params: Promise<{ id: string }> }) => {
  // Unwrap the params promise using the experimental React.use hook
  const resolvedParams = use(params);
  const router = useRouter();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const result = await client.models.Blog.get({
          id: resolvedParams.id,
        });
        if (!result.data) throw new Error("Blog not found");

        // Filter out any null tags:
        const cleanedData = {
          ...result.data,
          tags: result.data.tags
            ? result.data.tags.filter((tag): tag is string => tag !== null)
            : null,
        };

        setBlog(cleanedData);
      } catch (error) {
        console.error("Error fetching blog:", error);
        router.push("/blog");
      }
    };
    fetchBlog();
  }, [resolvedParams.id, router]);

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = blog?.title || "";

    switch (platform) {
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            title
          )}&url=${encodeURIComponent(url)}`,
          "_blank"
        );
        break;
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        try {
          await navigator.clipboard.writeText(url);
          setShowCopied(true);
          setTimeout(() => setShowCopied(false), 2000);
        } catch (err) {
          console.error("Failed to copy URL:", err);
        }
        break;
    }
  };

  if (!blog)
    return <div className="w-full max-w-6xl m-auto p-6">Loading...</div>;

  return (
    <div className="w-full max-w-3xl m-auto p-6">
      <button
        onClick={() => router.push("/blog")}
        className="mb-4 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors"
      >
        ← Back to blog
      </button>

      {/* title */}
      <h1 className="text-3xl font-bold mb-4 dark:text-white">{blog.title}</h1>

      {/* updated date */}
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Posted on <strong>{blog.createdAt && blog.createdAt.toString().split("T")[0]}</strong>
      </p>

      {/* Share buttons */}
      <div className="flex items-center gap-4 mb-6">
        {/* <span className="text-sm text-gray-600">Share:</span> */}
        <div className="flex gap-3">
          <button
            onClick={() => handleShare("twitter")}
            className="p-2 rounded-full bg-[#1DA1F2] text-white hover:bg-opacity-90 transition-all"
            aria-label="Share on Twitter"
          >
            <FaTwitter size={18} />
          </button>
          <button
            onClick={() => handleShare("facebook")}
            className="p-2 rounded-full bg-[#4267B2] text-white hover:bg-opacity-90 transition-all"
            aria-label="Share on Facebook"
          >
            <FaFacebook size={18} />
          </button>
          <button
            onClick={() => handleShare("linkedin")}
            className="p-2 rounded-full bg-[#0077B5] text-white hover:bg-opacity-90 transition-all"
            aria-label="Share on LinkedIn"
          >
            <FaLinkedin size={18} />
          </button>
          <button
            onClick={() => handleShare("copy")}
            className="p-2 rounded-full bg-gray-700 text-white hover:bg-opacity-90 transition-all relative"
            aria-label="Copy link"
          >
            <FaLink size={18} />
            {showCopied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
        </div>
      </div>
      {/* content */}
      <div>
        <div className="markdownContent prose dark:prose-invert" dangerouslySetInnerHTML={{ __html: blog.content ?? "" }} />
      </div>

      {/* tags */}
      {blog.tags && blog.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {blog.tags.map((tag) => (
            <span
              key={tag}
              className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogDetail;
