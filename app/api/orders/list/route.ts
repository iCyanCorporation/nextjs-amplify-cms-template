import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
Amplify.configure(outputs, { ssr: true });

import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const result = await amplifyClient.models.Order.list({
      // Optional: add pagination or sorting parameters
      // limit: 20,
      // sort: { field: 'createdAt', direction: 'desc' }
    });

    if (!result.data) {
      return NextResponse.json([]);
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to load orders" },
      { status: 500 }
    );
  }
}
