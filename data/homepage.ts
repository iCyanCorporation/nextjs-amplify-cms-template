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
    profileImage: "/images/profile-image.jpg",
    aboutButton: "intro.aboutButton",
  },
  selection: {
    title: "selection.title",
    items: [
      {
        title: "selection.items.1.title",
        description: "selection.items.1.description",
        imgUrl: "/images/bee.jpg",
      },
      {
        title: "selection.items.2.title",
        description: "selection.items.2.description",
        imgUrl: "/images/bee.jpg",
      }
    ]
  },
  gallery: {
    title: "Gallery",
    items: [
      {
        title: "gallery.items.1.title",
        imgUrl: "/images/technology.jpg",
      },
      {
        title: "gallery.items.2.title",
        imgUrl: "/images/technology.jpg",
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
