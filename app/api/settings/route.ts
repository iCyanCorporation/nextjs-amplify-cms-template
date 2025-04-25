import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

// GET /api/settings - List all settings
export async function GET(request: Request) {
  try {
    const result = await amplifyClient.models.Settings.list({ authMode: "identityPool" });
    return NextResponse.json({ settings: result.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

// POST /api/settings - Create a new setting
export async function POST(request: Request) {
  const { key, value, description, group } = await request.json();
  try {
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await amplifyClient.models.Settings.create(
      { key, value, description, group },
      { authMode: "identityPool", authToken }
    );
    const record = (result as any).data ?? result;
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating setting:", error);
    return NextResponse.json({ error: "Failed to create setting" }, { status: 500 });
  }
}
