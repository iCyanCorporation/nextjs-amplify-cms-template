import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: "Missing ID" },
      { status: 400 }
    );
  }

  try {
    const result = await amplifyClient.models.Blog.get({
      id: id,
    });

    if (!result.data) {
      return NextResponse.json(
        { error: "not found" },
        { status: 404 }
      );
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
    return NextResponse.json(
      { error: "Failed to load blog" },
      { status: 500 }
    );
  }
}
