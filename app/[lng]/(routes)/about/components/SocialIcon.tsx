'use client';

import { Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const iconMap = {
  mail: Mail,
  github: FaGithub,
  linkedin: FaLinkedin,
} as const;

type IconName = keyof typeof iconMap;

interface SocialIconProps {
  name: IconName;
  className?: string;
}

export function SocialIcon({ name, className = "w-4 h-4" }: SocialIconProps) {
  const Icon = iconMap[name];
  return <Icon className={className} />;
}

export type { IconName };
