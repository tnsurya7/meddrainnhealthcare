"use client";

import React, { useState, useMemo } from "react";
import { Course } from "@/lib/db/schema";
import { CourseCard } from "../ui/CourseCard";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { EmptyState } from "../ui/EmptyState";
import { Search, BookOpen } from "lucide-react";

interface CoursesExplorerProps {
  initialCourses: Course[];
}

export function CoursesExplorer({ initialCourses }: CoursesExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"order" | "title" | "newest">("order");

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    initialCourses.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ["All", ...Array.from(set)];
  }, [initialCourses]);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = initialCourses.filter((course) => {
      const matchesCategory =
        selectedCategory === "All" || course.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        course.shortDescription.toLowerCase().includes(q) ||
        course.category.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });

    if (sortBy === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "newest") {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else {
      result.sort((a, b) => a.displayOrder - b.displayOrder);
    }

    return result;
  }, [initialCourses, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="w-full md:max-w-md">
          <Input
            placeholder="Search courses by title, topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Filter & Sort Controls */}
        <div className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-3">
          {/* Category Dropdown (on mobile) or Tabs */}
          <div className="w-full sm:w-48">
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  Category: {cat}
                </option>
              ))}
            </Select>
          </div>

          {/* Sort Dropdown */}
          <div className="w-full sm:w-44">
            <Select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "order" | "title" | "newest")
              }
            >
              <option value="order">Featured Order</option>
              <option value="newest">Recently Added</option>
              <option value="title">Alphabetical (A-Z)</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Category Pills (Desktop Quick Filter) */}
      <div className="hidden sm:flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
              selectedCategory === cat
                ? "bg-[#155EEF] text-white shadow-sm"
                : "bg-white text-[#64748B] border border-[#E2E8F0] hover:bg-[#F5F8FC] hover:text-[#10243A]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={<BookOpen className="w-7 h-7" />}
          title="No matching courses found"
          description="Try adjusting your search query or selected category to view available biomedical training courses."
          actionLabel="Clear Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("All");
          }}
        />
      )}
    </div>
  );
}
