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

type CustomConfirmSignUpProps = {
  email?: string;
  onConfirm: (username: string, code: string) => Promise<void>;
  onGoToSignIn: () => void;
};

export const CustomConfirmSignUp = React.forwardRef<
  HTMLDivElement,
  CustomConfirmSignUpProps
>(({ email, onConfirm, onGoToSignIn }, ref) => {
  const [code, setCode] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsPending(true);
    try {
      await onConfirm(email || "", code);
    } catch (err: any) {
      setError(err.message || "Confirmation failed");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="w-full" ref={ref}>
      <CardHeader className="text-center">
        <CardTitle>Confirm Sign Up</CardTitle>
        <CardDescription>
          Enter the confirmation code sent to your email.
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
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Confirm Account
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
CustomConfirmSignUp.displayName = "CustomConfirmSignUp";
