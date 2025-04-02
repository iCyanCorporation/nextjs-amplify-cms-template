"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";

import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export const Cart = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const cart = useCart();

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );
  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative rounded-full hover:bg-secondary/80"
        >
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg border-l dark:border-neutral-800">
        <SheetHeader>
          <SheetTitle className="text-foreground">
            Cart ({totalItems})
          </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-5 py-4">
          {cart.items.length === 0 && (
            <p className="text-muted-foreground text-center">
              No items in cart.
            </p>
          )}
          {cart.items.map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-4 p-3 rounded-lg hover:bg-accent/50"
            >
              <div className="flex items-center gap-4">
                {item.image && (
                  <div className="relative aspect-square w-16 overflow-hidden rounded-lg border dark:border-neutral-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex flex-col">
                  <p className="line-clamp-1 text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <Button
                  aria-label="Remove item"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => cart.removeItem(item.id)}
                >
                  <span className="sr-only">Remove item</span>×
                </Button>
              </div>
            </div>
          ))}
        </div>
        {cart.items.length > 0 && (
          <>
            <Separator className="dark:bg-neutral-800" />
            <div className="space-y-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">Total</p>
                <p className="text-sm font-medium text-foreground">
                  {formatPrice(totalPrice)}
                </p>
              </div>
              <SheetFooter>
                <Button
                  className="w-full"
                  onClick={() => {
                    router.push("/cart");
                    setOpen(false);
                  }}
                >
                  Check your Cart
                </Button>
              </SheetFooter>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};
