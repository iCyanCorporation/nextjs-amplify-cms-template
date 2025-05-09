'use client';

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import { Project } from "@/types/gallery";

interface GalleryContentProps {
  projects: Project[];
  translations: {
    [key: string]: string;
  };
}

const INITIAL_LOAD = 9;
const LOAD_MORE_COUNT = 6;

export default function GalleryContent({ projects, translations }: GalleryContentProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  // Get unique tags and sort them by frequency
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort((a, b) => {
    const countA = projects.filter(p => p.tags.includes(a)).length;
    const countB = projects.filter(p => p.tags.includes(b)).length;
    return countB - countA;
  });

  // Filter projects based on selected tags and search query
  const filteredProjects = projects.filter((project) => {
    const matchesTags = selectedTags.length === 0 || selectedTags.every(tag => project.tags.includes(tag));
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTags && matchesSearch;
  });

  return (
    <>
      {/* Filter Section */}
      <div className="mb-8">
        {/* Copy the entire Filter Section JSX from the original file */}
        {/* Replace t1() calls with translations[] */}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Copy the entire Project Grid JSX from the original file */}
        {/* Replace t1() calls with translations[] */}
      </div>

      {/* Loading More Indicator */}
      {visibleCount < filteredProjects.length && (
        <div className="text-center mt-8">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
}
