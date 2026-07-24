"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useArticles } from "@/hooks/useCatalog";
import {
  Search,
  BookOpen,
  Clock,
  ArrowRight,
  Sparkles,
  Dna,
  HeartPulse,
  Leaf,
  Filter,
  GraduationCap,
} from "lucide-react";

export default function ArticlesPage() {
  const { data: articles, isLoading, error } = useArticles();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => {
      if (a.category) set.add(a.category);
    });
    return ["ทั้งหมด", ...Array.from(set)];
  }, [articles]);

  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      const matchesCategory =
        selectedCategory === "ทั้งหมด" || article.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [articles, selectedCategory, searchQuery]);

  const featuredArticle = filteredArticles[0];
  const remainingArticles = filteredArticles.slice(1);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dna":
        return <Dna className="w-6 h-6 text-bio-green stroke-[1.8]" />;
      case "heart-pulse":
        return <HeartPulse className="w-6 h-6 text-bio-green stroke-[1.8]" />;
      case "leaf":
        return <Leaf className="w-6 h-6 text-bio-green stroke-[1.8]" />;
      default:
        return <BookOpen className="w-6 h-6 text-bio-green stroke-[1.8]" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfb] text-bio-ink font-sans">
      <Header />

      <main className="flex-1 pb-20">
        {/* Banner / Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-[#eaf4ed] via-[#f4f9f5] to-[#fbfdfb] pt-12 pb-16 px-5 border-b border-bio-line">
          <div className="max-w-[1180px] mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-bio-green-soft border border-bio-green/20 rounded-full px-4 py-1.5 mb-5 text-bio-green text-xs font-extrabold tracking-wide">
              <Sparkles className="w-4 h-4 text-bio-green-2" /> INBIO KNOWLEDGE BASE
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-bio-dark leading-tight tracking-tight mb-4">
              คลังความรู้ & สรุปบทเรียนชีววิทยา
            </h1>
            <p className="text-sm sm:text-base text-[#526458] max-w-2xl mx-auto leading-relaxed mb-8">
              รวบรวมเทคนิคการจำ สรุปเนื้อหาสำคัญ และแนวข้อสอบชีววิทยา ม.ปลาย & TCAS สรุปสั้น เข้าใจง่าย นำไปใช้สอบได้จริง
            </p>

            {/* Search Bar */}
            <div className="max-w-xl mx-auto relative mb-6">
              <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#85968b]" />
              <input
                type="text"
                placeholder="ค้นหาชื่อบทความ เช่น DNA, หัวใจ, สังเคราะห์แสง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#d2e2d6] rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-bio-green focus:border-transparent text-sm placeholder-[#92a398] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#728578] hover:text-bio-green"
                >
                  ล้างคำค้น
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center justify-center gap-2 flex-wrap max-w-3xl mx-auto">
              <span className="text-xs font-bold text-[#6f8275] flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5" /> หมวดหมู่:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedCategory === cat
                      ? "bg-bio-green text-white shadow-sm"
                      : "bg-white text-[#526458] hover:bg-bio-green-soft hover:text-bio-green border border-[#dce8df]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-[1180px] mx-auto px-5 pt-12">
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-semibold text-red-700">
              เกิดข้อผิดพลาดในการโหลดบทความ กรุณาลองใหม่อีกครั้ง
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl border border-bio-line bg-white"
                />
              ))}
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-bio-line max-w-md mx-auto my-8">
              <div className="w-16 h-16 bg-bio-green-soft rounded-2xl flex items-center justify-center mx-auto mb-4 text-bio-green">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-bio-ink mb-2">
                ไม่พบบทความที่ค้นหา
              </h3>
              <p className="text-xs text-[#6a7c70] mb-5">
                ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นๆ ดูนะ
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("ทั้งหมด");
                }}
                className="px-5 py-2.5 bg-bio-green text-white text-xs font-bold rounded-xl hover:bg-bio-green-2 transition-colors"
              >
                ดูบทความทั้งหมด
              </button>
            </div>
          ) : (
            <div className="space-y-12">
              {/* Featured Article Card (if available and no specific search query filter active) */}
              {featuredArticle && searchQuery === "" && selectedCategory === "ทั้งหมด" && (
                <div className="bg-white rounded-3xl border border-bio-line overflow-hidden hover:border-bio-green/40 hover:shadow-lg transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 group">
                  <div className="lg:col-span-7 p-8 lg:p-10 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3.5 py-1 bg-bio-green-soft text-bio-green font-extrabold text-xs rounded-full">
                          🔥 บทความแนะนำ
                        </span>
                        <span className="text-xs font-bold text-[#6f8275] border-l border-[#e0eae2] pl-3">
                          {featuredArticle.category}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold text-bio-ink leading-snug mb-4 group-hover:text-bio-green transition-colors">
                        <Link href={`/articles/${featuredArticle.slug}`}>
                          {featuredArticle.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-[#57695d] leading-relaxed mb-6">
                        {featuredArticle.excerpt}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-[#f0f4f1] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-[#5c6e62]">
                          {featuredArticle.author || "ดร.วิภาวี กิจเจริญ"}
                        </span>
                        <span className="text-xs text-[#829387] flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-bio-green" />
                          {featuredArticle.readTime || "5 นาทีในการอ่าน"}
                        </span>
                      </div>
                      <Link
                        href={`/articles/${featuredArticle.slug}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-bio-green text-white text-xs font-extrabold rounded-xl hover:bg-bio-green-2 transition-all shadow-sm"
                      >
                        อ่านต่อ <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="lg:col-span-5 bg-gradient-to-br from-bio-green-soft via-[#eaf4ed] to-[#dcf0e2] p-8 lg:p-10 flex items-center justify-center relative overflow-hidden">
                    <div className="text-center relative z-10">
                      <div className="w-20 h-20 rounded-2xl bg-white/90 shadow-sm flex items-center justify-center mx-auto mb-4 text-bio-green group-hover:scale-110 transition-transform">
                        {getIcon(featuredArticle.icon)}
                      </div>
                      <span className="text-xs font-extrabold text-bio-green tracking-wider uppercase">
                        INBIO EXCLUSIVE CONTENT
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Grid of Articles */}
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-extrabold text-bio-ink flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-bio-green" />
                    {searchQuery || selectedCategory !== "ทั้งหมด"
                      ? `บทความที่ค้นพบ (${filteredArticles.length})`
                      : "บทความชีววิทยาทั้งหมด"}
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {(searchQuery !== "" || selectedCategory !== "ทั้งหมด"
                    ? filteredArticles
                    : remainingArticles
                  ).map((article) => (
                    <article
                      key={article.id}
                      className="bg-white rounded-2xl border border-bio-line p-6 hover:border-bio-green/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <div className="w-11 h-11 rounded-xl bg-bio-green-soft flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                            {getIcon(article.icon)}
                          </div>
                          <span className="px-3 py-1 bg-bio-green-soft text-bio-green font-bold text-[11px] rounded-full">
                            {article.category}
                          </span>
                        </div>

                        <h3 className="text-base font-extrabold text-bio-ink leading-snug mb-2.5 group-hover:text-bio-green transition-colors line-clamp-2">
                          <Link href={`/articles/${article.slug}`}>
                            {article.title}
                          </Link>
                        </h3>

                        <p className="text-xs text-[#5e7064] leading-relaxed line-clamp-3 mb-5">
                          {article.excerpt}
                        </p>
                      </div>

                      <div className="pt-4 border-t border-[#f0f4f1] flex items-center justify-between mt-auto">
                        <span className="text-[11px] text-[#7a8c80] inline-flex items-center gap-1.5 font-medium">
                          <Clock className="w-3.5 h-3.5 text-bio-green" />
                          {article.readTime || "5 นาทีในการอ่าน"}
                        </span>
                        <Link
                          href={`/articles/${article.slug}`}
                          className="text-bio-green font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                        >
                          อ่านบทความ <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Course CTA */}
          <div className="mt-16 bg-gradient-to-r from-bio-dark to-[#184832] rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden shadow-xl">
            <div className="max-w-2xl relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-bold text-bio-green-soft mb-4">
                <GraduationCap className="w-4 h-4 text-bio-green-2" /> อยากเรียนเจาะลึกเนื้อหาชีวะ ม.ปลาย?
              </div>
              <h2 className="text-2xl sm:text-3xl font-black mb-3 leading-tight">
                เตรียมสอบชีววิทยาอย่างมั่นใจด้วยคอร์สเรียน INBIO
              </h2>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed mb-6">
                เรียนชีววิทยาผ่านแผนภาพจำง่าย มีคลิปวิดีโออธิบายละเอียด ข้อสอบอัปเดตย้อนหลัง 10 ปี พร้อมถามตอบได้ตลอด 24 ชั่วโมง
              </p>
              <div className="flex items-center gap-4 flex-wrap">
                <Link
                  href="/courses"
                  className="px-6 py-3 bg-bio-green text-white font-extrabold text-sm rounded-xl hover:bg-bio-green-2 transition-all shadow-md inline-flex items-center gap-2"
                >
                  สำรวจคอร์สเรียนทั้งหมด <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
