"use client";

import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { SocialIcon } from "./SocialIcon";
import { useTranslation } from "@/app/i18n/client";
import { useParams } from "next/navigation";

interface SocialLink {
  name: string;
  href: string;
  icon: any;
}

interface SocialLinksProps {
  links: SocialLink[];
  scheduleActive: boolean;
}

export function SocialLinks({ links, scheduleActive }: SocialLinksProps) {
  const param = useParams();
  const lng = param.lng || "en";
  const { t: translations } = useTranslation(lng, "about");
  return (
    <div className="flex flex-wrap items-center gap-3">
      {links.map((link, index) => (
        <Button
          key={index}
          onClick={() => {
            window.open(link.href, "_blank");
          }}
          className="flex items-center gap-2 px-4 py-2 hover:opacity-80"
          rel="noopener noreferrer"
        >
          <SocialIcon name={link.icon} />
          <span>{translations(link.name)}</span>
        </Button>
      ))}
      <Button
        className="inline-flex items-center gap-2 px-4 py-2 hover:opacity-80"
        disabled={!scheduleActive}
      >
        <CalendarDays className="w-4 h-4" />
        <span>{translations("schedule a call")}</span>
        <span className="ml-1">→</span>
      </Button>
    </div>
  );
}
