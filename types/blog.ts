export type Blog = {
  readonly id: string;
  title: string | null;
  imgUrl: string | null;
  content: string | null;
  category: string | null;
  owner: string | null;
  tags: (string | null)[] | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export const categoryList = [
  "news",
  "tech",
  "life",
  "job",
  "travel",
  "study",
  "idea",
  "talk",
  "random",
  "other",
] as const;
