import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

// GET /api/settings/:id - Get a specific setting
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const result = await amplifyClient.models.Settings.get(
      { id },
      { authMode: "identityPool" }
    );
    if (!result.data) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching setting:", error);
    return NextResponse.json({ error: "Failed to fetch setting" }, { status: 500 });
  }
}

// PUT /api/settings/:id - Update a specific setting
export async function PUT(request: Request, { params }: { params: Params }) {
  const authToken = request.headers.get("Authorization");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { key, value, description, group } = await request.json();
  try {
    const result = await amplifyClient.models.Settings.update(
      { id, key, value, description, group },
      { authMode: "identityPool", authToken }
    );
    const record = (result as any).data ?? result;
    return NextResponse.json(record);
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

// DELETE /api/settings/:id - Delete a specific setting
export async function DELETE(request: Request, { params }: { params: Params }) {
  const authToken = request.headers.get("Authorization");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const result = await amplifyClient.models.Settings.delete(
      { id },
      { authMode: "identityPool", authToken }
    );
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting setting:", error);
    return NextResponse.json({ error: "Failed to delete setting" }, { status: 500 });
  }
}
