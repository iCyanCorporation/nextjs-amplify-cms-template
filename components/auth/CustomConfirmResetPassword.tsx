"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

type CustomConfirmResetPasswordProps = {
  email?: string;
  onConfirm: (
    username: string,
    code: string,
    newPassword: string
  ) => Promise<void>;
  onGoToSignIn: () => void;
};

export const CustomConfirmResetPassword = React.forwardRef<
  HTMLDivElement,
  CustomConfirmResetPasswordProps
>(({ email, onConfirm, onGoToSignIn }, ref) => {
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      await onConfirm(email || "", code, newPassword);
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full" ref={ref}>
      <CardHeader className="text-center">
        <CardTitle>Set New Password</CardTitle>
        <CardDescription>
          Enter the code you received and your new password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <div className="mb-4 text-red-600 text-sm text-center bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirmation_code">Confirmation Code</Label>
            <Input
              id="confirmation_code"
              name="confirmation_code"
              placeholder="Enter the code"
              required
              disabled={isPending}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
              placeholder="Enter your new password"
              required
              disabled={isPending}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button
          variant="link"
          size="sm"
          onClick={onGoToSignIn}
          disabled={isPending}
          className="text-sm"
        >
          Back to Sign In
        </Button>
      </CardFooter>
    </Card>
  );
});
CustomConfirmResetPassword.displayName = "CustomConfirmResetPassword";
