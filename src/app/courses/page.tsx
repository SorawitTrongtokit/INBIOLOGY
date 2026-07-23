"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CourseCard } from "@/components/CourseCard";
import { useCourses } from "@/hooks/useCatalog";
import { CourseCategory, GradeLevel } from "@/types";
import { Search, SlidersHorizontal, BookOpen, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ScrollReveal";

type FilterGrade = "all" | GradeLevel | CourseCategory;

export default function CoursesPage() {
  const { data: courses, isLoading, error } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<FilterGrade>("all");
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc">("popular");

  const filterPills: { key: FilterGrade; label: string }[] = [
    { key: "all", label: "คอร์สทั้งหมด" },
    { key: "ม.4", label: "ชีวะ ม.4" },
    { key: "ม.5", label: "ชีวะ ม.5" },
    { key: "ม.6", label: "ชีวะ ม.6" },
    { key: "ม.ปลาย / TCAS", label: "สอบเข้า TCAS / A-Level" },
    { key: "deep", label: "คอร์สเจาะลึกพิเศษ" },
  ];

  // Filtering & Sorting logic
  const filteredCourses = courses.filter((course) => {
    // Grade & Category filter
    const matchesFilter =
      selectedGrade === "all" ||
      course.gradeLevel === selectedGrade ||
      course.category === selectedGrade;

    // Search query filter
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    return (b.studentsCount || 0) - (a.studentsCount || 0); // popular
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8]">
      <Header />

      <main className="flex-grow">
        {/* Catalog Banner */}
        <section className="bg-gradient-to-br from-[#0b6b3a] via-[#125c3e] to-[#16824a] text-white py-12 sm:py-16 relative overflow-hidden">
          <div className="dna dna-one opacity-20"></div>
          <div className="dna dna-two opacity-20"></div>

          <div className="max-w-[1180px] px-5 mx-auto relative z-10 text-center">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold tracking-wider mb-4 border border-white/20">
              <Sparkles className="w-3.5 h-3.5 text-[#c8ead5]" />
              INBIO COURSES CATALOG
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold m-0 leading-tight">
              คอร์สเรียนชีววิทยา ทั้งหมด
            </h1>
            <p className="text-sm sm:text-base text-[#dcece2] max-w-2xl mx-auto mt-3 mb-8">
              สรุปเนื้อหาลึก กระชับ ครบทุกระดับชั้น ม.4 - ม.6 และเตรียมสอบเข้ามหาวิทยาลัย
            </p>

            {/* Search Input Box */}
            <div className="max-w-xl mx-auto relative">
              <Search className="w-5 h-5 text-bio-muted absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="ค้นหาคอร์สเรียน เช่น พันธุศาสตร์, ม.4, A-Level..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white rounded-2xl text-bio-ink text-sm sm:text-base font-medium focus:outline-none shadow-bio placeholder:text-bio-muted"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-bio-muted hover:text-bio-ink text-xs font-bold"
                >
                  ล้างคำค้น
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Filter Controls Bar */}
        <section className="py-8 bg-white border-b border-bio-line sticky top-[76px] z-30 shadow-sm">
          <div className="max-w-[1180px] px-5 mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
              {filterPills.map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setSelectedGrade(pill.key)}
                  className={`rounded-full px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap transition-all border ${
                    selectedGrade === pill.key
                      ? "bg-bio-green text-white border-bio-green shadow-sm"
                      : "bg-bio-cream/80 text-bio-ink border-bio-line hover:border-bio-green/50"
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
              <span className="text-xs font-semibold text-bio-muted flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-bio-green" />
                เรียงตาม:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-white border border-bio-line rounded-xl px-3 py-1.5 text-xs sm:text-sm font-semibold text-bio-ink focus:outline-none cursor-pointer hover:border-bio-green"
              >
                <option value="popular">🔥 ยอดนิยมสูงสุด</option>
                <option value="price-asc">💵 ราคา: น้อยไปมาก</option>
                <option value="price-desc">💎 ราคา: มากไปน้อย</option>
              </select>
            </div>
          </div>
        </section>

        {/* Courses Grid List */}
        <section className="py-12 sm:py-16">
          <div className="max-w-[1180px] px-5 mx-auto">
            {/* Result Info */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-bio-ink flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-bio-green" />
                พบคอร์สเรียน ({filteredCourses.length} รายการ)
              </h2>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-sm font-semibold text-red-700">
                โหลดคอร์สเรียนไม่สำเร็จ กรุณารีเฟรชหน้าแล้วลองใหม่
              </div>
            ) : isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-[420px] animate-pulse rounded-[18px] border border-bio-line bg-white"
                  />
                ))}
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white border border-bio-line rounded-2xl p-8">
                <span className="text-4xl block mb-3">🔍</span>
                <h3 className="text-lg font-bold text-bio-ink mb-1">ไม่พบคอร์สเรียนที่ตรงกับคำค้นหา</h3>
                <p className="text-xs sm:text-sm text-bio-muted mb-4">
                  ลองเปลี่ยนคำค้นหา หรือเลือกลองค้นหาหมวดหมู่อื่นๆ
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGrade("all");
                  }}
                  className="bg-bio-green text-white rounded-xl px-4 py-2 text-xs font-bold hover:bg-bio-green-hover transition-colors"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="pb-16">
          <div className="max-w-[1180px] px-5 mx-auto">
            <ScrollReveal>
              <div className="bg-gradient-to-r from-[#125c3e] to-[#0b6b3a] text-white rounded-2xl p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-bio">
                <div>
                  <h3 className="text-2xl font-extrabold m-0">ยังไม่แน่ใจว่าจะเริ่มเรียนคอร์สไหนดี?</h3>
                  <p className="text-xs sm:text-sm text-[#dcece2] m-0 mt-1">
                    ปรึกษาการเลือกคอร์สและวางแผนการเรียนกับพี่ติวเตอร์ฟรี ทาง LINE Official
                  </p>
                </div>
                <a
                  href="https://line.me"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-bio-green font-bold text-sm px-6 py-3 rounded-xl hover:bg-bio-cream shadow-sm transition-all shrink-0"
                >
                  💬 ปรึกษาฟรีทาง LINE
                </a>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
