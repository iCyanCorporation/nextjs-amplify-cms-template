import { AboutData } from "@/types/about";
import { soicalMediaLinks } from "@/config/navigation";

export const aboutData: AboutData = {
  profile: {
    name: 'profile.name',
    title: 'profile.title',
    location: "Asia/Country",
    image: "/images/profile-image.jpg",
    bio: 'profile.bio',
    socialLinks: [
      {
        name: "social.github",
        href: soicalMediaLinks.github.href,
        icon: "github"
      },
      {
        name: "social.linkedin",
        href: soicalMediaLinks.linkedin.href,
        icon: "linkedin"
      },
      {
        name: "social.email",
        href: "mailto:" + soicalMediaLinks.email.href,
        icon: "mail"
      }
    ],
    schedule: {
      isActive: false,
      status: "free"
    }

  },
  workExperience: [
    {
      company: "workExperience.company1.name",
      position: "workExperience.company1.position",
      period: "2023 - Present",
      achievements: [
        "workExperience.company1.achievements.no1",
        "workExperience.company1.achievements.no2",
        "workExperience.company1.achievements.no3"
      ]
    },
    {
      company: "workExperience.company8.name",
      position: "workExperience.company8.position",
      period: "2023 - Present",
      achievements: [
        "workExperience.company8.achievements.no1",
        "workExperience.company8.achievements.no2",
        "workExperience.company8.achievements.no3"
      ]
    },
    
  ],
  sideProjects: [
    {
      company: "workExperience.company6.name",
      position: "workExperience.company6.position",
      period: "2023 - 2024",
      achievements: [
        "workExperience.company6.achievements.no1",
        "workExperience.company6.achievements.no2"
      ]
    },
  ],
  education: [
    {
      institution: "education.no1.institution",
      degree: "education.no1.degree",
      period: "2017 - 2018",
      description: "education.no1.description"
    },
    {
      institution: "education.no2.institution",
      degree: "education.no2.degree",
      period: "2008 - 2012",
      description: "education.no2.description"
    }
  ],
  otherExperience: [
    {
      title: "otherExperience.no1.title",
      period: "2015 - 2017",
      description: "otherExperience.no1.description"
    }
  ],
  skills: {
    design: [
      "skills.prototyping"
    ],
    development: [
      "skills.nextjs",
      "skills.typescript",
    ],
    languages: [
      "skills.english",
      "skills.japanese",
    ],
    tools: [
      "skills.figma",
      "skills.github",
    ]
  }
};