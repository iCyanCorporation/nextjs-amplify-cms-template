"use client";

import React from "react";
import { useAuthenticator, Button, Heading, View } from "@aws-amplify/ui-react";

type AuthWrapperProps = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

export default function AuthWrapper({ children, fallback }: AuthWrapperProps) {
  const { user, signOut } = useAuthenticator((context) => [context.user]);

  // Default fallback content if not provided
  const defaultFallback = (
    <View padding="1rem" textAlign="center">
      <Heading level={3} marginBottom="1rem">
        You need to sign in to access this content
      </Heading>
      <Button onClick={() => (window.location.href = "/")}>
        Go to sign in
      </Button>
    </View>
  );

  // If user is authenticated, show the protected content
  if (user) {
    return (
      <div>
        {children}
        <div className="mt-6 text-right">
          <Button onClick={signOut} variation="link">
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  // Show fallback content or default
  return fallback ? <>{fallback}</> : defaultFallback;
}
