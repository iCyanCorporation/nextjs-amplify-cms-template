"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { FaLink } from "react-icons/fa";
import { FaXTwitter, FaLine, FaLinkedin, FaFacebook } from "react-icons/fa6";

const socialShareLinks = [
  {
    name: "Twitter",
    href: "https://twitter.com/intent/tweet?url=",
    icon: <FaXTwitter size={38} />,
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/sharer/sharer.php?u=",
    icon: <FaFacebook size={38} />,
  },
  {
    name: "Linkedin",
    href: "https://www.linkedin.com/shareArticle?url=",
    icon: <FaLinkedin size={38} />,
  },
  {
    name: "LINE",
    href: "https://social-plugins.line.me/lineit/share?url=",
    icon: <FaLine size={38} />,
  },
];

async function copyTextToClipboard(text: string) {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return;
    }
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.left = "-999999px";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  } catch (error) {
    console.error("Could not copy text:", error);
    throw error;
  }
}

export default function SocialShare() {
  const pathname = usePathname() || "";
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}${pathname}`;
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyLink = () => {
    if (!shareUrl) return;
    copyTextToClipboard(shareUrl)
      .then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      })
      .catch((err) => console.error("Failed to copy URL:", err));
  };

  const openPopup = (href: string, name: string) => {
    const width = 550;
    const height = 400;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    window.open(
      `${href}${shareUrl}`,
      name,
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <div className="flex items-center gap-2">
      {socialShareLinks.map(({ name, href, icon }) => (
        <button
          key={name}
          onClick={() => openPopup(href, name)}
          className="p-2 rounded-full cursor-pointer hover:opacity-80 transition-all relative aspect-square h-10 w-10 flex items-center justify-center"
          aria-label={`Share on ${name}`}
        >
          {icon}
        </button>
      ))}
      <button
        onClick={handleCopyLink}
        className="p-2 rounded-full cursor-pointer hover:opacity-80 transition-all relative aspect-square h-10 w-10 flex items-center justify-center"
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
  );
}
