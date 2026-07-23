"use client";

import React, { useState } from "react";
import { COURSES_DATA } from "@/data/mockData";
import { CourseCategory } from "@/types";
import { CourseCard } from "./CourseCard";
import { ScrollReveal } from "./ScrollReveal";

export const CoursesSection: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | CourseCategory>("all");
  const [showAll, setShowAll] = useState(false);

  const filterTabs: { key: "all" | CourseCategory; label: string }[] = [
    { key: "all", label: "ทั้งหมด" },
    { key: "basic", label: "พื้นฐาน" },
    { key: "exam", label: "สอบเข้า" },
    { key: "deep", label: "เจาะลึก" },
  ];

  // Filter logic matching original script
  const filteredCourses = COURSES_DATA.filter((course) => {
    if (course.isExtra && !showAll) return false;
    if (activeFilter === "all") return true;
    return course.category === activeFilter;
  });

  return (
    <section className="py-[75px] sm:py-[105px]" id="courses">
      <div className="max-w-[1180px] px-5 mx-auto">
        {/* Section Header */}
        <ScrollReveal className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-[30px] gap-4">
          <div>
            <span className="block text-bio-green-2 text-xs font-extrabold tracking-[1.6px] mb-2">
              POPULAR COURSES
            </span>
            <h2 className="text-[30px] sm:text-[38px] font-extrabold leading-tight m-0">
              คอร์สเรียนแนะนำ
            </h2>
          </div>
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-none border-0 text-bio-green font-bold text-sm hover:underline cursor-pointer"
          >
            {showAll ? "ซ่อนคอร์สเพิ่มเติม ↑" : "ดูคอร์สทั้งหมด →"}
          </button>
        </ScrollReveal>

        {/* Filter Tabs */}
        <ScrollReveal className="flex flex-wrap gap-[9px] mb-[25px]">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={`rounded-full px-[15px] py-[8px] text-sm font-semibold transition-all border ${
                activeFilter === tab.key
                  ? "bg-bio-green text-white border-bio-green shadow-sm"
                  : "bg-white text-bio-ink border-bio-line hover:border-bio-green/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </ScrollReveal>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  );
};
