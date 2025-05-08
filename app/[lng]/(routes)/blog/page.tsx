import { BlogList } from "@/app/[lng]/(routes)/blog/components/BlogList";
import { handleTranslation } from "@/app/i18n/index";

import { Metadata } from "next";
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await handleTranslation(lng, "blog");

  const image = {
    url: "/images/profile-image.jpg",
    alt: "My Website",
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${lng}/blog`,
    },
  };
}

type Params = Promise<{ lng: string }>;
export default async function Page({ params }: { params: Params }) {
  const { lng } = await params;
  const { t: t1 } = await handleTranslation(lng, "blog");

  return (
    <div className="w-screen max-w-6xl m-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-bold dark:text-white">
          {t1("my-blogs", "My Blogs")}
        </h1>
      </div>
      <BlogList lng={lng} />
    </div>
  );
}
