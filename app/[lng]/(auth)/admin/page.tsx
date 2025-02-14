"use client";

import React from "react";
import { useAuthenticator } from "@aws-amplify/ui-react";
import Link from "next/link";

export default function Page() {
  const { signOut } = useAuthenticator();

  return (
    <div className="flex flex-col gap-4">
      <Link href="/admin/blog">Blog</Link>
      <Link href="/admin/image">Image</Link>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
