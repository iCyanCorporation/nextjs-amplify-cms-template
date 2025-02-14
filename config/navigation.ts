export interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

export const mainNavigation: NavigationItem[] = [
  // {
  //   name: "Home",
  //   href: "/",
  //   description: "Return to home page",
  // },
  {
    name: "About",
    href: "/about",
    description: "Learn more about us",
  },
  {
    name: "Gallery",
    href: "/gallery",
    description: "View our work gallery",
  },
  {
    name: "Blog",
    href: "/blog",
    description: "Read our latest articles",
  },
  // {
  //   name: "Contact",
  //   href: "/contact",
  //   description: "Get in touch with us",
  // },
];
