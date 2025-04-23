import { NextResponse } from "next/server";
import { amplifyClient } from "@/hooks/useAmplifyClient";
import { generateClient } from "aws-amplify/api";
import type { Schema } from "@/amplify/data/resource";

export async function GET() {
  try {
    const result = await amplifyClient.models.Attribute.list();
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
  // Only pick allowed create fields
  // Enforce Cognito owner auth
  const authToken = request.headers.get("authorization");
  if (!authToken) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  // @ts-ignore: override Amplify client options for Cognito auth
  const client = generateClient<Schema>({ authMode: "AMAZON_COGNITO_USER_POOLS", jwtToken: authToken });
  const { name, type } = await request.json();

  try {
    const result = await client.models.Attribute.create({ name, type });
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
