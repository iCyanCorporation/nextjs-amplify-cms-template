"use client";

import React, { useState } from "react";
// Import forwardRef
import { forwardRef } from "react";
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
import { Loader2, Eye, EyeOff } from "lucide-react";

type CustomSignInProps = {
  onSignIn: (username: string, password: string) => Promise<void>;
  onGoToSignUp: () => void;
  onGoToForgotPassword: () => void;
  defaultEmail?: string;
};

export const CustomSignIn = React.forwardRef<HTMLDivElement, CustomSignInProps>(
  ({ onSignIn, onGoToSignUp, onGoToForgotPassword, defaultEmail }, ref) => {
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState(defaultEmail || "");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setIsPending(true);
      setError(null);
      try {
        await onSignIn(username, password);
      } catch (err: any) {
        setError(err.message || "Sign in failed");
      } finally {
        setIsPending(false);
      }
    };

    return (
      <Card className="w-full" ref={ref}>
        <CardHeader className="text-center">
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Access your account</CardDescription>
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
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  disabled={isPending}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isPending}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <Button
              variant="default"
              type="submit"
              className="w-full"
              disabled={isPending}
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-2">
          <Button
            variant="link"
            size="sm"
            onClick={onGoToForgotPassword}
            disabled={isPending}
            className="text-sm"
          >
            Forgot Password?
          </Button>
          <div className="text-sm">
            Don't have an account?{" "}
            <Button
              variant="link"
              size="sm"
              onClick={onGoToSignUp}
              disabled={isPending}
              className="p-0 h-auto"
            >
              Sign Up
            </Button>
          </div>
        </CardFooter>
      </Card>
    );
  }
);

// Add display name for better debugging
CustomSignIn.displayName = "CustomSignIn";
