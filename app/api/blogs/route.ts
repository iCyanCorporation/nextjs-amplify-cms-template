import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

// List all blogs
export async function GET(request: Request) {
  try {
    // Optional: handle pagination/filtering here
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const limitNumber = limit ? parseInt(limit, 10) : undefined;

    const blogsResult = await amplifyClient.models.Blog.list({
      authMode: "identityPool",
    });
    let blogs = blogsResult.data || [];

    // Sort by createdAt descending
    blogs = blogs.sort((a, b) => {
      const dateA = new Date(a.createdAt || new Date()).getTime();
      const dateB = new Date(b.createdAt || new Date()).getTime();
      return dateB - dateA;
    });

    // Apply limit if provided
    if (limitNumber) {
      blogs = blogs.slice(0, limitNumber);
    }

    // Clean up tags
    blogs = blogs.map((blog) => ({
      ...blog,
      tags: blog.tags
        ? blog.tags.filter((tag): tag is string => tag !== null)
        : null,
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json([], { status: 500 });
  }
}

// Create a new blog
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }
    const result = await amplifyClient.models.Blog.create(body, {
      authMode: "identityPool",
      authToken,
    });
    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to create blog" },
        { status: 400 }
      );
    }
    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: "Failed to create blog" },
      { status: 500 }
    );
  }
}
