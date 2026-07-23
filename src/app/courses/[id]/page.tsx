"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { COURSES_DATA, REVIEWS_DATA } from "@/data/mockData";
import { SyllabusAccordion } from "@/components/SyllabusAccordion";
import { PreviewModal } from "@/components/PreviewModal";
import {
  Star,
  Clock,
  BookOpen,
  Users,
  CheckCircle2,
  Play,
  Award,
  FileText,
  ShieldCheck,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CourseDetailPage({ params }: CourseDetailPageProps) {
  const resolvedParams = use(params);
  const courseId = resolvedParams.id;
  const course = COURSES_DATA.find((c) => c.id === courseId) || COURSES_DATA[0];

  const [activeTab, setActiveTab] = useState<"overview" | "syllabus" | "tutor" | "reviews">("overview");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleOpenPreview = () => {
    setIsPreviewOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8]">
      <Header />

      <main className="flex-grow">
        {/* Course Header Banner */}
        <section className="bg-gradient-to-br from-[#0c4a2a] via-[#0b6b3a] to-[#16824a] text-white py-10 sm:py-14 relative overflow-hidden">
          <div className="dna dna-one opacity-15"></div>
          <div className="max-w-[1180px] px-5 mx-auto relative z-10">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-xs text-[#c8ead5] mb-4">
              <Link href="/courses" className="hover:underline flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> คอร์สเรียนทั้งหมด
              </Link>
              <span>/</span>
              <span className="font-semibold text-white truncate max-w-xs">{course.title}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold">
                    {course.tag}
                  </span>
                  <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#dcece2]">
                    {course.gradeLevel}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight mb-3">
                  {course.title}
                </h1>
                <p className="text-sm sm:text-base text-[#dcece2] leading-relaxed max-w-2xl mb-6">
                  {course.subtitle} — {course.description}
                </p>

                {/* Course Quick Stats */}
                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#e6f4ea] font-medium border-t border-white/15 pt-4">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    <span>{course.rating}</span>
                    <span className="text-white/80 font-normal">({course.reviewsCount} รีวิว)</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#c8ead5]" />
                    <span>{course.studentsCount.toLocaleString()} นักเรียน</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-[#c8ead5]" />
                    <span>{course.lessonsCount} บทเรียน</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#c8ead5]" />
                    <span>{course.totalHours}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content & Sticky Sidebar Grid */}
        <section className="py-10 sm:py-14">
          <div className="max-w-[1180px] px-5 mx-auto grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
            {/* Left Column: Video Preview & Tabs */}
            <div className="space-y-8">
              {/* Video Player Preview Container */}
              <div className="bg-white border border-bio-line rounded-2xl overflow-hidden shadow-sm">
                <div
                  className="relative aspect-video bg-gradient-to-br from-[#0c5f36] to-[#82af65] flex items-center justify-center p-6 group cursor-pointer"
                  onClick={handleOpenPreview}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-bio-green flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform relative z-10">
                    <Play className="w-7 h-7 sm:w-8 sm:h-8 fill-current ml-1" />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold z-10 bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl">
                    <span>▶ ดูคลิปทดลองเรียนฟรี</span>
                    <span className="bg-bio-green text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      ตัวอย่างคอร์ส
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs Navigation Header */}
              <div className="border-b border-bio-line bg-white rounded-2xl p-1.5 shadow-sm flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    activeTab === "overview"
                      ? "bg-bio-green text-white shadow-sm"
                      : "text-bio-muted hover:text-bio-ink"
                  }`}
                >
                  รายละเอียดคอร์ส
                </button>
                <button
                  onClick={() => setActiveTab("syllabus")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    activeTab === "syllabus"
                      ? "bg-bio-green text-white shadow-sm"
                      : "text-bio-muted hover:text-bio-ink"
                  }`}
                >
                  เนื้อหาบทเรียน ({course.syllabus.length} บท)
                </button>
                <button
                  onClick={() => setActiveTab("tutor")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    activeTab === "tutor"
                      ? "bg-bio-green text-white shadow-sm"
                      : "text-bio-muted hover:text-bio-ink"
                  }`}
                >
                  ผู้สอน
                </button>
                <button
                  onClick={() => setActiveTab("reviews")}
                  className={`flex-1 py-3 text-xs sm:text-sm font-bold rounded-xl transition-all ${
                    activeTab === "reviews"
                      ? "bg-bio-green text-white shadow-sm"
                      : "text-bio-muted hover:text-bio-ink"
                  }`}
                >
                  รีวิว ({course.reviewsCount})
                </button>
              </div>

              {/* Tab Content 1: Overview */}
              {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in duration-200">
                  {/* Highlights Card */}
                  <div className="bg-white border border-bio-line rounded-2xl p-6 sm:p-8 shadow-sm">
                    <h3 className="text-lg font-extrabold text-bio-ink mb-4 flex items-center gap-2">
                      <Award className="w-5 h-5 text-bio-green" />
                      สิ่งที่คุณจะได้เรียนรู้ในคอร์สนี้
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {course.highlights.map((highlight, index) => (
                        <div key={index} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-5 h-5 text-bio-green shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-bio-ink font-medium leading-relaxed">
                            {highlight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Course Description */}
                  <div className="bg-white border border-bio-line rounded-2xl p-6 sm:p-8 shadow-sm space-y-4">
                    <h3 className="text-lg font-extrabold text-bio-ink">รายละเอียดและจุดเด่นของคอร์ส</h3>
                    <p className="text-xs sm:text-sm text-bio-muted leading-relaxed">
                      คอร์สเรียนนี้ได้รับการออกแบบตามหลักสูตรแกนกลางล่าสุด ร่วมกับแนวข้อสอบคัดเลือก TCAS A-Level และ TPAT1 กสพท.
                      มุ่งเน้นการปูพื้นฐานความเข้าใจเชิงโครงสร้าง เพื่อให้นักเรียนสามารถจำภาพรวม และนำไปประยุกต์ทำโจทย์คำนวณและวิเคราะห์ผลทดลองได้อย่างแม่นยำ
                    </p>
                  </div>
                </div>
              )}

              {/* Tab Content 2: Syllabus */}
              {activeTab === "syllabus" && (
                <div className="bg-white border border-bio-line rounded-2xl p-6 sm:p-8 shadow-sm animate-in fade-in duration-200">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-extrabold text-bio-ink m-0">โครงสร้างบทเรียนทั้งหมด</h3>
                      <p className="text-xs text-bio-muted m-0 mt-1">
                        รวมทั้งสิ้น {course.lessonsCount} บทเรียน ({course.totalHours})
                      </p>
                    </div>
                  </div>
                  <SyllabusAccordion
                    chapters={course.syllabus}
                    onSelectPreviewLesson={() => handleOpenPreview()}
                  />
                </div>
              )}

              {/* Tab Content 3: Tutor Profile */}
              {activeTab === "tutor" && (
                <div className="bg-white border border-bio-line rounded-2xl p-6 sm:p-8 shadow-sm animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                    <img
                      src={course.tutor.avatar}
                      alt={course.tutor.name}
                      className="w-24 h-24 rounded-2xl object-cover border-2 border-bio-green/30 shadow-md shrink-0"
                    />
                    <div className="space-y-2 text-center sm:text-left">
                      <span className="inline-block bg-bio-green-soft text-bio-green text-xs font-bold px-3 py-1 rounded-full">
                        ติวเตอร์ประจำคอร์ส
                      </span>
                      <h3 className="text-xl font-extrabold text-bio-ink m-0">{course.tutor.name}</h3>
                      <p className="text-xs sm:text-sm font-semibold text-bio-green m-0">{course.tutor.title}</p>
                      <p className="text-xs text-bio-muted leading-relaxed mt-2">{course.tutor.bio}</p>
                      <div className="pt-2">
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-bio-ink bg-bio-cream px-3 py-1.5 rounded-lg border border-bio-line">
                          <GraduationCap className="w-4 h-4 text-bio-green" />
                          {course.tutor.experience}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab Content 4: Reviews */}
              {activeTab === "reviews" && (
                <div className="bg-white border border-bio-line rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-extrabold text-bio-ink m-0">รีวิวจากนักเรียนที่เรียนคอร์สนี้</h3>
                    <div className="flex items-center gap-1.5 text-amber-500 font-bold text-base">
                      <Star className="w-5 h-5 fill-current" />
                      <span>{course.rating} / 5.0</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    {REVIEWS_DATA.map((review) => (
                      <div key={review.id} className="p-4 border border-bio-line rounded-xl bg-bio-cream/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-full bg-bio-green-soft text-bio-green font-bold text-xs grid place-items-center">
                              {review.avatarLetter}
                            </span>
                            <div>
                              <strong className="block text-xs font-bold text-bio-ink">{review.author}</strong>
                              <span className="block text-[11px] text-bio-muted">{review.school}</span>
                            </div>
                          </div>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-3.5 h-3.5 fill-current" />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-bio-ink leading-relaxed m-0">{review.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Sticky Enrollment Sidebar */}
            <div className="lg:sticky lg:top-[96px] space-y-4">
              <div className="bg-white border border-bio-line rounded-2xl p-6 sm:p-7 shadow-bio space-y-6">
                {/* Price Display */}
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs font-bold text-bio-muted">ราคาคอร์สเรียน</span>
                    {course.originalPrice && (
                      <span className="text-xs font-bold text-bio-green bg-bio-green-soft px-2.5 py-0.5 rounded-full">
                        ประหยัด {(course.originalPrice - course.price).toLocaleString()} บาท
                      </span>
                    )}
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-bio-green">
                      {course.price.toLocaleString()}
                    </span>
                    <span className="text-base font-bold text-bio-ink">บาท</span>
                    {course.originalPrice && (
                      <span className="text-sm text-bio-muted line-through ml-1">
                        {course.originalPrice.toLocaleString()}.-
                      </span>
                    )}
                  </div>
                </div>

                {/* CTA Enrollment Buttons */}
                <div className="space-y-2.5">
                  <button
                    onClick={() => alert(`ขอบคุณที่สนใจสมัครเรียนคอร์ส ${course.title}!`)}
                    className="w-full bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn rounded-xl py-3.5 font-bold text-base transition-all text-center"
                  >
                    สมัครเรียนคอร์สนี้ทันที
                  </button>
                  <button
                    onClick={handleOpenPreview}
                    className="w-full bg-bio-cream text-bio-ink hover:bg-bio-green-soft rounded-xl py-3 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 text-bio-green fill-current" /> ดูคลิปทดลองเรียนฟรี
                  </button>
                </div>

                {/* Features Included List */}
                <div className="border-t border-bio-line pt-5 space-y-3">
                  <h4 className="text-xs font-bold text-bio-ink uppercase tracking-wider m-0">
                    สิ่งที่คุณจะได้รับในคอร์สนี้:
                  </h4>
                  <ul className="space-y-2 text-xs text-bio-muted p-0 m-0">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-bio-green shrink-0" />
                      เข้าถึงคลิปวิดีโอเนื้อหา {course.lessonsCount} บทเรียน ({course.totalHours})
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-bio-green shrink-0" />
                      ไฟล์หนังสือเรียน PDF สรุปภาพสี พิมพ์ได้ทันที
                    </li>
                    <li className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-bio-green shrink-0" />
                      เรียนทบทวนย้อนหลังได้ไม่จำกัดตลอด 1 ปีเต็ม
                    </li>
                    <li className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-bio-green shrink-0" />
                      ถาม-ตอบข้อสงสัยกับทีมงานติวเตอร์ใต้คลิป
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* Preview Video Modal */}
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
