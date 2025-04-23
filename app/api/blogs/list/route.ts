import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");
    const limitNumber = limit ? parseInt(limit, 10) : null;

    // First, get all blogs
    const blogsResult = await amplifyClient.models.Blog.list();

    // Then, sort them manually by createdAt in descending order
    const sortedBlogs = blogsResult.data.sort((a, b) => {
      const dateA = new Date(a.createdAt || new Date()).getTime();
      const dateB = new Date(b.createdAt || new Date()).getTime();
      return dateB - dateA; // Descending order (newest first)
    });

    // Finally, apply the limit
    const limitedBlogs = limitNumber
      ? sortedBlogs.slice(0, limitNumber)
      : sortedBlogs;

    return NextResponse.json(limitedBlogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json([], { status: 500 });
  }
}
