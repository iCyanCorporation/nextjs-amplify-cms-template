
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog",
    description: "This is the blog page.",
};

export default function ContentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (children);
}
