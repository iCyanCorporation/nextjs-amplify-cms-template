"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCart from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

interface AddToCartButtonProps {
  product: {
    id: string;
    name: string;
    price: number;
    images: string[];
  };
}

export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const cart = useCart();
  const { toast } = useToast();

  const onAddToCart = () => {
    cart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      quantity: 1,
    });

    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
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
