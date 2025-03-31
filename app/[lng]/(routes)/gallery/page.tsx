import { projects } from "@/data/gallery";
import { handleTranslation } from "@/app/i18n/index";
import GalleryContent from "./components/GalleryContent";

import { Metadata } from "next";
export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await handleTranslation(lng, "gallery");

  const image = {
    url: "/images/profile-image.jpg",
    alt: "My Website",
    width: 800,
    height: 600,
    type: "image/jpeg"
  }

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || ""),
    title: t('title'),
    description: t('description'),
    openGraph: {
      title: t('title'),
      description: t('description'),
      images: [
        image
      ],
    }
  }
}

type Params = Promise<{ lng: string }>;
export default async function Page({ params }: { params: Params }) {
  const { lng } = await params;
  const { t: t1 } = await handleTranslation(lng, "gallery");

  return (
    <div className="min-h-screen p-8 m-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">{t1('gallery.title', 'Projects')}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          {t1('gallery.description', 'A collection of my recent work and side projects.')}
        </p>
        <GalleryContent projects={projects} lng={lng} />
      </div>
    </div>
  );
}