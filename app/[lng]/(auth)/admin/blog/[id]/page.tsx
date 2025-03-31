import BlogEditor from "@/components/blog/BlogEditor";
import { Metadata } from "next";
export const metadata: Metadata = {
    title: "Admin Dashboard",
};
export default async function EditBlogPost({ params }: { params: Promise<{ id: string }> }) {
  const {id} = await params;

  return (
    <div>
      <BlogEditor blogId={id} />
    </div>
  );
}