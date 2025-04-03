import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

Amplify.configure(outputs, { ssr: true });

type Params = Promise<{ id: string }>;
export async function GET(request: Request, { params }: { params: Params }) {
  try {
    const { id } = await params;
    const result = await amplifyClient.models.Product.get({ id: id });

    if (!result.data) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
