"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
        setSettings(map);
      }
    } catch (e) {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
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

  // Save or update all settings
  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const authToken = await getAuthToken();
      if (!authToken) {
        throw new Error("Unauthorized");
      }
      for (const { key, label, defaultValue } of SETTINGS_KEYS) {
        const setting = settings[key] || { key, value: defaultValue };
        const payload = {
          key,
          value: setting.value || defaultValue,
          description: label,
          group: "general",
        };
        let res;
        if (setting.id) {
          res = await fetch(`/api/settings/${setting.id}`, {
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
        if (!res.ok) throw new Error("Failed to save setting: " + key);
        const saved = await res.json();
        setSettings((prev) => ({ ...prev, [key]: saved }));
      }
    } catch (e: any) {
      setError(e.message || "Failed to save settings");
    } finally {
      setSaving(false);
      // reload data
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
              <CardTitle>Store Information</CardTitle>
              <CardDescription>
                Basic information about your store
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="store-name">Store Name</Label>
                  <Input
                    id="store-name"
                    placeholder="Your Store Name"
                    value={settings["store_name"]?.value || ""}
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
                    value={settings["support_email"]?.value || ""}
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
                    value={settings["country"]?.value || ""}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    placeholder="USD"
                    value={settings["currency"]?.value || ""}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    value={settings["phone"]?.value || ""}
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
                    value={settings["zip"]?.value || ""}
                    onChange={(e) => handleInputChange("zip", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    defaultValue="United States"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input
                    id="state"
                    placeholder="NY"
                    value={settings["state"]?.value || ""}
                    onChange={(e) => handleInputChange("state", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    value={settings["city"]?.value || ""}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address-1">Address Line 1</Label>
                  <Input
                    id="address-1"
                    placeholder="123 Main St"
                    value={settings["address_1"]?.value || ""}
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
                    value={settings["address_2"]?.value || ""}
                    onChange={(e) =>
                      handleInputChange("address_2", e.target.value)
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="free-shipping">Free Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable free shipping for orders above a certain amount
                  </p>
                </div>
                <Switch defaultChecked id="free-shipping" />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="min-amount">
                  Minimum Order Amount for Free Shipping
                </Label>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">
                    {settings["currency"]?.value || "USD"}
                  </span>
                  <Input
                    id="min-amount"
                    type="number"
                    className="pl-7"
                    placeholder="50"
                    defaultValue="50"
                  />
                </div>
              </div>

              <div className="pt-4">
                <h3 className="text-lg font-medium">Shipping Rates</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  <div className="space-y-2">
                    <Label htmlFor="standard-shipping">Standard Shipping</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {settings["currency"]?.value || "USD"}
                      </span>
                      <Input
                        id="standard-shipping"
                        type="number"
                        className="pl-7"
                        placeholder="5.99"
                        defaultValue="5.99"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="express-shipping">Express Shipping</Label>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">
                        {settings["currency"]?.value || "USD"}
                      </span>
                      <Input
                        id="express-shipping"
                        type="number"
                        className="pl-7"
                        placeholder="15.99"
                        defaultValue="15.99"
                      />
                    </div>
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
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-tax">Enable Tax Calculation</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically calculate taxes based on location
                  </p>
                </div>
                <Switch defaultChecked id="enable-tax" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="tax-rate"
                    type="number"
                    placeholder="7.5"
                    defaultValue="7.5"
                    className="w-24"
                  />
                  <span className="right-3 top-3 text-gray-500">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="include-tax">Show Prices Including Tax</Label>
                  <p className="text-sm text-muted-foreground">
                    Display product prices with tax included
                  </p>
                </div>
                <Switch id="include-tax" />
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
