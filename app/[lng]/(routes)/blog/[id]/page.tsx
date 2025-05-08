import { notFound } from "next/navigation";
import { BlogContent } from "./components/BlogContent";
import type { Metadata, ResolvingMetadata } from "next";
import type { Blog } from "@/types/blog";

type Params = Promise<{ id: string; lng: string }>;
export async function generateMetadata(
  props: { params: Params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const params = await props.params;
  const { id, lng } = params;

  const blog: Blog | null = await getBlog(id);
  if (!blog) {
    return {};
  }

  return {
    title: blog.title || "Blog Post",
    description: blog.content || "",
    openGraph: {
      title: blog.title || "Blog Post",
      description: blog.content || "",
      images: [
        {
          url: blog.imgUrl || "/images/noimage.jpg",
          alt: blog.title || "Blog Post",
          width: 800,
          height: 600,
          type: "image/jpeg",
        },
      ],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${lng}/blog/${id}`,
    },
  };
}

async function getBlog(id: string): Promise<Blog | null> {
  try {
    const url = process.env.NEXT_PUBLIC_API_URL; // Use 3000 in Amplify
    if (!url) {
      console.error("API URL is missing");
      return null;
    }

    const response = await fetch(`${url}/api/blogs/${id}`, {
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error("Error loading blog:", error);
    return null;
  }
}

export default async function Page(props: { params: Params }) {
  const params = await props.params;
  const { id } = params;
  const blog = await getBlog(id);

  if (!blog) {
    return notFound();
  }

  return <BlogContent blog={blog} />;
}
