'use client';

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

interface PageNavigationProps {
  items: NavigationItem[];
}

export function PageNavigation({ items }: PageNavigationProps) {
  return (
    <nav className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-4 hidden xl:block">
      {items.map((item) => (
        <a
          key={item.href}
          href={`#${item.href}`}
          className="group flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 relative dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById(item.href)?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }}
        >
          <span className="relative">
            <span className="absolute -left-5 bottom-1/2 -translate-y-1/2 w-0 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-200 w-2"></span>
            {item.name}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-200 group-hover:w-full"></span>
          </span>
        </a>
      ))}
    </nav>
  );
}
