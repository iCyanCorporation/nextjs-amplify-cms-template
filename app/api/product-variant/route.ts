import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    // get specific variant for a product
    if (productId) {
      const { data } = await amplifyClient.models.ProductVariant.list({
        filter: {
          productId: {
            eq: productId,
          },
        },
        authMode: "identityPool",
      });
      return NextResponse.json(data);
    }

    // get all variants for a product
    const { data } = await amplifyClient.models.ProductVariant.list({
      authMode: "identityPool",
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch variants" },
      { status: 500 }
    );
  }
}
