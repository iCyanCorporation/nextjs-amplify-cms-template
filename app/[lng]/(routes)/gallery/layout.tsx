
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Gallery",
    description: "This is the gallery page.",
};

export default function ContentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (children);
}
