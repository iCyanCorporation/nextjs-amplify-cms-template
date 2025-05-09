"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Blog } from "@/types/blog";
import { FaLink } from "react-icons/fa";
import { FaXTwitter, FaLine, FaLinkedin, FaFacebook } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { TableDialog } from "@/components/common/TableDialog";
import { useProcessTables } from "@/hooks/useProcessTables";
import SocialShare from "@/components/common/SocialShare";

interface BlogContentProps {
  blog: Blog;
}

export function BlogContent({ blog }: BlogContentProps) {
  const router = useRouter();
  const [showCopied, setShowCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname() || "";
  const shareUrl = process.env.NEXT_PUBLIC_SITE_URL + pathname || "";

  // Table dialog state
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [selectedTableHtml, setSelectedTableHtml] = useState("");
  const [selectedTableTitle, setSelectedTableTitle] = useState("");

  // Process the blog content - now passes dialogOpen state
  useProcessTables(blog.content || "", isTableDialogOpen);

  useEffect(() => {
    setIsLoading(true);
    if (blog.id) {
      setIsLoading(false);
    }
  }, [blog.id]);

  // Effect to listen for table expand events
  useEffect(() => {
    const handleExpandTable = (event: any) => {
      const { tableIndex } = event.detail;
      const tables = document.querySelectorAll(
        ".markdownContent > .table-wrapper > table, .markdownContent > table"
      );

      if (tables[tableIndex]) {
        // Get table and its heading (if present)
        const table = tables[tableIndex];
        let title = "Table View";

        // Look for a preceding heading (h1-h6)
        let prevElement = table.parentElement?.previousElementSibling;
        while (prevElement) {
          if (/^H[1-6]$/.test(prevElement.tagName)) {
            title = prevElement.textContent || "Table View";
            break;
          }
          // If we hit another table or major element, stop looking
          if (
            prevElement.tagName === "TABLE" ||
            /^(DIV|SECTION|ARTICLE)$/.test(prevElement.tagName)
          ) {
            break;
          }
          prevElement = prevElement.previousElementSibling;
        }

        setSelectedTableTitle(title);
        setSelectedTableHtml(table.outerHTML);
        setIsTableDialogOpen(true);
      }
    };

    if (typeof window !== "undefined") {
      // Add event listener only on client side
      document.addEventListener("expandTable", handleExpandTable);

      // Cleanup
      return () => {
        document.removeEventListener("expandTable", handleExpandTable);
      };
    }
  }, []);

  if (isLoading || !blog) return <></>;

  return (
    <div className="w-full max-w-3xl m-auto p-6">
      <button
        onClick={() => router.push("/blog")}
        className="mb-4 hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors"
      >
        ← Back to blog
      </button>

      <h1 className="text-3xl font-bold mb-4 dark:text-white">{blog.title}</h1>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        Posted on{" "}
        <strong>
          {blog.createdAt && blog.createdAt.toString().split("T")[0]}
        </strong>
      </p>

      <div className="flex items-center gap-4 mb-6">
        <SocialShare />
      </div>
      <Separator className="my-2 bg-gray-300 dark:bg-gray-700" />
      {/*  Content  */}
      <div
        className="markdownContent prose dark:prose-invert space-y-4"
        dangerouslySetInnerHTML={{ __html: blog.content ?? "" }}
      />

      {/* Table Dialog */}
      <TableDialog
        isOpen={isTableDialogOpen}
        onClose={() => setIsTableDialogOpen(false)}
        tableHtml={selectedTableHtml}
        tableTitle={selectedTableTitle}
      />

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
}
