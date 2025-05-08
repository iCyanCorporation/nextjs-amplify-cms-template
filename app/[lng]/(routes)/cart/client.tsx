"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/app/contexts/CartContext";
import { useProductContext } from "@/app/contexts/ProductContext";
import { useSettingContext } from "@/app/contexts/SettingContext";
import { useTranslation } from "@/app/i18n/client";

export default function CartClient() {
  const params = useParams();
  const lng = Array.isArray(params?.lng) ? params.lng[0] : params?.lng || "en";
  const { t } = useTranslation(lng, "cart");

  const router = useRouter();
  const cart = useCartContext();
  const { getAttributeName } = useProductContext();
  const { formatPrice } = useSettingContext();

  const [isUpdating, setIsUpdating] = useState(false);

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleQuantityChange = (
    id: string,
    action: "increase" | "decrease"
  ) => {
    setIsUpdating(true);

    try {
      const item = cart.items.find((item) => item.id === id);
      if (!item) return;

      if (action === "increase") {
        // Add a single copy of the item to increase quantity by one
        const itemToAdd = { ...item, quantity: 1 };
        cart.addItem(itemToAdd);
      } else if (action === "decrease" && item.quantity > 1) {
        // Use removeItem with decrementOnly flag to preserve order
        cart.removeItem(item.id, true);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveItem = (id: string) => {
    setIsUpdating(true);
    try {
      cart.removeItem(id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckout = () => {
    // Only proceed if there are items in the cart
    if (cart.items.length === 0) {
      return;
    }

    try {
      router.push("/checkout");
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback if navigation fails
      window.location.href = "/checkout";
    }
  };

  // Calculate total items safely
  const totalItems = () => {
    try {
      return cart.items.reduce((total, item) => total + item.quantity, 0);
    } catch (error) {
      console.error("Error calculating total items:", error);
      return 0;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
        <ShoppingCart className="h-8 w-8" />
        {t("yourCart", "Your Cart")}
      </h1>

      {cart.items.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-medium mb-4">
            {t("emptyTitle", "Your cart is empty")}
          </h2>
          <p className="text-muted-foreground mb-6">
            {t("emptyDesc", "Add items to your cart to proceed to checkout.")}
          </p>
          <Button onClick={() => router.push("/")}>
            {t("continueShopping", "Continue Shopping")}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column - Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border mb-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("cartItems", "Cart Items")}
              </h2>
              <Separator className="mb-4" />

              <div className="divide-y divide-border">
                {cart.items.map((item) => (
                  <div key={item.id} className="py-4 flex items-center gap-4">
                    {item.image && (
                      <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <div>
                        <h3 className="text-base font-medium">{item.title}</h3>
                        <h4 className="text-base font-medium">
                          {item.subtitle}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          {t("unitPrice", "Unit Price")}:{" "}
                          {formatPrice(item.price)}
                        </p>
                        {item.attributes &&
                          Object.keys(item.attributes).length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {Object.entries(item.attributes)
                                .filter(([, vals]) => {
                                  if (Array.isArray(vals))
                                    return (
                                      vals.length > 0 &&
                                      vals.some((v) => v && v !== "")
                                    );
                                  return vals != null && vals !== "";
                                })
                                .map(([attrId, vals]) => (
                                  <span key={attrId} className="mr-2">
                                    {getAttributeName(attrId)}:{" "}
                                    {Array.isArray(vals)
                                      ? vals.join(", ")
                                      : vals}
                                  </span>
                                ))}
                            </div>
                          )}
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() =>
                              handleQuantityChange(item.id, "decrease")
                            }
                            disabled={item.quantity <= 1 || isUpdating}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="px-4">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() =>
                              handleQuantityChange(item.id, "increase")
                            }
                            disabled={isUpdating}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <span className="font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </span>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={isUpdating}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={() => router.push("/")}>
                {t("continueShopping", "Continue Shopping")}
              </Button>

              <Button
                onClick={() => cart.clearCart()}
                variant="destructive"
                disabled={isUpdating}
              >
                {t("clearCart", "Clear Cart")}
              </Button>
            </div>
          </div>

          {/* Right column - Order Summary */}
          <div>
            <div className="bg-card rounded-lg p-6 shadow-sm border border-border sticky top-6">
              <h2 className="text-xl font-semibold mb-4">
                {t("orderSummary", "Order Summary")}
              </h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <p>
                    {t("items", {
                      count: totalItems(),
                      defaultValue: "Items ({{count}})",
                    })}
                  </p>
                  <p>{formatPrice(totalPrice)}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>{t("shipping", "Shipping")}</p>
                  <p>{t("shippingCalc", "Calculated at checkout")}</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p>{t("tax", "Tax")}</p>
                  <p>{t("taxCalc", "Calculated at checkout")}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between font-medium text-lg mb-6">
                <p>{t("subtotal", "Subtotal")}</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
                disabled={cart.items.length === 0 || isUpdating}
              >
                {t("proceedToCheckout", "Proceed to Checkout")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
