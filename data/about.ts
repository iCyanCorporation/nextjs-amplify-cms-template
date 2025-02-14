import { Github, Linkedin, Mail, CalendarDays } from "lucide-react";

export interface Profile {
  name: string;
  title: string;
  location: string;
  image: string;
  bio: string;
  socialLinks: {
    name: string;
    href: string;
    icon: any;  // We'll keep this as any since we can't serialize component types
  }[];
}

export interface WorkExperience {
  company: string;
  position: string;
  period: string;
  achievements: string[];
}

export interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

export interface Skills {
  [key: string]: string[] | undefined;
}

export interface AboutData {
  profile: Profile;
  workExperience: WorkExperience[];
  education: Education[];
  skills: Skills;
}

export const aboutData: AboutData = {
  profile: {
    name: "John Doe",
    title: "Software Engineer",
    location: "Asia/Tokyo",
    image: "/images/profile-image.jpg",
    bio: "John is a Tokyo-based design engineer with a passion for transforming complex challenges into simple, elegant design solutions. His work spans digital interfaces, interactive experiences, and the convergence of design and technology.",
    socialLinks: [
      {
        name: "GitHub",
        href: "https://github.com",
        icon: Github
      },
      {
        name: "LinkedIn",
        href: "https://linkedin.com",
        icon: Linkedin
      },
      {
        name: "Email",
        href: "mailto:john@example.com",
        icon: Mail
      }
    ]
  },
  workExperience: [
    {
      company: "COMPANY NAME",
      position: "Senior Design Engineer",
      period: "2022 - Present",
      achievements: [
        "Redesigned the UI/UX for the platform, resulting in a 20% increase in user engagement and 30% faster load times.",
        "Spearheaded the integration of AI tools into design workflows, enabling designers to iterate 50% faster."
      ]
    },
    {
      company: "COMPANY NAME",
      position: "Senior Design Engineer",
      period: "2022 - Present",
      achievements: [
        "Redesigned the UI/UX for the platform, resulting in a 20% increase in user engagement and 30% faster load times.",
        "Spearheaded the integration of AI tools into design workflows, enabling designers to iterate 50% faster."
      ]
    },
    {
      company: "COMPANY NAME",
      position: "Senior Design Engineer",
      period: "2022 - Present",
      achievements: [
        "Redesigned the UI/UX for the platform, resulting in a 20% increase in user engagement and 30% faster load times.",
        "Spearheaded the integration of AI tools into design workflows, enabling designers to iterate 50% faster."
      ]
    }
  ],
  education: [
    {
      institution: "University Name",
      degree: "Bachelor of Computer Science",
      period: "2018 - 2022",
      description: "Graduated with honors, specializing in Human-Computer Interaction"
    },
    {
      institution: "University Name",
      degree: "Bachelor of Computer Science",
      period: "2018 - 2022",
      description: "Graduated with honors, specializing in Human-Computer Interaction"
    }
  ],
  skills: {
    design: [
      "UI/UX Design",
      "Logo Design",
      "Prototyping"
    ],
    development: [
      "React.js",
      "TypeScript",
      "Node.js",
      "Tailwind CSS"
    ],
    languages: [
      "English (Intermediate)",
      "Japanese (Fluent)"
    ],
    tools: [
      "Figma",
      "Adobe Creative Suite",
      "Prototyping"
    ]
  }
};