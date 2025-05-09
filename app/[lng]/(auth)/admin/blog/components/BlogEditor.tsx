"use client";

import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { categoryList } from "@/types/blog";
import EditForm from "@/components/common/EditorComponent";
import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ImagePlus,
  ImageUp,
  RefreshCw,
} from "lucide-react";
import { IoMdClose } from "react-icons/io";
import {
  ImagePicker,
  ImagePickerButton,
} from "@/components/common/image/ImagePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
const client = generateClient<Schema>();

export default function BlogEditor({ blogId }: { blogId?: string }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [category, setCategory] = useState<string>("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (blogId) {
      loadBlog(blogId);
    }
  }, [blogId]);

  async function loadBlog(id: string) {
    try {
      setIsLoading(true);
      const { data } = await client.models.Blog.get({ id });

      if (!data) return;
      setTitle(data.title || "");
      setImgUrl(data.imgUrl || "");
      setContent(data.content || "");
      setCategory(data.category || "");
      setTags(data.tags?.filter((tag): tag is string => tag !== null) || []);
    } catch (error) {
      console.error("Error loading blog:", error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    try {
      const now = new Date().toISOString();

      if (blogId) {
        await client.models.Blog.update({
          id: blogId,
          title,
          imgUrl,
          content,
          category,
          tags: tags.length > 0 ? tags : null,
          updatedAt: now,
        });
      } else {
        await client.models.Blog.create({
          title,
          imgUrl,
          content,
          category,
          tags: tags.length > 0 ? tags : null,
          createdAt: now,
          updatedAt: now,
        });
      }

      router.push("/admin/blog");
    } catch (error) {
      console.error("Error saving blog:", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div>
      <div className="z-50 flex items-center gap-2 p-4">
        <Link href="/admin/blog">
          <Button className="p-2 hover:opacity-80" variant="outline">
            <ArrowLeftFromLine className="mr-2 h-4 w-4" /> Back
          </Button>
        </Link>
        <Button
          className="hover:opacity-80"
          onClick={() => window.location.reload()}
          variant="outline"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Refresh
        </Button>
        <Button
          type="submit"
          form="blog-form"
          disabled={isLoading}
          className="hover:opacity-80"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="mr-2 h-4 w-4 inline-block" />{" "}
              Processing...
            </>
          ) : blogId ? (
            <>
              <ArrowRightFromLine className="mr-2 h-4 w-4" /> Update Post
            </>
          ) : (
            <>
              <ArrowRightFromLine className="mr-2 h-4 w-4" /> Create Post
            </>
          )}
        </Button>
      </div>
      <div className="flex">
        {/* ================================
      Editor
      ================================ */}
        <div className={`p-4 space-y-6 ${isPreview ? "w-1/2" : "w-full"}`}>
          <Card>
            <CardHeader>
              <CardTitle>
                {blogId ? "Edit Blog Post" : "Create New Blog Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                id="blog-form"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    disabled={isLoading}
                    placeholder="Enter blog title"
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="flex gap-2">
                    <p>Post Image</p>
                    <ImagePickerButton
                      onSelect={(url) => {
                        // url is a string
                        if (Array.isArray(url)) {
                          setImgUrl(url[0]);
                        } else {
                          setImgUrl(url);
                        }
                      }}
                      buttonText="Choose an image"
                    />
                  </Label>
                  <div className=" items-center gap-4">
                    {imgUrl && (
                      <div className="aspect-square relative h-24 relative items-center flex">
                        <img
                          src={imgUrl}
                          alt="Post Image"
                          className="object-cover w-full h-full rounded"
                        />
                        <button
                          onClick={() => setImgUrl("")}
                          className="absolute top-2 right-2 p-1 bg-red-300 bg-opacity-70 rounded-full aspect-square h-6 w-6 flex items-center justify-center hover:opacity-80"
                        >
                          <IoMdClose className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={category}
                    onValueChange={setCategory}
                    disabled={isLoading}
                    defaultValue={categoryList[0]}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-48">
                      {categoryList.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <EditForm content={content} onChange={setContent} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      id="tags"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      placeholder="Add a tag"
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      onClick={handleAddTag}
                      disabled={!currentTag.trim() || isLoading}
                      variant="secondary"
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-1 hover:text-destructive"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        {/* ================================
      Preview 
      ================================= */}
        <div className={`p-4 ${isPreview ? "w-1/2" : "w-0"}`}>
          <button onClick={() => setIsPreview(!isPreview)}>
            {isPreview ? (
              <ArrowRightFromLine className="h-4 w-4" />
            ) : (
              <ArrowLeftFromLine className="h-4 w-4" />
            )}
          </button>

          {isPreview && (
            <div
              className="prose dark:prose-invert max-w-none
            prose-table:border-collapse
            prose-td:border prose-td:border-gray-300 prose-td:dark:border-gray-700 prose-td:p-2
            prose-th:border prose-th:border-gray-300 prose-th:dark:border-gray-700 prose-th:p-2
            prose-th:bg-gray-100 prose-th:dark:bg-gray-800
            prose-ul:list-disc prose-ul:ml-4
            prose-ol:list-decimal prose-ol:ml-4
            prose-li:my-1
          "
            >
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold mb-4">Content Preview</h2>
              </div>
              <div dangerouslySetInnerHTML={{ __html: content }} />
              {tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
