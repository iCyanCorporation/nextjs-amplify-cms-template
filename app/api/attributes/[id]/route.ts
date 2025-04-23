import { amplifyClient } from "@/hooks/useAmplifyClient";
import { fetchAuthSession } from "aws-amplify/auth";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

// GET /api/attributes/:id - Get a specific attribute
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const result = await amplifyClient.models.Attribute.get(
      { id },
      { authMode: "identityPool" }
    );

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
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { name, type, options } = await request.json();
  // AWSJSON scalar expects a JSON string
  const formattedOptions = JSON.stringify(options);
  console.log("Updating attribute:", {
    id,
    name,
    type,
    options: formattedOptions,
  });
  try {
    // const session = await fetchAuthSession();
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }
    // const authToken = session.tokens?.accessToken;

    const result = await amplifyClient.models.Attribute.update(
      { id, name, type, options: formattedOptions },
      { authMode: "userPool" }
    );
    console.log("Attribute update result:", result);
    const record = (result as any).data ?? result;
    return NextResponse.json(record);
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
  const authHeader = request.headers.get("authorization");
  if (!authHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Check if attribute exists
    const existingResult = await amplifyClient.models.Attribute.get(
      { id },
      { authMode: "identityPool" }
    );
    if (!existingResult.data) {
      return NextResponse.json(
        { error: "Attribute not found" },
        { status: 404 }
      );
    }

    // Delete the attribute
    const result = await amplifyClient.models.Attribute.delete(
      { id },
      { authMode: "userPool" }
    );

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
