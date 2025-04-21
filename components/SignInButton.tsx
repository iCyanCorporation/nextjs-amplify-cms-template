"use client";

import React from "react";
import { useAuthenticator, Button } from "@aws-amplify/ui-react";

interface SignInButtonProps {
  label?: string;
  size?: "small" | "medium" | "large";
  variation?:
    | "primary"
    | "link"
    | "warning"
    | "destructive"
    | "outlined"
    | "menu";
  className?: string;
}

export default function SignInButton({
  label = "Sign In",
  size = "medium",
  variation = "primary",
  className = "",
}: SignInButtonProps) {
  // In Amplify Gen2, we need to use the auth context properly
  const { authStatus, toSignIn } = useAuthenticator();

  return (
    <Button
      onClick={toSignIn}
      className={className}
      isDisabled={authStatus === "authenticated"}
    >
      {label}
    </Button>
  );
}
