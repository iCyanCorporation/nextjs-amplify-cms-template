import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

type Params = Promise<{ id: string }>;

export async function GET(request: Request, { params }: { params: Params }) {
  const { id } = await params;

  try {
    const result = await amplifyClient.models.Order.get(
      { id },
      { authMode: "identityPool" }
    );
    if (!result.data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
