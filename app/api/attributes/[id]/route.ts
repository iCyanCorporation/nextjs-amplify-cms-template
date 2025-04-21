import { NextRequest, NextResponse } from "next/server";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource"; // Adjust the path as necessary
import { Amplify } from "aws-amplify";
import config from "@/amplify_outputs.json";

Amplify.configure(config, { ssr: true });

const client = generateClient<Schema>();

type Params = Promise<{
  id: string;
}>;
// GET /api/attributes/[id] - Get a specific attribute by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Params }
) {
  // const id = params.id;
  const { id } = await params;
  try {
    const { data: attribute, errors } = await client.models.Attribute.get({
      id,
    });

    if (errors || !attribute) {
      console.error("Error fetching attribute:", errors);
      return NextResponse.json(
        { error: "Attribute not found or failed to fetch" },
        { status: 404 }
      );
    }

    return NextResponse.json(attribute);
  } catch (error) {
    console.error(`Unexpected error fetching attribute ${id}:`, error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}

// PUT /api/attributes/[id] - Update a specific attribute by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: Params }
) {
  // const id = params.id;
  const { id } = await params;
  try {
    const body = await request.json();
    const { name, type, options, isRequired } = body;

    // Fetch the existing attribute to ensure it exists
    const { data: existingAttribute, errors: fetchErrors } =
      await client.models.Attribute.get({ id });
    if (fetchErrors || !existingAttribute) {
      console.error("Error fetching attribute for update:", fetchErrors);
      return NextResponse.json(
        { error: "Attribute not found or failed to fetch for update" },
        { status: 404 }
      );
    }

    // Basic validation
    if (!name && !type && options === undefined && isRequired === undefined) {
      return NextResponse.json(
        { error: "No update fields provided" },
        { status: 400 }
      );
    }

    // Validate type enum if provided
    if (type) {
      const validTypes = ["text", "number", "boolean", "color"];
      if (!validTypes.includes(type)) {
        return NextResponse.json(
          {
            error: `Invalid type: ${type}. Must be one of ${validTypes.join(", ")}`,
          },
          { status: 400 }
        );
      }
    }

    const updateData: Partial<Schema["Attribute"]["type"]> = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (options !== undefined) updateData.options = options;
    if (isRequired !== undefined) updateData.isRequired = isRequired;

    const { data: updatedAttribute, errors } =
      await client.models.Attribute.update({ id, ...updateData });

    if (errors) {
      console.error(`Error updating attribute ${id}:`, errors);
      return NextResponse.json(
        { error: "Failed to update attribute", details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json(updatedAttribute);
  } catch (error: any) {
    console.error(`Unexpected error updating attribute ${id}:`, error);
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

// DELETE /api/attributes/[id] - Delete a specific attribute by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Params }
) {
  // const id = params.id;
  const { id } = await params;

  try {
    // Optional: Check if attribute exists before deleting
    const { data: existingAttribute, errors: fetchErrors } =
      await client.models.Attribute.get({ id });
    if (fetchErrors || !existingAttribute) {
      console.error("Attribute not found for deletion:", fetchErrors);
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    const { errors } = await client.models.Attribute.delete({ id });

    if (errors) {
      console.error(`Error deleting attribute ${id}:`, errors);
      return NextResponse.json(
        { error: "Failed to delete attribute", details: errors },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Attribute deleted successfully" },
      { status: 200 }
    ); // Or 204 No Content
  } catch (error) {
    console.error(`Unexpected error deleting attribute ${id}:`, error);
    return NextResponse.json(
      { error: "Unexpected error occurred" },
      { status: 500 }
    );
  }
}
