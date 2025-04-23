import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    // get specific variant for a product
    if (id) {
      const { data } = await amplifyClient.models.ProductVariant.get(
        { id },
        { authMode: "identityPool" }
      );
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data } = await amplifyClient.models.ProductVariant.create(
      {
        ...body,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      { authMode: "identityPool" }
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create variant" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body = await request.json();
    const { data } = await amplifyClient.models.ProductVariant.update(
      {
        id,
        ...body,
        updatedAt: new Date().toISOString(),
      },
      { authMode: "identityPool" }
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update variant" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const { data } = await amplifyClient.models.ProductVariant.delete(
      { id },
      { authMode: "identityPool" }
    );
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete variant" },
      { status: 500 }
    );
  }
}
