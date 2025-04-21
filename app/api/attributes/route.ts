import { NextRequest, NextResponse } from "next/server";
import { generateClient } from "aws-amplify/api";
import { type Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";

import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

export async function GET(request: NextRequest) {
  try {
    const client = generateClient<Schema>();
    const attributes = await client.models.Attribute.list();

    return NextResponse.json({ attributes: attributes.data }, { status: 200 });
  } catch (error) {
    console.error("Error fetching attributes:", error);
    return NextResponse.json(
      { error: "Failed to fetch attributes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const client = generateClient<Schema>();
    const attribute = await client.models.Attribute.create(body);

    return NextResponse.json(attribute, { status: 201 });
  } catch (error) {
    console.error("Error creating attribute:", error);
    return NextResponse.json(
      { error: "Failed to create attribute" },
      { status: 500 }
    );
  }
}
