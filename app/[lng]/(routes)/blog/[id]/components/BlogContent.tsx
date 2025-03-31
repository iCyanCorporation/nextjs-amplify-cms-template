"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { Blog } from "@/types/blog";
import { FaLink } from "react-icons/fa";
import { FaXTwitter, FaLine, FaLinkedin, FaFacebook } from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { TableDialog } from "@/components/TableDialog";
import { useProcessTables } from "@/hooks/useProcessTables";

interface BlogContentProps {
  blog: Blog;
}

const socialShareLinks = [
  {
    name: "Twitter",
    // Button: TwitterShareButton,
    href: "https://twitter.com/intent/tweet?url=",
    icon: <FaXTwitter size={38} />
  },
  {
    name: "Facebook",
    // Button: FacebookShareButton,
    href: "https://www.facebook.com/sharer/sharer.php?u=",
    icon: <FaFacebook size={38} />
  },
  {
    name: "Linkedin",
    // Button: LinkedinShareButton,
    href: "https://www.linkedin.com/shareArticle?url=",
    icon: <FaLinkedin size={38} />
  },
  {
    name: "LINE",
    // Button: LineShareButton,
    href: "https://social-plugins.line.me/lineit/share?url=",
    icon: <FaLine size={38} />
  }
];

const copyTextToClipboard = async (text: string) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.left = '-999999px';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  } catch (err) {
    console.error("Could not copy text:", err);
    throw err;
  }
};

export function BlogContent({ blog }: BlogContentProps) {
  const router = useRouter();
  const [showCopied, setShowCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname() || "";
  const shareUrl = process.env.NEXT_PUBLIC_SITE_URL + pathname || '';
  
  // Table dialog state
  const [isTableDialogOpen, setIsTableDialogOpen] = useState(false);
  const [selectedTableHtml, setSelectedTableHtml] = useState("");
  const [selectedTableTitle, setSelectedTableTitle] = useState("");
  
  // Process the blog content - now passes dialogOpen state
  useProcessTables(blog.content || "", isTableDialogOpen);

  const handleCopyLink = () => {
    try {
      if (!shareUrl) throw new Error("URL is missing");
      copyTextToClipboard(shareUrl);

      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

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
      const tables = document.querySelectorAll(".markdownContent > .table-wrapper > table, .markdownContent > table");
      
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
          if (prevElement.tagName === "TABLE" || 
              /^(DIV|SECTION|ARTICLE)$/.test(prevElement.tagName)) {
            break;
          }
          prevElement = prevElement.previousElementSibling;
        }
        
        setSelectedTableTitle(title);
        setSelectedTableHtml(table.outerHTML);
        setIsTableDialogOpen(true);
      }
    };

    if (typeof window !== 'undefined') {
      // Add event listener only on client side
      document.addEventListener("expandTable", handleExpandTable);
      
      // Cleanup
      return () => {
        document.removeEventListener("expandTable", handleExpandTable);
      };
    }
  }, []);

  if (isLoading || !blog) return <></>

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
        Posted on <strong>{blog.createdAt && blog.createdAt.toString().split("T")[0]}</strong>
      </p>

      <div className="flex items-center gap-4 mb-6">
        <div className="flex gap-1">
          {socialShareLinks.map(({ name, icon, href }) => (
            <button
              key={name}
              onClick={() => {
                const width = 550;
                const height = 400;
                const left = (window.innerWidth - width) / 2;
                const top = (window.innerHeight - height) / 2;
                window.open(
                  `${href}${shareUrl}`,
                  name,
                  `width=${width},height=${height},left=${left},top=${top}`
                );
              }}
              className="p-2 rounded-full cursor-pointer hover:opacity-80 transition-all relative aspect-square h-10 w-10 flex items-center justify-center"
            >
              {icon}
            </button>
          ))}
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full hover:opacity-80 transition-all relative aspect-square h-10 w-10 flex items-center justify-center"
            aria-label="Copy link"
          >
            <FaLink size={28} />
            {showCopied && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black dark:bg-gray-700 text-white text-xs py-1 px-2 rounded whitespace-nowrap">
                Link copied!
              </span>
            )}
          </button>
        </div>
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
