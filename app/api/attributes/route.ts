import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await amplifyClient.models.Attribute.list({
      authMode: "identityPool",
    });
    // return wrapper for system attributes list
    return NextResponse.json({ attributes: result.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return NextResponse.json(
      { error: "Failed to fetch attributes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const { name, type } = await request.json();

  try {
    const authToken = request.headers.get("Authorization");
    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await amplifyClient.models.Attribute.create(
      { name, type },
      { authMode: "identityPool", authToken }
    );
    console.log("Attribute create result:", result);
    // unwrap data if present, else use result directly
    const record = (result as any).data ?? result;
    return NextResponse.json(record, { status: 201 });
  } catch (error) {
    console.error("Error creating attribute:", error);
    return NextResponse.json(
      { error: "Failed to create attribute" },
      { status: 500 }
    );
  }
}
