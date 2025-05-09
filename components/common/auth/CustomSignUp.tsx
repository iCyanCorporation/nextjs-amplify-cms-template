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

// Wrap with forwardRef
type CustomSignUpProps = {
  onSignUp: (data: {
    username: string;
    password: string;
    email: string;
  }) => Promise<void>;
  onGoToSignIn: () => void;
};

export const CustomSignUp = React.forwardRef<HTMLDivElement, CustomSignUpProps>(
  ({ onSignUp, onGoToSignIn }, ref) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(null);
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setIsPending(true);
      try {
        await onSignUp({ username: email, password, email });
      } catch (err: any) {
        setError(err.message || "Sign up failed");
      } finally {
        setIsPending(false);
      }
    };

    return (
      <Card className="w-full" ref={ref}>
        <CardHeader className="text-center">
          <CardTitle>Create Account</CardTitle>
          <CardDescription>Sign up for a new account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 text-red-600 text-sm text-center bg-red-100 p-2 rounded">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                disabled={isPending}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter a password"
                required
                disabled={isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm your password"
                required
                disabled={isPending}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm">
            Already have an account?{" "}
            <Button
              variant="link"
              size="sm"
              onClick={onGoToSignIn}
              disabled={isPending}
              className="p-0 h-auto"
            >
              Sign In
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
);

// Add display name
CustomSignUp.displayName = "CustomSignUp";
