import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Dashboard",
};

import { ImageManager } from "@/components/common/image/ImageManager";

export default function ImageManagementPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Image Management</h1>
      </div>
      <ImageManager />
    </div>
  );
}
