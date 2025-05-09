import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;
// Get a single blog by ID
export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  try {
    const result = await amplifyClient.models.Blog.get(
      { id },
      { authMode: "identityPool" }
    );
    if (!result.data) {
      return NextResponse.json({ error: "not found" }, { status: 404 });
    }
    // Clean up the data
    const cleanedData = {
      ...result.data,
      tags: result.data.tags
        ? result.data.tags.filter((tag): tag is string => tag !== null)
        : null,
    };
    return NextResponse.json(cleanedData);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return NextResponse.json({ error: "Failed to load blog" }, { status: 500 });
  }
}

// Update a blog by ID
export async function PUT(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  try {
    const body = await request.json();
    const updateInput = { id, ...body };
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }
    const result = await amplifyClient.models.Blog.update(updateInput, {
      authMode: "identityPool",
      authToken,
    });
    if (!result.data) {
      return NextResponse.json(
        { error: "not found or not updated" },
        { status: 404 }
      );
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating blog::", error);
    return NextResponse.json(
      { error: "Failed to update blog" },
      { status: 500 }
    );
  }
}

// Delete a blog by ID
export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Missing ID" }, { status: 400 });
  }
  try {
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json(
        { error: "Missing Authorization header" },
        { status: 401 }
      );
    }
    await amplifyClient.models.Blog.delete(
      { id },
      { authMode: "identityPool", authToken }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
