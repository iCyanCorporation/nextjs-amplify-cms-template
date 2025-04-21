import { NextRequest, NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource"; // Adjust the path as necessary
import { Amplify } from "aws-amplify";
import config from "@/amplify_outputs.json";

Amplify.configure(config, { ssr: true });

const client = generateClient<Schema>();

// GET /api/attributes - List all attributes
export async function GET() {
  try {
    const { data: attributes, errors } = await client.models.Attribute.list();
    if (errors) {
      console.error("Error fetching attributes:", errors);
      return NextResponse.json(
        { error: "Failed to fetch attributes", details: errors },
        { status: 500 }
      );
    }
    return NextResponse.json(attributes);
  } catch (error) {
    console.error("Unexpected error fetching attributes:", error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}

// POST /api/attributes - Create a new attribute
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, options, isRequired } = body;

    // Basic validation
    if (!name || !type) {
      return NextResponse.json(
        { error: "Missing required fields: name and type" },
        { status: 400 }
      );
    }

    // Validate type enum
    const validTypes = ["text", "number", "boolean", "color"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        {
          error: `Invalid type: ${type}. Must be one of ${validTypes.join(", ")}`,
        },
        { status: 400 }
      );
    }

    const { data: newAttribute, errors } = await client.models.Attribute.create(
      {
        name,
        type,
        options: options || [], // Default to empty array if not provided
        isRequired: isRequired === true, // Default to false if not provided or not true
        // productId is ignored due to schema definition concerns
      }
    );

    if (errors) {
      console.error("Error creating attribute:", errors);
      return NextResponse.json(
        { error: "Failed to create attribute", details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json(newAttribute, { status: 201 });
  } catch (error: any) {
    console.error("Unexpected error creating attribute:", error);
    if (error.name === "SyntaxError") {
      // Handle JSON parsing errors
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
