"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getStudentDashboard, StudentDashboardData } from "@/lib/supabase/classroom";
import {
  BookOpen,
  Clock,
  PlayCircle,
  Award,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowRight,
  TrendingUp,
  GraduationCap,
  Loader2,
  AlertCircle,
} from "lucide-react";

export default function StudentDashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<StudentDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    getStudentDashboard()
      .then((res) => {
        setData(res);
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AuthenticationRequiredError") {
          router.replace("/login?next=/dashboard");
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "โหลดข้อมูลแดชบอร์ดไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        );
        setIsLoading(false);
      });
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8faf8]">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-bio-green">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-bold">กำลังโหลดข้อมูลจากฐานข้อมูล Supabase...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const enrolledCourses = data?.enrolledCourses || [];

  if (errorMessage) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8faf8]">
        <Header />
        <main className="flex-grow flex items-center justify-center px-5 py-24">
          <div className="max-w-md w-full bg-white border border-rose-200 rounded-2xl p-7 text-center shadow-sm">
            <AlertCircle className="w-9 h-9 text-rose-500 mx-auto mb-3" />
            <h1 className="text-lg font-extrabold text-bio-ink">โหลดแดชบอร์ดไม่สำเร็จ</h1>
            <p className="text-sm text-bio-muted mt-2">{errorMessage}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 bg-bio-green text-white rounded-xl px-5 py-2.5 text-sm font-bold"
            >
              ลองใหม่อีกครั้ง
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8]">
      <Header />

      <main className="flex-grow">
        {/* Student Welcome Banner */}
        <section className="bg-gradient-to-br from-[#0c4a2a] via-[#0b6b3a] to-[#16824a] text-white py-10 sm:py-14 relative overflow-hidden">
          <div className="dna dna-one opacity-15"></div>
          <div className="max-w-[1180px] px-5 mx-auto relative z-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-[#c8ead5] mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  STUDENT LEARNING DASHBOARD
                </span>
                <h1 className="text-2xl sm:text-4xl font-extrabold m-0 leading-tight">
                  สวัสดีครับ, {data?.studentName} 🌿
                </h1>
                <p className="text-xs sm:text-sm text-[#dcece2] mt-1.5 m-0 max-w-xl">
                  เรียนชีวะต่อเนื่อง สะสมชั่วโมงเรียน และดาวน์โหลดชีทสรุปสีสันสดใสเตรียมสอบ
                </p>
              </div>

              {/* Progress Summary Card */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shrink-0 max-w-xs space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#dcece2]">
                  <span>ความคืบหน้าการเรียนรวม</span>
                  <span className="text-amber-300">{data?.overallProgressPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-black/25 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${data?.overallProgressPercentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#c8ead5]">
                  <span>เรียนไปแล้ว {data?.totalLessonsCompleted} บทเรียน</span>
                  <span>{data?.totalStudyHours}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Resume Learning Shortcut Banner */}
        {data?.lastStudiedCourse && (
          <section className="max-w-[1180px] px-5 mx-auto -mt-6 relative z-20">
            <div className="bg-white border border-bio-line rounded-2xl p-5 sm:p-6 shadow-bio flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-bio-green text-white grid place-items-center shrink-0 shadow-md">
                  <PlayCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-bio-green uppercase tracking-wider block">
                    เรียนต่อจากเดิม (RESUME LESSON)
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-bio-ink m-0">
                    {data.lastStudiedCourse.title}
                  </h3>
                  <p className="text-xs text-bio-muted m-0 mt-0.5">
                    {data.lastStudiedLesson?.chapterTitle} — {data.lastStudiedLesson?.lessonTitle}
                  </p>
                </div>
              </div>

              <Link
                href={`/learn/${data.lastStudiedCourse.id}`}
                className="bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn rounded-xl px-5 py-3 font-bold text-xs sm:text-sm transition-all shrink-0 flex items-center gap-2"
              >
                <span>เข้าสู่ห้องเรียน</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </section>
        )}

        {/* Enrolled Courses Grid */}
        <section className="py-10 sm:py-14">
          <div className="max-w-[1180px] px-5 mx-auto space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-bio-ink m-0 flex items-center gap-2">
                  <GraduationCap className="w-6 h-6 text-bio-green" />
                  คอร์สเรียนของฉัน ({enrolledCourses.length} คอร์ส)
                </h2>
                <p className="text-xs text-bio-muted m-0 mt-1">
                  คอร์สที่คุณลงทะเบียนไว้แล้ว ดึงข้อมูลจากฐานข้อมูล Supabase
                </p>
              </div>

              <Link
                href="/courses"
                className="text-xs font-bold text-bio-green hover:underline flex items-center gap-1"
              >
                ค้นหาคอร์สเพิ่ม <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map(({ course, progressPercentage, completedLessons }) => {
                const progress = progressPercentage;
                return (
                  <div
                    key={course.id}
                    className="bg-white border border-bio-line rounded-2xl overflow-hidden shadow-sm hover:shadow-bio transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Course Card Banner */}
                      <div className={`h-36 p-5 text-white relative ${course.coverClass}`}>
                        <span className="inline-block bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold">
                          {course.gradeLevel}
                        </span>
                        <h3 className="absolute left-5 bottom-4 text-xl font-bold text-white leading-tight m-0 drop-shadow-sm">
                          {course.title}
                        </h3>
                      </div>

                      {/* Course Body */}
                      <div className="p-5 space-y-4">
                        <p className="text-xs text-bio-muted leading-relaxed line-clamp-2 m-0">
                          {course.subtitle}
                        </p>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-bio-ink">
                            <span className="text-bio-muted">
                              เรียนจบ {completedLessons}/{course.lessonsCount} บท
                            </span>
                            <span className="text-bio-green">{progress}%</span>
                          </div>
                          <div className="w-full h-2 bg-bio-cream rounded-full overflow-hidden">
                            <div
                              className="h-full bg-bio-green rounded-full"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="p-5 border-t border-bio-line/60 bg-bio-cream/30 flex items-center justify-between">
                      <span className="text-xs text-bio-muted font-medium flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-bio-green" />
                        {course.lessonsCount} บทเรียน
                      </span>
                      <Link
                        href={`/learn/${course.id}`}
                        className="bg-bio-green text-white hover:bg-bio-green-hover rounded-xl px-4 py-2 font-bold text-xs transition-colors flex items-center gap-1"
                      >
                        <span>เข้าเรียน</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {enrolledCourses.length === 0 && (
              <div className="bg-white border border-dashed border-bio-line rounded-2xl p-10 text-center">
                <GraduationCap className="w-10 h-10 text-bio-green/60 mx-auto mb-3" />
                <h3 className="text-base font-extrabold text-bio-ink m-0">
                  ยังไม่มีคอร์สที่ลงทะเบียน
                </h3>
                <p className="text-xs text-bio-muted mt-1 mb-4">
                  เมื่อชำระเงินหรือผู้ดูแลเพิ่มสิทธิ์ คอร์สจะปรากฏที่นี่อัตโนมัติ
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-1.5 bg-bio-green text-white rounded-xl px-5 py-2.5 text-xs font-bold"
                >
                  ดูคอร์สทั้งหมด <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Student Tools & PDF Material Downloads */}
        <section className="pb-16">
          <div className="max-w-[1180px] px-5 mx-auto">
            <div className="bg-white border border-bio-line rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h3 className="text-lg font-extrabold text-bio-ink m-0 flex items-center gap-2">
                <FileText className="w-5 h-5 text-bio-green" />
                เอกสารสรุป PDF & เครื่องมือช่วยเรียน
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 border border-bio-line rounded-xl bg-bio-cream/40 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bio-green-soft text-bio-green grid place-items-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-bio-ink m-0">ชีทสรุปภาพรวม ม.ปลาย</h4>
                    <p className="text-xs text-bio-muted m-0 mt-0.5 mb-2">ไฟล์ PDF สรุปชีววิทยา 4 สี พิมพ์ได้</p>
                    <button
                      onClick={() => alert("เริ่มดาวน์โหลดไฟล์ PDF สรุปชีววิทยา...")}
                      className="text-xs font-bold text-bio-green hover:underline"
                    >
                      ⬇️ ดาวน์โหลด PDF
                    </button>
                  </div>
                </div>

                <div className="p-4 border border-bio-line rounded-xl bg-bio-cream/40 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bio-green-soft text-bio-green grid place-items-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-bio-ink m-0">ถาม-ตอบ กับติวเตอร์</h4>
                    <p className="text-xs text-bio-muted m-0 mt-0.5 mb-2">ส่งคำถามข้อสงสัยโจทย์ชีวะ</p>
                    <Link
                      href={
                        enrolledCourses[0]
                          ? `/learn/${enrolledCourses[0].course.id}`
                          : "/courses"
                      }
                      className="text-xs font-bold text-bio-green hover:underline"
                    >
                      💬 พิมพ์ถามติวเตอร์
                    </Link>
                  </div>
                </div>

                <div className="p-4 border border-bio-line rounded-xl bg-bio-cream/40 flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-bio-green-soft text-bio-green grid place-items-center shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-bio-ink m-0">คลังแบบทดสอบย่อย</h4>
                    <p className="text-xs text-bio-muted m-0 mt-0.5 mb-2">วัดความเข้าใจหลังเรียนจบแต่ละบท</p>
                    <Link
                      href="/courses"
                      className="text-xs font-bold text-bio-green hover:underline"
                    >
                      📝 เริ่มทำแบบทดสอบ
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
