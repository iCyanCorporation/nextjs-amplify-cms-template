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
    name: "Shop",
    href: "/shop",
    description: "Explore our products",
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

export const soicalMediaLinks = {
  github: {
    name: "Github",
    href: "https://github.com/",
    description: "Visit our Facebook page",
  },
  twitter: {
    name: "xTwitter",
    href: "https://twitter.com/",
    description: "Follow us on Twitter",
  },
  linkedin: {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/",
    description: "Connect with us on LinkedIn",
  },
  email: {
    name: "Email",
    href: "info@example.com",
    description: "Send us an email",
  },
};
