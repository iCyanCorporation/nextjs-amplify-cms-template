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
      className={`flex items-center gap-2 ${
        isCollapsed ? "justify-center" : "justify-start"
      } p-0 rounded-lg transition-colors hover:opacity-80`}
    >
      <RiLogoutBoxRLine className="w-4 h-4" />
      {!isCollapsed && <span className="text-sm uppercase">Logout</span>}
    </button>
  );
}
