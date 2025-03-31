import { HomePageData } from "../types/homepage";

export const homepageData: HomePageData = {
  intro: {
    title: {
      sequences: [
        ["intro.title.part1", 1000],
        ["intro.title.part2", 3000],
      ],
      speed: 45,
    },
    description: "intro.description",
    profileImage: "/images/my-profile.jpg",
    aboutButton: "intro.aboutButton",
  },
  selection: {
    title: "selection.title",
    items: [
      {
        title: "selection.items.1.title",
        description: "selection.items.1.description",
        imgUrl: "/images/code-1076536_1280.jpg",
      },
      {
        title: "selection.items.2.title",
        description: "selection.items.2.description",
        imgUrl: "/images/turn-on-2933016_1280.jpg",
      },
      {
        title: "selection.items.3.title",
        description: "selection.items.3.description",
        imgUrl: "/images/mobile-phone-1875813_1280.jpg",
      },
      {
        title: "selection.items.4.title",
        description: "selection.items.4.description",
        imgUrl: "/images/source-4280758_1280.jpg",
      },
      {
        title: "selection.items.5.title",
        description: "selection.items.5.description",
        imgUrl: "/images/ai-generated-8988757_1280.jpg",
      },
      {
        title: "selection.items.6.title",
        description: "selection.items.6.description",
        imgUrl: "/images/code-5290465_1280.jpg",
      },
    ]
  },
  gallery: {
    title: "Gallery",
    items: [
      {
        title: "gallery.items.1.title",
        imgUrl: "/images/wowomap3.jpg",
      },
      {
        title: "gallery.items.4.title",
        imgUrl: "/images/memolog.jpg",
      },
      {
        title: "gallery.items.2.title",
        imgUrl: "/images/goalbook.jpg",
      },
      {
        title: "gallery.items.3.title",
        imgUrl: "/images/web-mockup.png",
      },
    ],
  },
  blog: {
    title: "Latest Blog Posts",
    noPosts:
    {
      title: "No posts yet",
      description: "Check back soon for more exciting content!"
    },
  },
};
