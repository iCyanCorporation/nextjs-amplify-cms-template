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

type CustomForgotPasswordProps = {
  email?: string;
  onSendCode: (username: string) => Promise<void>;
  onGoToSignIn: () => void;
};

export const CustomForgotPassword = React.forwardRef<
  HTMLDivElement,
  CustomForgotPasswordProps
>(({ email, onSendCode, onGoToSignIn }, ref) => {
  const [username, setUsername] = useState(email || "");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      await onSendCode(username);
    } catch (err: any) {
      setError(err.message || "Failed to send code");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full" ref={ref}>
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your email or username to receive a confirmation code.
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
            <Label htmlFor="username">Email or Username</Label>
            <Input
              id="username"
              name="username"
              placeholder="Enter your email or username"
              required
              disabled={isPending}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send Code
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
CustomForgotPassword.displayName = "CustomForgotPassword";
