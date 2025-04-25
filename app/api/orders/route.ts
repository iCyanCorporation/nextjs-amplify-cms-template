import { amplifyClient } from "@/hooks/useAmplifyClient";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  try {
    if (id) {
      const result = await amplifyClient.models.Order.get(
        {
          id: id,
        },
        { authMode: "identityPool" }
      );

      if (!result.data) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
      }

      return NextResponse.json(result.data);
    } else {
      const result = await amplifyClient.models.Order.list({
        authMode: "identityPool",
      });

      if (!result.data) {
        return NextResponse.json([]);
      }

      return NextResponse.json(result.data);
    }
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Failed to load order" },
      { status: 500 }
    );
  }
}

// Optional: Add a POST method to create new orders
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    if (
      !body.orderNumber ||
      !body.customerName ||
      !body.customerEmail ||
      !body.totalAmount
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await amplifyClient.models.Order.create({
      orderNumber: body.orderNumber,
      customerName: body.customerName,
      customerEmail: body.customerEmail,
      totalAmount: body.totalAmount,
      status: body.status || "pending",
      shippingAddress: body.shippingAddress,
      paymentInfo: body.paymentInfo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(result.data);
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
