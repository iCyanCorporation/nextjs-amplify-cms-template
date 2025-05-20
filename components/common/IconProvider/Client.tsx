"use client";

import React from "react";
import { ICON_MAP } from "./types";

export function IconProvider(iconName: string, size?: number) {
  const Icon = ICON_MAP[iconName];
  const iconSize = size ? `w-${size} h-${size}` : "w-4 h-4"; // Default to 1em if no size is provided
  if (!Icon) return null;
  return (
    <div>
      <Icon className={iconSize} />
    </div>
  );
}
