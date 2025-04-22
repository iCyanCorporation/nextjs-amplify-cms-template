"use client";

import * as Auth from "aws-amplify/auth";
import { RiLogoutBoxRLine } from "react-icons/ri";

export default function SignOutButton({
  isCollapsed,
}: {
  isCollapsed: boolean;
}) {
  const handleSignOut = async () => {
    await Auth.signOut();
    // Optionally, you can trigger a redirect or state update here if needed
  };

  return (
    <button
      onClick={handleSignOut}
      className={`w-full flex items-center ${
        isCollapsed ? "justify-center" : "justify-start"
      } p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors hover:opacity-80`}
    >
      <RiLogoutBoxRLine className="w-5 h-5" />
      {!isCollapsed && <span className="ml-3">Sign out</span>}
    </button>
  );
}
