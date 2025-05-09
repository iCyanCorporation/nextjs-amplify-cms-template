"use client";
import React, { useState, useEffect } from "react";
import { Amplify } from "aws-amplify";
import outputs from "@/amplify_outputs.json";
import * as Auth from "aws-amplify/auth";

import { CustomSignIn } from "@/components/common/auth/CustomSignIn";
import { CustomSignUp } from "@/components/common/auth/CustomSignUp";
import { CustomConfirmSignUp } from "@/components/common/auth/CustomConfirmSignUp";
import { CustomForgotPassword } from "@/components/common/auth/CustomForgotPassword";
import { CustomConfirmResetPassword } from "@/components/common/auth/CustomConfirmResetPassword";

Amplify.configure(outputs);

type AuthStep =
  | "signIn"
  | "signUp"
  | "confirmSignUp"
  | "forgotPassword"
  | "confirmResetPassword"
  | "authenticated";

interface AuthState {
  step: AuthStep;
  user?: any;
  email?: string;
}

interface AuthClientWrapperProps {
  children: React.ReactNode;
}

export default function AuthClientWrapper({
  children,
}: AuthClientWrapperProps) {
  const [auth, setAuth] = useState<AuthState>({ step: "signIn" });

  useEffect(() => {
    Auth.getCurrentUser()
      .then((user) => setAuth({ step: "authenticated", user }))
      .catch(() => setAuth((prev) => ({ ...prev, step: "signIn" })));
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    try {
      const user = await Auth.signIn({ username, password });
      setAuth({ step: "authenticated", user });
    } catch (err: any) {
      if (err.code === "UserNotConfirmedException") {
        setAuth({ step: "confirmSignUp", email: username });
      } else if (err.code === "PasswordResetRequiredException") {
        setAuth({ step: "forgotPassword", email: username });
      } else {
        alert(err.message || "Sign in failed");
      }
    }
  };

  const handleSignUp = async (data: {
    username: string;
    password: string;
    email: string;
  }) => {
    try {
      await Auth.signUp({
        username: data.username,
        password: data.password,
        options: { userAttributes: { email: data.email } },
      });
      setAuth({ step: "confirmSignUp", email: data.username });
    } catch (err: any) {
      alert(err.message || "Sign up failed");
    }
  };

  const handleConfirmSignUp = async (username: string, code: string) => {
    try {
      await Auth.confirmSignUp({ username, confirmationCode: code });
      setAuth({ step: "signIn", email: username });
    } catch (err: any) {
      alert(err.message || "Confirmation failed");
    }
  };

  const handleForgotPassword = async (username: string) => {
    try {
      await Auth.resetPassword({ username });
      setAuth({ step: "confirmResetPassword", email: username });
    } catch (err: any) {
      alert(err.message || "Reset failed");
    }
  };

  const handleConfirmResetPassword = async (
    username: string,
    code: string,
    newPassword: string
  ) => {
    try {
      await Auth.confirmResetPassword({
        username,
        confirmationCode: code,
        newPassword,
      });
      setAuth({ step: "signIn", email: username });
    } catch (err: any) {
      alert(err.message || "Reset confirmation failed");
    }
  };

  const handleSignOut = async () => {
    await Auth.signOut();
    setAuth({ step: "signIn" });
  };

  let content = null;
  switch (auth.step) {
    case "signIn":
      content = (
        <CustomSignIn
          onSignIn={handleSignIn}
          onGoToSignUp={() => setAuth({ step: "signUp" })}
          onGoToForgotPassword={() => setAuth({ step: "forgotPassword" })}
          defaultEmail={auth.email}
        />
      );
      break;
    case "signUp":
      content = (
        <CustomSignUp
          onSignUp={handleSignUp}
          onGoToSignIn={() => setAuth({ step: "signIn" })}
        />
      );
      break;
    case "confirmSignUp":
      content = (
        <CustomConfirmSignUp
          email={auth.email}
          onConfirm={handleConfirmSignUp}
          onGoToSignIn={() => setAuth({ step: "signIn", email: auth.email })}
        />
      );
      break;
    case "forgotPassword":
      content = (
        <CustomForgotPassword
          email={auth.email}
          onSendCode={handleForgotPassword}
          onGoToSignIn={() => setAuth({ step: "signIn", email: auth.email })}
        />
      );
      break;
    case "confirmResetPassword":
      content = (
        <CustomConfirmResetPassword
          email={auth.email}
          onConfirm={handleConfirmResetPassword}
          onGoToSignIn={() => setAuth({ step: "signIn", email: auth.email })}
        />
      );
      break;
    case "authenticated":
      content = <div>{children}</div>;
      return <div className="p-4">{content}</div>;

    default:
      content = null;
  }

  return (
    <div className="flex items-center justify-center w-full h-screen">
      <div className="p-4 max-w-[500px] w-full m-auto">{content}</div>
    </div>
  );
}
