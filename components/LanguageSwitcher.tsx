"use client";
import Link from "next/link";
import { handleTranslation } from "@/app/i18n";
import { languages } from "@/app/i18n/settings";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const LanguageSwitcher = async ({ lng }: { lng: string }) => {
  const { t } = await handleTranslation(lng);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full aspect-square">
          <Globe className="h-6 w-6" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        {languages.map((l, index) => (
          <DropdownMenuItem key={index} disabled={lng === l} asChild>
            <Link
              href={`/${l}`}
              className="w-full cursor-pointer justify-between"
            >
              {t(l)}
              {lng === l && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;