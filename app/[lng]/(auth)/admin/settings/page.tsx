"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function SettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setSaving(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="grid w-full grid-cols-3">
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
                    defaultValue="My Awesome Store"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="support-email">Support Email</Label>
                  <Input
                    id="support-email"
                    placeholder="support@example.com"
                    defaultValue="support@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" placeholder="USD" defaultValue="USD" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    placeholder="+1 (555) 123-4567"
                    defaultValue="+1 (555) 123-4567"
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
                  <Label htmlFor="address-1">Address Line 1</Label>
                  <Input
                    id="address-1"
                    placeholder="123 Main St"
                    defaultValue="123 Main St"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address-2">Address Line 2</Label>
                  <Input
                    id="address-2"
                    placeholder="Suite 101"
                    defaultValue="Suite 101"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    placeholder="New York"
                    defaultValue="New York"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State/Province</Label>
                  <Input id="state" placeholder="NY" defaultValue="NY" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zip">Postal/Zip Code</Label>
                  <Input id="zip" placeholder="10001" defaultValue="10001" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    placeholder="United States"
                    defaultValue="United States"
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
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="free-shipping">Free Shipping</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable free shipping for orders above a certain amount
                  </p>
                </div>
                <Switch defaultChecked id="free-shipping" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="min-amount">
                  Minimum Order Amount for Free Shipping
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-gray-500">$</span>
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
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        $
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
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">
                        $
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
                <div className="relative">
                  <Input
                    id="tax-rate"
                    type="number"
                    placeholder="7.5"
                    defaultValue="7.5"
                  />
                  <span className="absolute right-3 top-3 text-gray-500">
                    %
                  </span>
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
