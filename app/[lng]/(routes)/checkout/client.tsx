"use client";

import React, { useState, ChangeEvent } from "react";
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
import { useProductContext } from "@/app/contexts/ProductContext";
import { useToast } from "@/hooks/use-toast";
import orderConfirmationEmailTemplate from "./order-confirmation-email";
import { useSettingContext } from "@/app/contexts/SettingContext";
import clsx from "clsx";
import { useParams } from "next/navigation";
import { useTranslation } from "@/app/i18n/client";

// Define type for form data
interface FormData {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
}

export default function Client() {
  const params = useParams();
  const lng = Array.isArray(params?.lng) ? params.lng[0] : params?.lng || "en";
  const { t } = useTranslation(lng, "checkout");

  const router = useRouter();
  const { toast } = useToast();

  const cart = useCartContext();
  const { getAttributeName } = useProductContext();
  const { getSetting, formatPrice } = useSettingContext();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "TW",
    paymentMethod: "bank",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Payment methods from settings
  const [paymentSettings, setPaymentSettings] = useState<
    Record<string, string>
  >({});

  // Fetch payment method settings on mount
  React.useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings) {
          const map: Record<string, string> = {};
          for (const s of data.settings) {
            // If this is a grouped block, parse and merge
            if (s.key === "settings_general" && s.value) {
              try {
                const general = JSON.parse(s.value);
                Object.assign(map, general);
              } catch {}
            } else {
              map[s.key] = s.value;
            }
          }
          setPaymentSettings(map);
        }
      });
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.phone) newErrors.phone = "Phone number is required";
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.city) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.postalCode) newErrors.postalCode = "Postal code is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Payment method is required";
    return newErrors;
  };

  const totalPrice = cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Get settings for shipping and tax
  const minFreeShippingRaw = getSetting("min_free_shipping");
  const standardShippingRaw = getSetting("standard_shipping");
  const standardShippingEnabledRaw = getSetting("standard_shipping_enabled");
  const standardShippingNameRaw = getSetting("standard_shipping_name");
  const expressShippingRaw = getSetting("express_shipping");
  const expressShippingEnabledRaw = getSetting("express_shipping_enabled");
  const expressShippingNameRaw = getSetting("express_shipping_name");
  const taxEnabledRaw = getSetting("tax_enabled");
  const defaultTaxRateRaw = getSetting("default_tax_rate");
  const includeTaxRaw = getSetting("include_tax");

  // Get currency from settings
  const currency = getSetting("currency") || "USD";

  // Use currency in formatPrice
  function formatPriceWithCurrency(amount: number) {
    if (isNaN(amount) || currency === "") {
      return "";
    }
    return `${formatPrice(amount)}`;
  }

  // If any required value is missing, do not show this page
  if (
    minFreeShippingRaw == null ||
    standardShippingRaw == null ||
    standardShippingEnabledRaw == null ||
    standardShippingNameRaw == null ||
    expressShippingRaw == null ||
    expressShippingEnabledRaw == null ||
    expressShippingNameRaw == null ||
    taxEnabledRaw == null ||
    defaultTaxRateRaw == null ||
    includeTaxRaw == null
  ) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="min-h-[300px] max-w-xl mx-auto text-3xl font-bold mb-8 text-center justify-center flex items-center">
          {t(
            "errorMessage",
            "Something went wrong. Please contact us for assistance."
          )}
        </h1>
      </div>
    );
  }

  const minFreeShipping = parseFloat(minFreeShippingRaw);
  const standardShipping = parseFloat(standardShippingRaw);
  const standardShippingEnabled = standardShippingEnabledRaw === "1";
  const expressShipping = parseFloat(expressShippingRaw);
  const expressShippingEnabled = expressShippingEnabledRaw === "1";
  const taxEnabled = taxEnabledRaw === "1";
  const defaultTaxRate = parseFloat(defaultTaxRateRaw);
  const includeTax = includeTaxRaw === "1";

  // Shipping method selection state
  const [selectedShipping, setSelectedShipping] = useState(
    standardShippingEnabled
      ? "standard"
      : expressShippingEnabled
        ? "express"
        : ""
  );

  // Build available shipping methods
  const availableShippingMethods = [];
  if (standardShippingEnabled) {
    availableShippingMethods.push({
      key: "standard",
      name: standardShippingNameRaw?.trim()
        ? standardShippingNameRaw
        : t("standardShipping", "Standard Shipping"),
      price: standardShipping,
    });
  }
  if (expressShippingEnabled) {
    availableShippingMethods.push({
      key: "express",
      name: expressShippingNameRaw?.trim()
        ? expressShippingNameRaw
        : t("expressShipping", "Express Shipping"),
      price: expressShipping,
    });
  }

  // Calculate shipping price based on selection and free shipping
  let shippingPrice = 0;
  if (minFreeShipping > 0 && totalPrice >= minFreeShipping) {
    shippingPrice = 0;
  } else {
    const selected = availableShippingMethods.find(
      (m) => m.key === selectedShipping
    );
    shippingPrice = selected ? selected.price : 0;
  }

  // Calculate tax
  let taxPrice = 0;
  if (taxEnabled) {
    taxPrice = includeTax
      ? (totalPrice * defaultTaxRate) / (100 + defaultTaxRate)
      : (totalPrice + shippingPrice) * (defaultTaxRate / 100);
  }

  // Calculate final total
  const finalTotal = totalPrice + shippingPrice + taxPrice;

  const onCheckout = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      setIsLoading(true);

      // Check if cart is empty
      if (cart.items.length === 0) {
        console.error("Cannot checkout with empty cart");
        return;
      }

      // Get owner-set value for selected payment method
      let paymentMethodValue = "";
      if (formData.paymentMethod === "bank") {
        paymentMethodValue = paymentSettings["payment_bank_transfer"] || "";
      } else if (formData.paymentMethod === "qr") {
        paymentMethodValue = paymentSettings["payment_qr_code"] || "";
      } else if (formData.paymentMethod === "custom") {
        paymentMethodValue = paymentSettings["payment_custom_link"] || "";
      }

      if (!formData.email || !paymentMethodValue) {
        console.error("Missing required fields");
        toast({
          title: t("missingFieldsTitle", "Missing required fields"),
          description: t(
            "missingFieldsDescription",
            "Please fill in all required fields."
          ),
        });
        setIsLoading(false);
        return;
      }

      // debug
      // console.log("Payment Method Value:", paymentMethodValue);

      // Prepare order items HTML
      const orderItemsHtml = cart.items
        .map(
          (item) => `
            <tr>
              <td>${item.title}${item.subtitle ? `<br/><small>${item.subtitle}</small>` : ""}</td>
              <td>${
                item.attributes && Object.keys(item.attributes).length > 0
                  ? Object.entries(item.attributes)
                      .filter(([, vals]) => {
                        if (Array.isArray(vals))
                          return (
                            vals.length > 0 && vals.some((v) => v && v !== "")
                          );
                        return vals != null && vals !== "";
                      })
                      .map(
                        ([attrId, vals]) =>
                          `${getAttributeName(attrId)}: ${Array.isArray(vals) ? vals.join(", ") : vals}`
                      )
                      .join("<br/>")
                  : "-"
              }</td>
              <td>${formatPriceWithCurrency(item.price)}</td>
              <td>${item.quantity}</td>
              <td>${formatPriceWithCurrency(item.price * item.quantity)}</td>
            </tr>
          `
        )
        .join("");

      // Replace placeholders in template
      // Format payment method value for email (show image if QR code)
      let paymentMethodValueHtml = paymentMethodValue;
      if (formData.paymentMethod === "qr" && paymentMethodValue) {
        paymentMethodValueHtml = `<img src="${paymentMethodValue}" alt="QR Code" style="max-width:200px;max-height:200px;border:1px solid #ccc;border-radius:8px;" />`;
      }

      const htmlBody = orderConfirmationEmailTemplate
        .replace(/{{myEmail}}/g, getSetting("support_email") || "")
        .replace(/{{firstName}}/g, formData.firstName)
        .replace(/{{lastName}}/g, formData.lastName)
        .replace(/{{email}}/g, formData.email)
        .replace(/{{phone}}/g, formData.phone)
        .replace(/{{address}}/g, formData.address)
        .replace(/{{city}}/g, formData.city)
        .replace(/{{state}}/g, formData.state)
        .replace(/{{postalCode}}/g, formData.postalCode)
        .replace(/{{country}}/g, formData.country)
        .replace(
          /{{paymentMethod}}/g,
          formData.paymentMethod === "bank"
            ? t("bankTransfer", "Bank Transfer")
            : formData.paymentMethod
        )
        .replace(/{{paymentMethodValue}}/g, paymentMethodValueHtml)
        .replace(/{{orderItems}}/g, orderItemsHtml)
        .replace(/{{subtotal}}/g, formatPriceWithCurrency(totalPrice))
        .replace(/{{shipping}}/g, formatPriceWithCurrency(shippingPrice))
        .replace(/{{tax}}/g, formatPriceWithCurrency(taxPrice))
        .replace(/{{total}}/g, formatPriceWithCurrency(finalTotal));

      // Send order confirmation email
      // console.log("Sending email with body:", htmlBody);
      const emailBody = {
        myEmail: getSetting("support_email"),
        toEmailAddresses: [formData.email],
        subject: `[${getSetting("store_name")}] ${t("orderConfirmation", "Order Confirmation")}`,
        body: htmlBody,
        paymentMethod: formData.paymentMethod,
        paymentMethodValue: paymentMethodValue,
      };
      // console.log("emailBody:::", emailBody);
      // return;

      const response = await fetch("/api/send-mail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailBody),
      });
      // console.log("response:::", response);

      if (response.status !== 200) {
        throw new Error("Failed to send email");
      }

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
      toast({
        title: t("checkoutFailedTitle", "Checkout failed"),
        description: t(
          "checkoutFailedDescription",
          "An error occurred while processing your order."
        ),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">
        {t("checkoutTitle", "Checkout")}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Customer Information & Shipping */}
        <div className="lg:col-span-2 space-y-8">
          {/* Customer Information */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">
              {t("contactInformation", "Contact Information")}
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">
                  {t("email", "Email")} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={t("emailPlaceholder", "your@email.com")}
                  required
                  className={clsx(
                    errors.email && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("emailRequired", errors.email)}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="phone">
                  {t("phone", "Phone Number")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t("phonePlaceholder", "e.g. 0900-000-000")}
                  required
                  className={clsx(
                    errors.phone && "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("phoneRequired", errors.phone)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">
              {t("shippingAddress", "Shipping Address")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="col-span-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="country">
                    {t("country", "Country")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) =>
                      handleSelectChange("country", value)
                    }
                    required
                  >
                    <SelectTrigger
                      className={clsx(
                        errors.country &&
                          "border-red-500 focus-visible:ring-red-500"
                      )}
                    >
                      <SelectValue
                        placeholder={t("selectCountry", "Select country")}
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TW">
                        {t("taiwan", "Taiwan")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.country && (
                    <p className="text-red-500 text-xs mt-1">
                      {t("countryRequired", errors.country)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="postalCode">
                    {t("postalCode", "Postal Code")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                    className={clsx(
                      errors.postalCode &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-xs mt-1">
                      {t("postalCodeRequired", errors.postalCode)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="state">
                    {t("state", "State")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className={clsx(
                      errors.state &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.state && (
                    <p className="text-red-500 text-xs mt-1">
                      {t("stateRequired", errors.state)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="city">
                    {t("city", "City")} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className={clsx(
                      errors.city && "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs mt-1">
                      {t("cityRequired", errors.city)}
                    </p>
                  )}
                </div>
              </div>

              <div className="col-span-4">
                <Label htmlFor="address">
                  {t("address", "Address")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className={clsx(
                    errors.address &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">
                    {t("addressRequired", errors.address)}
                  </p>
                )}
              </div>
              <div className="col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">
                    {t("firstName", "First Name")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className={clsx(
                      errors.firstName &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {t("firstNameRequired", errors.firstName)}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">
                    {t("lastName", "Last Name")}{" "}
                    <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    className={clsx(
                      errors.lastName &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {t("lastNameRequired", errors.lastName)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border">
            <h2 className="text-xl font-semibold mb-4">
              {t("paymentMethod", "Payment Method")}
            </h2>
            <RadioGroup
              value={formData.paymentMethod}
              onValueChange={(value) =>
                handleSelectChange("paymentMethod", value)
              }
            >
              {paymentSettings["payment_bank_transfer_enabled"] === "1" && (
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="bank" id="bank" />
                  <Label htmlFor="bank">
                    {t("bankTransfer", "Bank Transfer")}
                  </Label>
                </div>
              )}
              {paymentSettings["payment_qr_code_enabled"] === "1" && (
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="qr" id="qr" />
                  <Label htmlFor="qr">
                    {t("qrCodePayment", "QR Code Payment")}
                  </Label>
                </div>
              )}
              {paymentSettings["payment_custom_link_enabled"] === "1" && (
                <div className="flex items-center space-x-2 mb-3">
                  <RadioGroupItem value="custom" id="custom" />
                  <Label htmlFor="custom">
                    {t("customPaymentLink", "Custom Payment Link")}
                  </Label>
                </div>
              )}
            </RadioGroup>

            {/* Shipping Method Selection */}
            {availableShippingMethods.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">
                  {t("shippingMethod", "Shipping Method")}
                </h3>
                {minFreeShipping > 0 && (
                  <div className="mb-2 text-sm text-muted-foreground">
                    {t(
                      "minFreeShipping",
                      "Minimum Order Amount for Free Shipping"
                    )}
                    : {formatPriceWithCurrency(minFreeShipping)}
                  </div>
                )}
                <RadioGroup
                  value={selectedShipping}
                  onValueChange={setSelectedShipping}
                >
                  {availableShippingMethods.map((method) => (
                    <div
                      key={method.key}
                      className="flex items-center space-x-2 mb-2"
                    >
                      <RadioGroupItem value={method.key} id={method.key} />
                      <Label htmlFor={method.key}>
                        {method.name} ({formatPriceWithCurrency(method.price)})
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Order Summary */}
        <div>
          <div className="bg-card rounded-lg p-6 shadow-sm border border-border sticky top-6">
            <h2 className="text-xl font-semibold mb-4">
              {t("orderSummary", "Order Summary")}
            </h2>

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
                          {formatPriceWithCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {t("qty", "Qty")}: {item.quantity}
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
                <p>{t("subtotal", "Subtotal")}</p>
                <p>{formatPriceWithCurrency(totalPrice)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>{t("shipping", "Shipping")}</p>
                <p>{formatPriceWithCurrency(shippingPrice)}</p>
              </div>
              <div className="flex justify-between text-sm">
                <p>{t("tax", "Tax")}</p>
                <p>{formatPriceWithCurrency(taxPrice)}</p>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="flex justify-between font-medium">
              <p>{t("total", "Total")}</p>
              <p>{formatPriceWithCurrency(finalTotal)}</p>
            </div>

            <Button
              className="w-full mt-6"
              disabled={cart.items.length === 0 || isLoading}
              onClick={onCheckout}
            >
              {isLoading
                ? t("processing", "Processing...")
                : t("placeOrder", "Place Order")}
            </Button>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => router.push("/cart")}
                size="sm"
                className="mr-2"
              >
                {t("backToCart", "Back to Cart")}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/")}
                size="sm"
              >
                {t("continueShopping", "Continue Shopping")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
