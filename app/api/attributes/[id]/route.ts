import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

// GET /api/attributes/:id - Get a specific attribute
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const result = await amplifyClient.models.Attribute.get({ id });

    if (!result.data) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching attribute:", error);
    return NextResponse.json(
      { error: "Failed to fetch attribute" },
      { status: 500 }
    );
  }
}

// PUT /api/attributes/:id - Update a specific attribute
export async function PUT(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Check if attribute exists
    const existingResult = await amplifyClient.models.Attribute.get({ id });
    if (!existingResult.data) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
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

    // Update the attribute
    const result = await amplifyClient.models.Attribute.update({
      id,
      name: body.name,
      type: body.type,
      options: options,
      isRequired: Boolean(isRequired),
    });

    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to update attribute" },
        { status: 500 }
      );
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error updating attribute:", error);
    return NextResponse.json(
      { error: "Failed to update attribute" },
      { status: 500 }
    );
  }
}

// DELETE /api/attributes/:id - Delete a specific attribute
export async function DELETE(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;

    // Check if attribute exists
    const existingResult = await amplifyClient.models.Attribute.get({ id });
    if (!existingResult.data) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    // Delete the attribute
    const result = await amplifyClient.models.Attribute.delete({ id });

    if (!result.data) {
      return NextResponse.json(
        { error: "Failed to delete attribute" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting attribute:", error);
    return NextResponse.json(
      { error: "Failed to delete attribute" },
      { status: 500 }
    );
  }
}
