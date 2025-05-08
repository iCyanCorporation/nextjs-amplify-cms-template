import BlogEditor from "@/app/[lng]/(auth)/admin/blog/components/BlogEditor";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Dashboard",
};
export default async function EditBlogPost({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div>
      <BlogEditor blogId={id} />
    </div>
  );
}
