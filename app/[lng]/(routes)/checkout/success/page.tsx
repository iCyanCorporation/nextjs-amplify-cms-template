"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

export default function CheckoutSuccessPage() {
  const params = useParams();
  const lng = Array.isArray(params?.lng) ? params.lng[0] : params?.lng || "en";
  const { t } = useTranslation(lng, "checkout");

  return (
    <div className="container mx-auto py-16 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-6 flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold mb-4">
          {t("orderConfirmation", "Order Confirmation")}
        </h1>

        <p className="text-muted-foreground mb-8">
          {t(
            "thankYouForYourOrder",
            "Thank you for your order! Your order has been successfully placed."
          )}
        </p>
      </div>
    </div>
  );
}
