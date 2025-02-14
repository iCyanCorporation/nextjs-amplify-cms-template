"use client";

import Link from "next/link";
import { mainNavigation } from "@/config/navigation";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ lng }: { lng: string }) {
  return (
    <>
      <div className="flex justify-center items-center m-auto">
        <div className="fixed top-0 z-50 max-w-xl m-3 px-3 h-10 flex items-center justify-between border-2 border-gray-700 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900 shadow-lg">
          <span className="w-auto hover:scale-105 transition-all duration-300 mr-10">
            <Link href="/" className="font-semibold dark:text-white flex items-center gap-2">
              <img src="/images/profile-image.jpg" alt="Logo" className="h-6 rounded-full aspect-square" />
              <span className="hidden md:block">LOGO</span>
            </Link>
          </span>
          <div className="flex items-center gap-2">
            <nav className="flex gap-4">
              {mainNavigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300"
                  title={item.description}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="border-l border-gray-300 dark:border-gray-700 h-5 mx-2" />
            <div className="flex gap-2 items-center">
              <ThemeToggle />
              <LanguageSwitcher lng={lng} />
            </div>
          </div>
        </div>
      </div>
      <div className="h-[80px]"></div>
    </>
  );
}
