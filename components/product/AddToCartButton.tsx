"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartContext } from "@/app/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    images: string[];
  };
  quantity?: number;
  attributes?: Record<string, string[]>;
}

export default function AddToCartButton({
  product,
  quantity = 1,
  attributes,
}: AddToCartButtonProps) {
  const cart = useCartContext();
  const { toast } = useToast();

  const onAddToCart = () => {
    // console.log("Adding to cart:", product, quantity, attributes);
    cart.addItem({
      id: product.id,
      title: product.title,
      subtitle: product.subtitle,
      price: product.price,
      image: product.images[0],
      quantity,
      attributes,
    });
    toast({
      title: "Added to cart",
      description: `${product.title} has been added to your cart.`,
    });
  };

  return (
    <Button
      variant={"default"}
      onClick={onAddToCart}
      size="lg"
      className="w-full hover:opacity-80 transition-opacity duration-200"
    >
      <ShoppingCart className="mr-2 h-5 w-5" />
      Add to Cart
    </Button>
  );
}
