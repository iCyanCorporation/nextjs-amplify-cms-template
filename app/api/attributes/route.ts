import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

// GET /api/attributes - Get all attributes
export async function GET() {
  try {
    const result = await amplifyClient.models.Attribute.list();

    if (!result.data) {
      return NextResponse.json(
        { error: "No attributes found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return NextResponse.json(
      { error: "Failed to fetch attributes" },
      { status: 500 }
    );
  }
}

// POST /api/attributes - Create a new attribute
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate the request body
    if (!body.name || !body.type) {
      return NextResponse.json(
        { error: "Name and type are required fields" },
        { status: 400 }
      );
    }

    // Handle both frontend format (required) and backend format (isRequired)
    const isRequired =
      body.isRequired !== undefined
        ? body.isRequired
        : body.required !== undefined
          ? body.required
          : false;

    // Ensure options is an array
    const options = Array.isArray(body.options) ? body.options : [];

    const result = await amplifyClient.models.Attribute.create({
      name: body.name,
      type: body.type,
      options: options,
      isRequired: Boolean(isRequired),
    });

    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to create attribute" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error creating attribute:", error);
    return NextResponse.json(
      { error: "Failed to create attribute" },
      { status: 500 }
    );
  }
}
