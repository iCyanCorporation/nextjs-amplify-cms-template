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
    // page reload
    window.location.reload();
  };

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center ${
        isCollapsed ? "justify-center" : "justify-start"
      } p-4 rounded-lg transition-colors hover:opacity-80`}
    >
      <RiLogoutBoxRLine className="w-4 h-4" />
      {!isCollapsed && <span className="ml-3">Sign out</span>}
    </button>
  );
}
