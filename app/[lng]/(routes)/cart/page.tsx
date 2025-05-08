import CartClient from "./client";

import { handleTranslation } from "@/app/i18n/index";
import { Metadata } from "next";

type Params = Promise<{ lng: string }>;
export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { lng } = await params;
  const { t } = await handleTranslation(lng, "cart");
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
      canonical: `${process.env.NEXT_PUBLIC_SITE_URL || ""}/${lng}/cart`,
    },
  };
}

export default function CartPage() {
  return <CartClient />;
}
