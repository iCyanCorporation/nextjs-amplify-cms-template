import { NextResponse } from "next/server";

// Placeholder image URLs for demo purposes
const placeholderImages = [
  "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
  "https://images.unsplash.com/photo-1525904097878-94fb15835963?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
];

export async function POST() {
  try {
    // In a real implementation, you'd handle the file upload
    // For now, we'll just return a random image URL

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a random placeholder image
    const imageUrl =
      placeholderImages[Math.floor(Math.random() * placeholderImages.length)];

    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
