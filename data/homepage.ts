export interface Author {
  name: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  category: string;
  readTime: string;
  author: Author;
  date: string;
  onClick?: () => void;
}

export interface HomePageData {
  intro: {
    title: {
      sequences: [string, number][];
      speed: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 15 | 20 | 25 | 30 | 35 | 40 | 45 | 50 | 55 | 60 | 65 | 70 | 75 | 80 | 85 | 90 | 95 | 99;
    };
    description: string;
    profileImage: string;
  };
  selection: {
    title: string;
    items: Array<{
      id: number;
      title: string;
      description: string;
      imgUrl?: string;
      // height?: string;
    }>;
  };
  gallery: {
    title: string;
    items: Array<{
      id: number;
      title: string;
      imgUrl?: string;
    }>;
  };
  blog: {
    title: string;
    posts: BlogPost[];
  };
}

export const homepageData: HomePageData = {
  intro: {
    title: {
      sequences: [
        ["Software Engineer", 1000],
        ["Software Engineer with Full-stack development", 3000],
      ],
      speed: 45,
    },
    description: "I'm John, a software engineer, good at build projects and websites.",
    profileImage: "/images/profile-image.jpg",
  },
  selection: {
    title: "What can I do?",
    items: [
      {
        id: 1,
        title: "Skill 1",
        description: "A brief description of project 1. Click to learn more about this exciting work.",
        imgUrl: "/images/bee.jpg",
      },
      {
        id: 2,
        title: "Skill 2",
        description: "A brief description of project 2. Click to learn more about this exciting work.",
        imgUrl: "/images/bee.jpg",
      
      },
      {
        id: 3,
        title: "Skill 3",
        description: "A brief description of project 3. Click to learn more about this exciting work.",
        imgUrl: "/images/bee.jpg",
      },
      {
        id: 4,
        title: "Skill 4",
        description: "A brief description of project 4. Click to learn more about this exciting work.",
        imgUrl: "/images/bee.jpg",
      },
      {
        id: 5,
        title: "Skill 5",
        description: "A brief description of project 5. Click to learn more about this exciting work.",
        imgUrl: "/images/bee.jpg",
      },
      {
        id: 6,
        title: "Skill 6",
        description: "A brief description of project 6. Click to learn more about this exciting work.",
        imgUrl: "/images/bee.jpg",
      },
    ]
  },
  gallery: {
    title: "Gallery",
    items: [
      {
        id: 1,
        title: "Project 1",
        imgUrl: "/images/technology.jpg",
      },
      {
        id: 2,
        title: "Project 2",
        imgUrl: "/images/technology.jpg",
      },
      {
        id: 3,
        title: "Project 3",
        imgUrl: "/images/technology.jpg",
      },
      {
        id: 4,
        title: "Project 4",
        imgUrl: "/images/technology.jpg",
      }
    ],
  },
  blog: {
    title: "Latest Blog Posts",
    posts: Array.from({ length: 3 }, (_, i) => ({
      id: (i + 1).toString(),
      title: `Blog Post ${i + 1}`,
      content: "A preview of the blog post content. This is a brief description that gives readers an idea of what to expect.",
      category: "Category",
      readTime: "5 min read",
      author: {
        name: "Author Name",
      },
      date: "Feb 13, 2025",
      onClick: () => console.log(`Clicked blog ${i + 1}`),
    })),
  },
};
