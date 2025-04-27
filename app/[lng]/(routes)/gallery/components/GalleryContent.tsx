"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";
import { Project } from "@/types/gallery";
import { useTranslation } from "@/app/i18n/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const INITIAL_LOAD = 9;
const LOAD_MORE_COUNT = 6;

interface GalleryContentProps {
  projects: Project[];
  lng: string;
}

export default function GalleryContent({ projects, lng }: GalleryContentProps) {
  const { t: t1 } = useTranslation(lng, "gallery");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);

  // Get unique tags and sort them by frequency
  const allTags = Array.from(
    new Set(projects.flatMap((project) => project.tags))
  ).sort((a, b) => {
    const countA = projects.filter((p) => p.tags.includes(a)).length;
    const countB = projects.filter((p) => p.tags.includes(b)).length;
    return countB - countA;
  });

  // Filter tags based on search
  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter projects based on selected tags
  const filteredProjects =
    selectedTags.length > 0
      ? projects.filter((project) =>
          selectedTags.some((tag) => project.tags.includes(tag))
        )
      : projects;

  // Handle click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        visibleCount < filteredProjects.length
      ) {
        setVisibleCount((prev) =>
          Math.min(prev + LOAD_MORE_COUNT, filteredProjects.length)
        );
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [visibleCount, filteredProjects.length]);

  // Reset visible count when changing tags
  useEffect(() => {
    setVisibleCount(INITIAL_LOAD);
  }, [selectedTags]);

  const visibleProjects = filteredProjects.slice(0, visibleCount);

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const clearAllTags = () => {
    setSelectedTags([]);
    setIsFilterOpen(false);
  };

  return (
    <div>
      <div>
        {/* Filter Section */}
        <div className="mb-8">
          {/* Filter Dropdown */}
          <div className="relative mb-4" ref={filterRef}>
            <Button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2"
              variant="outline"
            >
              {t1("gallery.filterByTags", "Filter by Tags")}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`}
              />
            </Button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-4 z-10">
                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" />
                  <input
                    type="text"
                    placeholder={t1("gallery.searchTags", "Search tags...")}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-blue-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  )}
                </div>

                {/* Tags List with Checkboxes */}
                <div className="max-h-60 overflow-y-auto">
                  {filteredTags.map((tag) => (
                    <label
                      key={tag}
                      className="flex items-center gap-3 px-3 py-2 hover:opacity-80 transition-opacity rounded-lg cursor-pointer group dark:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm flex-1">{tag}</span>
                      <span className="text-xs text-gray-500">
                        ({projects.filter((p) => p.tags.includes(tag)).length})
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Selected Tags Display */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {selectedTags.map((tag) => (
                <Badge
                  key={tag}
                  className="flex items-center justify-center gap-1 px-3 py-1.5"
                >
                  {tag}
                  <button onClick={() => toggleTag(tag)} className="">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="ghost" onClick={clearAllTags} className="">
                {t1("gallery.clearAll", "Clear all")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Project Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.imageUrl}
                  alt={project.title}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2 bg-white text-black rounded-full hover:bg-opacity-90 transition-colors"
                    >
                      {t1("gallery.viewProject", "View Project")}
                    </a>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold dark:text-white">
                    {t1(project.title)}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {project.year}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {t1(project.description)}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Loading More Indicator */}
        {visibleCount < filteredProjects.length && (
          <div className="text-center mt-8">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>
    </div>
  );
}
