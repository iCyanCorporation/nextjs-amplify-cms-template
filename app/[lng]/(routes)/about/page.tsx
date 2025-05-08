import { handleTranslation } from "@/app/i18n/index";
import { aboutData } from "@/data/about";
import { PageNavigation } from "./components/PageNavigation";
import { SocialLinks } from "./components/SocialLinks";

import { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await handleTranslation(lng, "about");

  const image = {
    url: "/images/profile-image.jpg",
    alt: "My website",
    width: 800,
    height: 600,
    type: "image/jpeg",
  };

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ""),
    title: t("title"),
    description: t("description"),
    openGraph: {
      title: t("title"),
      description: t("description"),
      images: [image],
    },
    alternates: {
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${lng}/about`,
    },
  };
}

interface NavigationItem {
  name: string;
  href: string;
  description?: string;
}

type Params = Promise<{ lng: string }>;
export default async function Page({ params }: { params: Params }) {
  const { lng } = await params;
  const { t: t1 } = await handleTranslation(lng, "about");

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

  return (
    <div className="min-h-screen text-gray-700 dark:text-gray-200 p-8 relative m-auto">
      <PageNavigation items={pageNavigation} />

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
                  {t1(aboutData.profile.name)}
                </h1>

                <div className="flex items-center gap-2">
                  <p className="text-xl text-gray-700 dark:text-gray-300 mb-4">
                    {t1(aboutData.profile.title)}
                  </p>
                  <span className="flex items-center gap-2 mb-4">
                    <span className="w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                    {t1(aboutData.profile.location)}
                  </span>
                </div>

                <SocialLinks
                  links={aboutData.profile.socialLinks}
                  scheduleActive={aboutData.profile.schedule.isActive}
                />
              </div>
            </div>

            <p className="text-gray-700 dark:text-gray-300 max-w-2xl break-words">
              {t1(aboutData.profile.bio)}
            </p>
          </div>

          {/* Work Experience Section */}
          <div id="work" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">
              {t1("work experience")}
            </h2>
            <div className="border-l-2 border-primary dark:border-gray-600 pl-6">
              {aboutData.workExperience.map((work, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">
                        {t1(work.company)}
                      </h3>
                      <p className="text-primary dark:text-blue-400">
                        {t1(work.position)}
                      </p>
                    </div>
                    <span className="text-gray-400">{work.period}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    {work.achievements.map((achievement, i) => (
                      <li key={i}>{t1(achievement)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          {/* Side Projects Section */}
          <div id="side-projects" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">
              {t1("side projects")}
            </h2>
            <div className="border-l-2 border-primary dark:border-gray-600 pl-6">
              {aboutData.sideProjects.map((project, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">
                        {t1(project.company)}
                      </h3>
                      <p className="text-primary dark:text-blue-400">
                        {t1(project.position)}
                      </p>
                    </div>
                    <span className="text-gray-400">{project.period}</span>
                  </div>
                  <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                    {project.achievements.map((achievement, i) => (
                      <li key={i}>{t1(achievement)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Studies Section */}
          <div id="studies" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">
              {t1("studies")}
            </h2>
            <div className="border-l-2 border-primary dark:border-gray-600 pl-6">
              {aboutData.education.map((edu, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">
                        {t1(edu.institution)}
                      </h3>
                      <p className="dark:text-gray-300">{t1(edu.degree)}</p>
                    </div>
                    <span className="text-gray-400">{edu.period}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t1(edu.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Experience */}
          <div id="other-experience" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">
              {t1("other experience")}
            </h2>
            <div className="border-l-2 border-primary dark:border-gray-600 pl-6">
              {aboutData.otherExperience.map((exp, index) => (
                <div key={index} className="mb-8">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-bold dark:text-white">
                        {t1(exp.title)}
                      </h3>
                    </div>
                    <span className="text-gray-400">{exp.period}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300">
                    {t1(exp.description)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Skills Section */}
          <div id="skills" className="w-full">
            <h2 className="text-3xl font-bold mb-6 dark:text-white">
              {t1("technicalSkills")}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {Object.keys(aboutData.skills).map((key) => {
                return (
                  <div key={key}>
                    <h3 className="text-xl font-bold mb-4 text-primary dark:text-gray-200">
                      {t1(key)}
                    </h3>
                    <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
                      {aboutData.skills[
                        key as keyof typeof aboutData.skills
                      ]?.map((skill, index) => (
                        <li key={index}>{t1(skill)}</li>
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
