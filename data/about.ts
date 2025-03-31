import { AboutData } from "@/types/about";
import { soicalMediaLinks } from "@/config/navigation";

export const aboutData: AboutData = {
  profile: {
    name: 'profile.name',
    title: 'profile.title',
    location: "Asia/Taiwan",
    image: "/images/my-profile.jpg",
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
    {
      company: "workExperience.company2.name",
      position: "workExperience.company2.position",
      period: "2024 - 2024",
      achievements: [
        "workExperience.company2.achievements.no1",
        "workExperience.company2.achievements.no2"
      ]
    },
    {
      company: "workExperience.company3.name",
      position: "workExperience.company3.position",
      period: "2020 - 2023",
      achievements: [
        "workExperience.company3.achievements.no1",
        "workExperience.company3.achievements.no2",
        "workExperience.company3.achievements.no3"
      ]
    },
    {
      company: "workExperience.company4.name",
      position: "workExperience.company4.position",
      period: "2019 - 2020",
      achievements: [
        "workExperience.company4.achievements.no1"
      ]
    },
    {
      company: "workExperience.company5.name",
      position: "workExperience.company5.position",
      period: "2018 - 2019",
      achievements: [
        "workExperience.company5.achievements.no1",
        "workExperience.company5.achievements.no2"
      ]
    }
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
    {
      company: "workExperience.company9.name",
      position: "workExperience.company9.position",
      period: "2024 - 2024",
      achievements: [
        "workExperience.company9.achievements.no1",
        "workExperience.company9.achievements.no2"
      ]
    },
    
    {
      company: "workExperience.company7.name",
      position: "workExperience.company7.position",
      period: "2019 - 2020",
      achievements: [
        "workExperience.company7.achievements.no1",
        "workExperience.company7.achievements.no2",
        "workExperience.company7.achievements.no3"
      ]
    }
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
      "skills.uiDesign",
      "skills.logoDesign",
      "skills.prototyping"
    ],
    development: [
      "skills.nextjs",
      "skills.typescript",
      "skills.python",
      "skills.tailwind"
    ],
    languages: [
      "skills.english",
      "skills.japanese",
      "skills.chinese"
    ],
    tools: [
      "skills.figma",
      "skills.gimp",
      "skills.git",
      "skills.github",
      "skills.docker",
      "skills.aws",
      "skills.gcp"
    ]
  }
};