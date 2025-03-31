"use client";

import {
  Github,
  Linkedin,
  Mail,
  CalendarDays,
  LucideProps,
} from "lucide-react";
import { aboutData } from "@/data/about";

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

// Add interface for social links
interface SocialLink {
  name: string;
  href: string;
  icon: React.ComponentType<LucideProps>;
}

// Add interface for work experience
interface WorkExperience {
  company: string;
  position: string;
  period: string;
  achievements: string[];
}

// Add interface for education
interface Education {
  institution: string;
  degree: string;
  period: string;
  description: string;
}

const pageNavigation: NavigationItem[] = [
  {
    name: "WORK",
    href: "work",
    description: "move to work section",
  },
  {
    name: "STUDIES",
    href: "studies",
    description: "move to studies section",
  },
  {
    name: "SKILLS",
    href: "skills",
    description: "move to skills section",
  },
];

export default function Page() {
  return (
    <div className="min-h-screen text-gray-700 dark:text-gray-200 p-8 relative m-auto">
      {/* Fixed Navigation */}
      <nav className="fixed right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 p-4 hidden xl:block">
        {pageNavigation.map((item) => (
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
              {/* add a Solid Bar beside the text */}
              <span className="absolute -left-5 bottom-1/2 -translate-y-1/2 w-0 h-0.5 bg-gray-700 dark:bg-gray-300 transition-all duration-200 w-2"></span>
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black dark:bg-white transition-all duration-200 group-hover:w-full"></span>
            </span>
          </a>
        ))}
      </nav>

      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col items-start gap-12">
          {/* Profile Section */}
          <div id="introduction" className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row items-start gap-8">
              <img
                src={aboutData.profile.image}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover aspect-square"
              />
              <div>
                <h1 className="text-5xl font-bold mb-2 dark:text-white">
                  {aboutData.profile.name}
                </h1>

                <div className="flex items-center gap-2">
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                    {aboutData.profile.title}
                  </p>
                  <span className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-red-500 rounded-full inline-block"></span>
                    {aboutData.profile.location}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {aboutData.profile.socialLinks.map((link: SocialLink) => {
                    const Icon = link.icon;
                    return (
                      <a
                        key={link.name}
                        href={link.href}
                        className="flex items-center gap-2 px-4 py-2 bg-secondary dark:bg-gray-700 rounded-lg hover:bg-white dark:hover:bg-gray-600 transition-colors dark:text-gray-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{link.name}</span>
                      </a>
                    );
                  })}
                  <button className="inline-flex items-center gap-2 px-4 py-2 bg-secondary dark:bg-gray-700 rounded-lg w-fit transition-colors hover:bg-white dark:hover:bg-gray-600 dark:text-gray-200">
                    <CalendarDays className="w-4 h-4" />
                    <span>Schedule a call</span>
                    <span className="ml-1">→</span>
                  </button>
                </div>
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 max-w-2xl break-words">
              {aboutData.profile.bio}
            </p>
          </div>

          {/* Work Experience Section */}
          <div id="work" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Work Experience</h2>
            <div className="border-l-2 border-primary dark:border-gray-600 pl-6">
                {aboutData.workExperience.map((work: WorkExperience, index: number) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-xl font-bold dark:text-white">{work.company}</h3>
                    <p className="text-primary dark:text-blue-400">{work.position}</p>
                  </div>
                  <span className="text-primary-foreground dark:text-gray-400">
                    {work.period}
                  </span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                  {work.achievements.map((achievement: string, i: number) => (
                    <li key={i}>{achievement}</li>
                  ))}
                  </ul>
                </div>
                ))}
            </div>
          </div>

          {/* Studies Section */}
          <div id="studies" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Studies</h2>
            <div className="border-l-2 border-primary dark:border-gray-600 pl-6">
              {aboutData.education.map((edu: Education, index: number) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">{edu.institution}</h3>
                      <p className="dark:text-gray-300">{edu.degree}</p>
                    </div>
                    <span className="text-gray-400">{edu.period}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">{edu.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Section */}
          <div id="skills" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">Technical Skills</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Object.keys(aboutData.skills).map((key) => {
                return (
                  <div key={key}>
                    <h3 className="text-xl font-bold mb-4 text-primary dark:text-gray-200">
                      {key}
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                        {aboutData.skills[
                        key as keyof typeof aboutData.skills
                        ]?.map((skill: string, index: number) => (
                        <li key={index}>{skill}</li>
                        ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
