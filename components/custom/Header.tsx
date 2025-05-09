"use client";

import { usePathname } from "next/navigation";
import { mainNavigation } from "@/config/navigation";
import { createPathWithLang } from "@/app/i18n/client-config";
import ThemeToggle from "../common/ThemeToggle";
import LanguageSwitcher from "../common/LanguageSwitcher";
import Link from "next/link";
import { Cart } from "../common/cart/cart";

export default function Header({ lng }: { lng: string }) {
  const pathname = usePathname() || "/";

  return (
    <>
      <div className="flex justify-center items-center m-auto">
        <div className="fixed top-0 z-50 max-w-xl m-3 px-3 h-10 flex items-center justify-between border-2 border-gray-700 dark:border-gray-600 rounded-full bg-white dark:bg-gray-900 shadow-lg">
          <span className="w-auto hover:scale-105 transition-all duration-300 mr-0 md:mr-10">
            <Link
              href={createPathWithLang("/", lng)}
              className="font-semibold dark:text-white flex items-center gap-1 cursor-pointer"
            >
              <div className="md:w-auto h-8md:rounded-none">
                <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
              </div>
            </Link>
          </span>
          <div className="flex items-center gap-1">
            <nav className="flex gap-2 md:gap-4">
              {mainNavigation.map((item, index) => (
                <Link
                  key={index}
                  href={
                    pathname ? createPathWithLang(item.href, lng) : `/${lng}`
                  }
                  className={`relative transition-all duration-300 ${
                    pathname.endsWith(item.href)
                      ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-400 dark:to-cyan-300 font-bold after:absolute after:bottom-[-2px] after:left-0 after:w-full after:h-[2px] after:bg-gradient-to-r after:from-blue-600 after:to-cyan-500 dark:after:from-blue-400 dark:after:to-cyan-300"
                      : "text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer"
                  }`}
                  title={item.description}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
            <div className="border-l border-gray-300 dark:border-gray-700 h-5 mx-2" />
            <div className="flex gap-2 items-center">
              <Cart />
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
