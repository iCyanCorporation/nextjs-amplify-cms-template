"use client";

import { useState, useEffect, useRef } from "react";
import { projects } from "@/data/projects";
import { motion } from "framer-motion";
import { Search, X, ChevronDown } from "lucide-react";

const INITIAL_LOAD = 9;
const LOAD_MORE_COUNT = 6;

export default function Page() {
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

  // Filter tags based on search
  const filteredTags = allTags.filter(tag => 
    tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter projects based on selected tags
  const filteredProjects = selectedTags.length > 0
    ? projects.filter((project) => 
        selectedTags.some(tag => project.tags.includes(tag))
      )
    : projects;

  // Handle click outside to close filter
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
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
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100 &&
        visibleCount < filteredProjects.length
      ) {
        setVisibleCount((prev) => Math.min(prev + LOAD_MORE_COUNT, filteredProjects.length));
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

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Clear all selected tags
  const clearAllTags = () => {
    setSelectedTags([]);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen p-8 m-auto">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <h1 className="text-4xl font-bold mb-4 dark:text-white">Projects</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          A collection of my recent work and side projects.
        </p>

        {/* Filter Section */}
        <div className="mb-8">
          {/* Filter Dropdown */}
          <div className="relative mb-4" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="px-4 py-2 rounded-lg text-sm bg-secondary hover:bg-white dark:bg-gray-800 dark:hover:bg-gray-700 dark:text-white transition-colors flex items-center gap-2"
            >
              Filter by Tags
              <ChevronDown className={`w-4 h-4 transition-transform ${isFilterOpen ? "rotate-180" : ""}`} />
            </button>

            {isFilterOpen && (
              <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/50 p-4 z-10">
                {/* Search Input */}
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tags..."
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
                      className="flex items-center gap-3 px-3 py-2 hover:bg-secondary dark:hover:bg-gray-700 rounded-lg cursor-pointer group dark:text-white"
                    >
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm flex-1">{tag}</span>
                      <span className="text-xs text-gray-500">
                        ({projects.filter(p => p.tags.includes(tag)).length})
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
                <span
                  key={tag}
                  className="flex items-center gap-2 px-3 py-1.5 bg-secondary dark:bg-gray-700 rounded-full text-sm dark:text-white"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="hover:opacity-80"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={clearAllTags}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Project Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl dark:shadow-gray-900/30 dark:hover:shadow-gray-900/50 transition-all duration-300"
            >
              {/* Project Image */}
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={project.image}
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
                      View Project
                    </a>
                  )}
                </div>
              </div>

              {/* Project Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold dark:text-white">{project.title}</h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{project.year}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-secondary dark:bg-gray-700 text-sm rounded-full dark:text-gray-200"
                    >
                      {tag}
                    </span>
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
