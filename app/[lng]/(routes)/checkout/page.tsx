"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCartContext } from "@/app/contexts/CartContext";
import { formatPrice } from "@/lib/utils";
import { useProductContext } from "@/app/contexts/ProductContext";

// Define type for form data
interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const cart = useCartContext();
  const { getAttributeName } = useProductContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "TW",
    paymentMethod: "bank",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const shippingPrice = 0; // Free shipping for now
  const taxPrice = totalPrice * 0.1; // Example tax calculation
  const finalTotal = totalPrice + shippingPrice + taxPrice;

  const onCheckout = async () => {
    try {
      setIsLoading(true);

      // Check if cart is empty
      if (cart.items.length === 0) {
        console.error("Cannot checkout with empty cart");
        return;
      }

      // TODO: Implement your checkout logic here using formData
      // For example, integrate with a payment gateway

      // For now, just clear the cart and show success
      cart.clearCart();

      // Check if the success route exists or redirect to home
      try {
        router.push("/checkout/success");
      } catch (routeError) {
        console.warn("Success page not found, redirecting to home");
        router.push("/");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Customer Information & Shipping */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Information */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="postalCode">Postal Code</Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select
                  value={formData.country}
                  onValueChange={(value) =>
                    handleSelectChange("country", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TW">Taiwan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleSelectChange("paymentMethod", value)
              }
            >
              {/* <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="credit" id="credit" />
                <Label htmlFor="credit">Credit Card</Label>
              </div>
              <div className="flex items-center space-x-2 mb-3">
                <RadioGroupItem value="paypal" id="paypal" />
                <Label htmlFor="paypal">PayPal</Label>
              </div> */}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="bank" id="bank" />
                <Label htmlFor="bank">Bank Transfer</Label>
              </div>
            </RadioGroup>

            {formData.paymentMethod === "credit" && (
              <div className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="col-span-2">
                    <Label htmlFor="expiration">Expiration Date</Label>
                    <Input id="expiration" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Label htmlFor="cvc">CVC</Label>
                    <Input id="cvc" placeholder="123" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Order Summary */}
        <div>
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

            <div className="max-h-[300px] overflow-y-auto mb-4">
              <ul className="divide-y divide-border">
                {cart.items.map((item) => (
                  <li key={item.id} className="py-3 flex gap-4">
                    {item.image && (
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-border">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-sm font-medium">{item.title}</h3>
                          <h4 className="text-sm font-medium">
                            {item.subtitle}
                          </h4>
                        </div>
                        <p className="text-sm font-medium">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Qty: {item.quantity}
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
                                  {Array.isArray(vals) ? vals.join(", ") : vals}
                                </span>
                              ))}
                          </div>
                        )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-4" />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <p>Subtotal</p>
                <p>{formatPrice(totalPrice)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Shipping</p>
                <p>{formatPrice(shippingPrice)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>Tax</p>
                <p>{formatPrice(taxPrice)}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-medium">
              <p>Total</p>
              <p>{formatPrice(finalTotal)}</p>
            </div>

            <Button
              className="w-full mt-6"
              disabled={cart.items.length === 0 || isLoading}
              onClick={onCheckout}
            >
              {isLoading ? "Processing..." : "Place Order"}
            </Button>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/cart")}
                size="sm"
                className="mr-2"
              >
                Back to Cart
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                size="sm"
              >
                Continue Shopping
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
