"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export default function CheckoutSuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>

        <p className="text-muted-foreground mb-8">
          Thank you for your purchase. We have received your order and will
          process it shortly. A confirmation email has been sent with your order
          details.
        </p>
      </div>
    </div>
  );
}
