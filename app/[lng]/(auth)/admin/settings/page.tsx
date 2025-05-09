"use client";

import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ImagePickerButton } from "@/components/common/image/ImagePicker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuthToken } from "@/hooks/useAmplifyClient";
import { RefreshCwIcon } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

import {
  SETTINGS_KEYS,
  SettingKeyConfig,
  Setting,
} from "@/app/contexts/SettingContext";

export default function SettingsPage() {
  const [settings, setSettings] = React.useState<Record<string, Setting>>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (data.settings) {
        const map: Record<string, Setting> = {};
        for (const s of data.settings) {
          map[s.key] = s;
        }
        // If settings_general exists, parse and merge its values
        if (map["settings_general"]?.value) {
          try {
            const general = JSON.parse(map["settings_general"].value);
            for (const key in general) {
              map[key] = { key, value: general[key] };
            }
          } catch (e) {}
        }
        // If settings_shipping exists, parse and merge its values
        if (map["settings_shipping"]?.value) {
          try {
            const shipping = JSON.parse(map["settings_shipping"].value);
            for (const key in shipping) {
              map[key] = { key, value: shipping[key] };
            }
          } catch (e) {}
        }
        // If settings_tax exists, parse and merge its values
        if (map["settings_tax"]?.value) {
          try {
            const tax = JSON.parse(map["settings_tax"].value);
            for (const key in tax) {
              map[key] = { key, value: tax[key] };
            }
          } catch (e) {}
        }
        setSettings(map);
      }
    } catch (e) {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  // Helper: get value or fallback to default
  const getFieldValue = (key: string) => {
    return (
      settings[key]?.value ??
      SETTINGS_KEYS.find((k) => k.key === key)?.defaultValue ??
      ""
    );
  };

  // Load settings on mount
  React.useEffect(() => {
    fetchSettings();
  }, []);

  // Handle input changes
  const handleInputChange = (key: string, value: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...(prev[key] || { key }), value },
    }));
  };

  // Save or update all settings as grouped JSON blocks
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        throw new Error("Unauthorized");
      }
      // General block
      const generalKeys = [
        "store_name",
        "support_email",
        "country",
        "currency",
        "phone",
        "zip",
        "state",
        "city",
        "address_1",
        "address_2",
        "payment_bank_transfer_enabled",
        "payment_bank_transfer",
        "payment_qr_code_enabled",
        "payment_qr_code",
        "payment_custom_link_enabled",
        "payment_custom_link",
      ];
      const generalSettings: Record<string, string> = {};
      for (const key of generalKeys) {
        generalSettings[key] = settings[key]?.value || "";
      }
      // Shipping block
      const shippingKeys = [
        "free_shipping_enabled",
        "min_free_shipping",
        "standard_shipping",
        "standard_shipping_enabled",
        "standard_shipping_name",
        "express_shipping",
        "express_shipping_enabled",
        "express_shipping_name",
      ];
      const shippingSettings: Record<string, string> = {};
      for (const key of shippingKeys) {
        shippingSettings[key] = settings[key]?.value || "";
      }
      // Tax block
      const taxKeys = ["tax_enabled", "default_tax_rate", "include_tax"];
      const taxSettings: Record<string, string> = {};
      for (const key of taxKeys) {
        taxSettings[key] = settings[key]?.value || "";
      }
      // Save all blocks
      const payloads = [
        {
          key: "settings_general",
          value: JSON.stringify(generalSettings),
          description: "General settings block",
          group: "general",
        },
        {
          key: "settings_shipping",
          value: JSON.stringify(shippingSettings),
          description: "Shipping settings block",
          group: "shipping",
        },
        {
          key: "settings_tax",
          value: JSON.stringify(taxSettings),
          description: "Tax settings block",
          group: "tax",
        },
      ];
      // Save or update each block
      for (const payload of payloads) {
        const existing = Object.values(settings).find(
          (s) => s.key === payload.key
        );
        let res;
        if (existing && existing.id) {
          res = await fetch(`/api/settings/${existing.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
            body: JSON.stringify(payload),
          });
        } else {
          res = await fetch("/api/settings", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: authToken,
            },
            body: JSON.stringify(payload),
          });
        }
        if (!res.ok) throw new Error(`Failed to save ${payload.key}`);
      }
    } catch (e: any) {
      setError(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
      fetchSettings();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={fetchSettings}>
            <RefreshCwIcon className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleSave} disabled={saving || loading}>
            {saving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>

      {error && <div className="text-red-500">{error}</div>}
      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3 bg-background border-b border-neutral-200 dark:border-white/50 rounded-b-none">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="shipping">Shipping</TabsTrigger>
          <TabsTrigger value="tax">Tax</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Infomation</CardTitle>
              <CardDescription>
                This is the general settings for your store.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    placeholder="Your Store Name"
                    value={getFieldValue("store_name")}
                    onChange={(e) =>
                      handleInputChange("store_name", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    placeholder="support@example.com"
                    value={getFieldValue("support_email")}
                    onChange={(e) =>
                      handleInputChange("support_email", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="USA"
                    value={getFieldValue("country")}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select
                    value={getFieldValue("currency")}
                    onValueChange={(value) =>
                      handleInputChange("currency", value)
                    }
                    disabled={saving || loading}
                  >
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TWD">TWD (NT$)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={getFieldValue("phone")}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Store Address</CardTitle>
              <CardDescription>Your physical business location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="zip">Postal/Zip Code</Label>
                  <Input
                    id="zip"
                    placeholder="10001"
                    value={getFieldValue("zip")}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    value={getFieldValue("country")}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={getFieldValue("state")}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={getFieldValue("city")}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address-1">Address Line 1</Label>
                  <Input
                    id="address-1"
                    placeholder="123 Main St"
                    value={getFieldValue("address_1")}
                    onChange={(e) =>
                      handleInputChange("address_1", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address-2">Address Line 2</Label>
                  <Input
                    id="address-2"
                    placeholder="Suite 101"
                    value={getFieldValue("address_2")}
                    onChange={(e) =>
                      handleInputChange("address_2", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods Section */}
        <TabsContent value="general" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>
                Configure available payment methods for your store.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Bank Transfer */}
                <div className="space-y-2 border p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      id="payment-bank-transfer-enabled"
                      checked={!!getFieldValue("payment_bank_transfer_enabled")}
                      onChange={(e) =>
                        handleInputChange(
                          "payment_bank_transfer_enabled",
                          e.target.checked ? "1" : ""
                        )
                      }
                    />
                    <Label
                      htmlFor="payment-bank-transfer-enabled"
                      className="mb-0"
                    >
                      Enable Bank Transfer
                    </Label>
                  </div>
                  <Label htmlFor="payment-bank-transfer">
                    Bank Transfer Details
                  </Label>
                  <textarea
                    id="payment-bank-transfer"
                    placeholder="Bank account info or instructions"
                    className="w-full min-h-[80px] border rounded-md p-2"
                    value={getFieldValue("payment_bank_transfer")}
                    onChange={(e) =>
                      handleInputChange("payment_bank_transfer", e.target.value)
                    }
                  />
                </div>
                {/* QR Code */}
                <div className="space-y-2 border p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      id="payment-qr-code-enabled"
                      checked={!!getFieldValue("payment_qr_code_enabled")}
                      onChange={(e) =>
                        handleInputChange(
                          "payment_qr_code_enabled",
                          e.target.checked ? "1" : ""
                        )
                      }
                    />
                    <Label htmlFor="payment-qr-code-enabled" className="mb-0">
                      Enable QR Code Payment
                    </Label>
                  </div>
                  <Label htmlFor="payment-qr-code">QR Code Payment Image</Label>
                  <div>
                    <ImagePickerButton
                      buttonText={
                        getFieldValue("payment_qr_code")
                          ? "Change QR Code Image"
                          : "Select QR Code Image"
                      }
                      onSelect={(url) =>
                        handleInputChange(
                          "payment_qr_code",
                          Array.isArray(url) ? url[0] || "" : url
                        )
                      }
                      icon={true}
                      variant="outline"
                      className="mb-2"
                      multiSelect={false}
                    />
                    {getFieldValue("payment_qr_code") && (
                      <img
                        src={getFieldValue("payment_qr_code")}
                        alt="QR Code"
                        className="w-32 h-32 object-contain border rounded"
                      />
                    )}
                  </div>
                </div>
                {/* Custom Payment Link */}
                <div className="space-y-2 border p-3 rounded">
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      id="payment-custom-link-enabled"
                      checked={!!getFieldValue("payment_custom_link_enabled")}
                      onChange={(e) =>
                        handleInputChange(
                          "payment_custom_link_enabled",
                          e.target.checked ? "1" : ""
                        )
                      }
                    />
                    <Label
                      htmlFor="payment-custom-link-enabled"
                      className="mb-0"
                    >
                      Enable Custom Payment Link
                    </Label>
                  </div>
                  <Label htmlFor="payment-custom-link">
                    Custom Payment Link
                  </Label>
                  <Input
                    id="payment-custom-link"
                    placeholder="https://your-payment-link.com"
                    value={getFieldValue("payment_custom_link")}
                    onChange={(e) =>
                      handleInputChange("payment_custom_link", e.target.value)
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Settings</CardTitle>
              <CardDescription>
                Configure how you deliver products
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 flex flex-col">
              <div className="flex flex-col gap-2">
                <Label htmlFor="min-amount">
                  Minimum Order Amount for Free Shipping
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    {getFieldValue("currency") || "USD"}
                  </span>
                  <Input
                    id="min-amount"
                    type="number"
                    className="pl-7"
                    placeholder="50"
                    value={getFieldValue("min_free_shipping")}
                    onChange={(e) =>
                      handleInputChange("min_free_shipping", e.target.value)
                    }
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium">Shipping Rates</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="standard-shipping">Standard Shipping</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="standard-shipping-enabled"
                        checked={
                          getFieldValue("standard_shipping_enabled") === "1"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "standard_shipping_enabled",
                            e.target.checked ? "1" : ""
                          )
                        }
                      />
                      <span className="text-gray-500">
                        {getFieldValue("currency") || "USD"}
                      </span>
                      <Input
                        id="standard-shipping"
                        type="number"
                        className="pl-7"
                        placeholder="5.99"
                        value={getFieldValue("standard_shipping")}
                        onChange={(e) =>
                          handleInputChange("standard_shipping", e.target.value)
                        }
                      />
                    </div>
                    <Input
                      id="standard-shipping-name"
                      placeholder="Standard Shipping Name (e.g. Regular, Ground)"
                      value={getFieldValue("standard_shipping_name")}
                      onChange={(e) =>
                        handleInputChange(
                          "standard_shipping_name",
                          e.target.value
                        )
                      }
                      className="mt-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="express-shipping">Express Shipping</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="express-shipping-enabled"
                        checked={
                          getFieldValue("express_shipping_enabled") === "1"
                        }
                        onChange={(e) =>
                          handleInputChange(
                            "express_shipping_enabled",
                            e.target.checked ? "1" : ""
                          )
                        }
                      />
                      <span className="text-gray-500">
                        {getFieldValue("currency") || "USD"}
                      </span>
                      <Input
                        id="express-shipping"
                        type="number"
                        className="pl-7"
                        placeholder="15.99"
                        value={getFieldValue("express_shipping")}
                        onChange={(e) =>
                          handleInputChange("express_shipping", e.target.value)
                        }
                      />
                    </div>
                    <Input
                      id="express-shipping-name"
                      placeholder="Express Shipping Name (e.g. Fast, Next Day)"
                      value={getFieldValue("express_shipping_name")}
                      onChange={(e) =>
                        handleInputChange(
                          "express_shipping_name",
                          e.target.value
                        )
                      }
                      className="mt-2"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tax" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Tax Settings</CardTitle>
              <CardDescription>Configure tax calculations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="tax-rate"
                    type="number"
                    placeholder="7.5"
                    value={getFieldValue("default_tax_rate")}
                    onChange={(e) =>
                      handleInputChange("default_tax_rate", e.target.value)
                    }
                    className="w-24"
                  />
                  <span className="right-3 top-3 text-gray-500">%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 mt-6">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <span className="animate-spin mr-2">⟳</span> Saving...
            </>
          ) : (
            "Save Settings"
          )}
        </Button>
      </div>
    </div>
  );
}
