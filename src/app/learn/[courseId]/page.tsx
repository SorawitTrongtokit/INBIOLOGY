"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import {
  addLessonQuestion,
  ClassroomQuestion,
  getClassroomData,
  LessonProgress,
  saveLessonNote,
  saveLessonProgress,
} from "@/lib/supabase/classroom";
import type { Course, Chapter, Lesson } from "@/types";
import {
  Play,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Lock,
  Clock,
  BookOpen,
  FileText,
  MessageSquare,
  Sparkles,
  ArrowLeft,
  Send,
  Loader2,
  Maximize,
  RotateCcw,
  AlertCircle,
} from "lucide-react";

interface ClassroomPageProps {
  params: Promise<{ courseId: string }>;
}

function formatQuestionTime(createdAt: string) {
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(createdAt));
}

export default function ClassroomPage({ params }: ClassroomPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseCode = resolvedParams.courseId;

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeLessonIndex, setActiveLessonIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [progressByLesson, setProgressByLesson] = useState<
    Record<string, LessonProgress>
  >({});
  const [notesByLesson, setNotesByLesson] = useState<Record<string, string>>({});
  const [isSavingProgress, setIsSavingProgress] = useState(false);
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [noteStatus, setNoteStatus] = useState("");
  const [isSendingQuestion, setIsSendingQuestion] = useState(false);
  const [assetsByLesson, setAssetsByLesson] = useState<
    Record<string, { videoUrl?: string; documentUrl?: string }>
  >({});
  const [activeTab, setActiveTab] = useState<"overview" | "qa" | "notes" | "quiz">("overview");

  // Interactive Student Features State
  const [studentNote, setStudentNote] = useState("");
  const [qaInput, setQaInput] = useState("");
  const [qaList, setQaList] = useState<ClassroomQuestion[]>([]);

  // Quiz State
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizChecked, setQuizChecked] = useState(false);

  useEffect(() => {
    getClassroomData(courseCode)
      .then((res) => {
        setCourse(res.course);
        setProgressByLesson(res.progressByLesson);
        setNotesByLesson(res.notesByLesson);
        setQaList(res.questions);
        setAssetsByLesson(res.assetsByLesson);
        setActiveChapterIndex(res.initialChapterIndex);
        setActiveLessonIndex(res.initialLessonIndex);
        const initialLesson =
          res.course.syllabus[res.initialChapterIndex]?.lessons[
            res.initialLessonIndex
          ];
        setStudentNote(
          initialLesson ? res.notesByLesson[initialLesson.id] ?? "" : "",
        );
        setIsLoading(false);
      })
      .catch((error: unknown) => {
        if (error instanceof Error && error.name === "AuthenticationRequiredError") {
          router.replace(
            `/login?next=${encodeURIComponent(`/learn/${courseCode}`)}`,
          );
          return;
        }
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "โหลดข้อมูลห้องเรียนไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
        );
        setIsLoading(false);
      });
  }, [courseCode, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#132019] text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center py-24">
          <div className="flex flex-col items-center gap-3 text-bio-green">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-sm font-bold text-white">กำลังโหลดข้อมูลห้องเรียนจาก Supabase...</span>
          </div>
        </main>
      </div>
    );
  }

  if (errorMessage || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-[#0d1611] text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center px-5 py-24">
          <div className="max-w-md w-full bg-[#132019] border border-white/10 rounded-2xl p-7 text-center">
            <AlertCircle className="w-10 h-10 text-amber-400 mx-auto mb-3" />
            <h1 className="text-lg font-extrabold text-white">ไม่สามารถเข้าเรียนได้</h1>
            <p className="text-sm text-white/65 mt-2">
              {errorMessage || "ไม่พบคอร์สเรียนนี้"}
            </p>
            <div className="mt-5 flex items-center justify-center gap-2">
              <Link
                href="/dashboard"
                className="bg-bio-green text-white rounded-xl px-5 py-2.5 text-sm font-bold"
              >
                กลับแดชบอร์ด
              </Link>
              <Link
                href="/courses"
                className="bg-white/10 text-white rounded-xl px-5 py-2.5 text-sm font-bold"
              >
                ดูคอร์ส
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const currentChapter: Chapter | undefined = course.syllabus[activeChapterIndex] || course.syllabus[0];
  const currentLesson: Lesson | undefined = currentChapter?.lessons[activeLessonIndex] || currentChapter?.lessons[0];
  const currentAsset = currentLesson
    ? assetsByLesson[currentLesson.id]
    : undefined;

  const selectLesson = (chapterIndex: number, lessonIndex: number) => {
    const lesson = course.syllabus[chapterIndex]?.lessons[lessonIndex];
    if (!lesson) return;
    setActiveChapterIndex(chapterIndex);
    setActiveLessonIndex(lessonIndex);
    setStudentNote(notesByLesson[lesson.id] ?? "");
    setNoteStatus("");
    void saveLessonProgress(
      lesson,
      progressByLesson[lesson.id]?.isCompleted ?? false,
    )
      .then((lastWatchedAt) => {
        setProgressByLesson((previous) => ({
          ...previous,
          [lesson.id]: {
            positionSeconds:
              previous[lesson.id]?.positionSeconds ??
              (previous[lesson.id]?.isCompleted
                ? lesson.durationSeconds ?? 0
                : 0),
            isCompleted: previous[lesson.id]?.isCompleted ?? false,
            lastWatchedAt,
          },
        }));
      })
      .catch(() => undefined);
  };

  const handleNextLesson = async () => {
    if (!currentChapter || !currentLesson || isSavingProgress) return;
    setIsSavingProgress(true);
    try {
      const lastWatchedAt = await saveLessonProgress(currentLesson, true);
      setProgressByLesson((previous) => ({
        ...previous,
        [currentLesson.id]: {
          positionSeconds: currentLesson.durationSeconds ?? 0,
          isCompleted: true,
          lastWatchedAt,
        },
      }));

    if (activeLessonIndex < currentChapter.lessons.length - 1) {
        selectLesson(activeChapterIndex, activeLessonIndex + 1);
    } else if (activeChapterIndex < course.syllabus.length - 1) {
        selectLesson(activeChapterIndex + 1, 0);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "บันทึกความคืบหน้าไม่สำเร็จ",
      );
    } finally {
      setIsSavingProgress(false);
    }
  };

  const handlePrevLesson = () => {
    if (activeLessonIndex > 0) {
      selectLesson(activeChapterIndex, activeLessonIndex - 1);
    } else if (activeChapterIndex > 0) {
      const prevChapIndex = activeChapterIndex - 1;
      selectLesson(
        prevChapIndex,
        course.syllabus[prevChapIndex].lessons.length - 1,
      );
    }
  };

  const handleAddQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaInput.trim() || !currentLesson || isSendingQuestion) return;

    setIsSendingQuestion(true);
    try {
      const question = await addLessonQuestion(currentLesson.id, qaInput);
      setQaList((previous) => [question, ...previous]);
      setQaInput("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "ส่งคำถามไม่สำเร็จ",
      );
    } finally {
      setIsSendingQuestion(false);
    }
  };

  const handleSaveNote = async () => {
    if (!currentLesson || isSavingNote) return;
    setIsSavingNote(true);
    setNoteStatus("");
    try {
      await saveLessonNote(currentLesson.id, studentNote);
      setNotesByLesson((previous) => ({
        ...previous,
        [currentLesson.id]: studentNote,
      }));
      setNoteStatus("บันทึกแล้ว");
    } catch (error) {
      setNoteStatus(
        error instanceof Error ? error.message : "บันทึกโน้ตไม่สำเร็จ",
      );
    } finally {
      setIsSavingNote(false);
    }
  };

  const lessonQuestions = qaList.filter(
    (question) => question.lessonId === currentLesson?.id,
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#0d1611] text-white">
      {/* Top Classroom Navigation Bar */}
      <header className="h-16 bg-[#132019] border-b border-white/10 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-[#c8ead5] hover:text-white bg-white/10 px-3 py-1.5 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> แดชบอร์ด
          </Link>
          <span className="text-white/30">|</span>
          <h1 className="text-sm font-bold text-white truncate max-w-xs sm:max-w-md m-0">
            {course.title}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block bg-bio-green-soft text-bio-green text-xs font-extrabold px-3 py-1 rounded-full">
            {course.gradeLevel}
          </span>
          <Link
            href="/courses"
            className="text-xs text-[#c8ead5] hover:underline hidden sm:inline"
          >
            ดูคอร์สอื่น
          </Link>
        </div>
      </header>

      {/* Main Video & Sidebar Grid */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-[1fr_380px]">
        {/* Left Side: Video Player & Tabs */}
        <div className="p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-64px)]">
          {/* Main Video Player */}
          <div className="bg-black rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative">
            {currentAsset?.videoUrl ? (
              <video
                key={currentLesson?.id}
                className="aspect-video w-full bg-black"
                controls
                controlsList="nodownload"
                playsInline
                preload="metadata"
                src={currentAsset.videoUrl}
              >
                เบราว์เซอร์นี้ไม่รองรับการเล่นวิดีโอ
              </video>
            ) : (
              <div className="aspect-video bg-gradient-to-br from-[#0c4a2a] via-[#0b6b3a] to-[#125c3e] relative flex flex-col items-center justify-center p-6 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-white/10 text-white">
                  <Play className="h-9 w-9 fill-current" />
                </div>
                <p className="mt-4 text-sm font-bold text-white">
                  บทเรียนนี้ยังไม่มีวิดีโอ
                </p>
                <p className="mt-1 text-xs text-white/55">
                  ทีมผู้สอนกำลังเตรียมเนื้อหา
                </p>
              </div>
            )}
          </div>

          {/* Lesson Action Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#132019] border border-white/10 rounded-2xl p-4 sm:p-5">
            <div>
              <span className="text-xs text-bio-green font-extrabold uppercase tracking-wider block">
                บทเรียนปัจจุบัน
              </span>
              <h2 className="text-base sm:text-lg font-extrabold text-white m-0 mt-0.5">
                {currentLesson?.title}
              </h2>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={handlePrevLesson}
                className="flex-1 sm:flex-none px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" /> ก่อนหน้า
              </button>
              <button
                onClick={handleNextLesson}
                disabled={isSavingProgress}
                className="flex-1 sm:flex-none px-5 py-2.5 bg-bio-green hover:bg-bio-green-hover disabled:opacity-60 text-white rounded-xl text-xs font-bold shadow-bio-btn transition-all flex items-center justify-center gap-1 cursor-pointer"
              >
                {isSavingProgress ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    เรียนจบและไปบทถัดไป <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Content Tabs Navigation */}
          <div className="border-b border-white/10 bg-[#132019] rounded-2xl p-1.5 flex items-center gap-1">
            <button
              onClick={() => setActiveTab("overview")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "overview" ? "bg-bio-green text-white" : "text-white/60 hover:text-white"
              }`}
            >
              เอกสาร & สรุปบทเรียน
            </button>
            <button
              onClick={() => setActiveTab("qa")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "qa" ? "bg-bio-green text-white" : "text-white/60 hover:text-white"
              }`}
            >
              ถาม-ตอบ ติวเตอร์ ({lessonQuestions.length})
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "notes" ? "bg-bio-green text-white" : "text-white/60 hover:text-white"
              }`}
            >
              สมุดบันทึก
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all ${
                activeTab === "quiz" ? "bg-bio-green text-white" : "text-white/60 hover:text-white"
              }`}
            >
              แบบทดสอบย่อย
            </button>
          </div>

          {/* Tab 1: Overview & Material Download */}
          {activeTab === "overview" && (
            <div className="bg-[#132019] border border-white/10 rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white m-0">เอกสารประกอบการเรียน PDF</h3>
                  <p className="text-xs text-white/60 m-0 mt-0.5">
                    พิมพ์สีภาพสวยงาม สรุปเนื้อหาสำคัญสำหรับ {course.title}
                  </p>
                </div>
                {currentAsset?.documentUrl ? (
                  <a
                    href={currentAsset.documentUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-bio-green hover:bg-bio-green-hover text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <FileText className="w-4 h-4" /> เปิด PDF
                  </a>
                ) : (
                  <span className="bg-white/5 text-white/45 text-xs font-bold px-4 py-2 rounded-xl shrink-0 flex items-center gap-1.5">
                    <FileText className="w-4 h-4" /> ยังไม่มี PDF
                  </span>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-bio-green uppercase tracking-wider">
                  คำแนะนำในการเรียนบทนี้
                </h4>
                <p className="text-xs text-white/80 leading-relaxed m-0">
                  {course.description} แนะนำให้จดบันทึกในแท็บสมุดบันทึกด้านข้างระหว่างฟังติวเตอร์อธิบาย
                  เพื่อช่วยสร้างความเข้าใจและจดจำภาพรวมได้อย่างยั่งยืน
                </p>
              </div>
            </div>
          )}

          {/* Tab 2: Q&A Thread */}
          {activeTab === "qa" && (
            <div className="bg-[#132019] border border-white/10 rounded-2xl p-6 space-y-6 animate-in fade-in duration-200">
              <form onSubmit={handleAddQa} className="space-y-3">
                <h3 className="text-sm font-bold text-white m-0 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-bio-green" /> ถามข้อสงสัยเกี่ยวกับบทเรียนนี้
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="พิมพ์คำถามของคุณถึงทีมติวเตอร์..."
                    value={qaInput}
                    onChange={(e) => setQaInput(e.target.value)}
                    className="flex-grow bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-bio-green"
                  />
                  <button
                    type="submit"
                    disabled={isSendingQuestion || qaInput.trim().length < 5}
                    className="bg-bio-green hover:bg-bio-green-hover disabled:opacity-50 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0"
                  >
                    {isSendingQuestion ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    ส่งคำถาม
                  </button>
                </div>
              </form>

              <div className="space-y-4 pt-4 border-t border-white/10">
                {lessonQuestions.map((qa) => (
                  <div key={qa.id} className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-2 text-xs">
                    <div className="flex items-center justify-between text-white/60">
                      <strong className="text-bio-green font-bold">คำถามของคุณ</strong>
                      <span className="text-[11px]">{formatQuestionTime(qa.createdAt)}</span>
                    </div>
                    <p className="text-white font-medium m-0">{qa.text}</p>
                    {qa.answer && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-emerald-300 font-medium">
                        {qa.answer}
                      </div>
                    )}
                    {!qa.answer && (
                      <div className="mt-2 pt-2 border-t border-white/10 text-amber-300/80 font-medium">
                        รอทีมติวเตอร์ตอบ
                      </div>
                    )}
                  </div>
                ))}
                {lessonQuestions.length === 0 && (
                  <p className="text-xs text-white/50 text-center py-4 m-0">
                    ยังไม่มีคำถามสำหรับบทเรียนนี้
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Tab 3: Personal Student Notes */}
          {activeTab === "notes" && (
            <div className="bg-[#132019] border border-white/10 rounded-2xl p-6 space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white m-0">สมุดบันทึกส่วนตัว (Personal Notes)</h3>
                <span className="text-[11px] text-white/50">
                  {noteStatus || "เก็บแยกตามบทเรียน"}
                </span>
              </div>
              <textarea
                rows={6}
                placeholder="พิมพ์โน้ตสรุปของคุณที่นี่ขณะกำลังดูคลิปเรียน..."
                value={studentNote}
                onChange={(e) => setStudentNote(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xs text-white placeholder:text-white/40 focus:outline-none focus:border-bio-green resize-none leading-relaxed"
              ></textarea>
              <button
                onClick={handleSaveNote}
                disabled={isSavingNote}
                className="bg-bio-green disabled:opacity-60 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-bio-green-hover transition-colors inline-flex items-center gap-1.5"
              >
                {isSavingNote && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                บันทึกโน้ต
              </button>
            </div>
          )}

          {/* Tab 4: Practice Quiz */}
          {activeTab === "quiz" && (
            <div className="bg-[#132019] border border-white/10 rounded-2xl p-6 space-y-5 animate-in fade-in duration-200">
              <h3 className="text-sm font-bold text-white m-0">แบบทดสอบทบทวนบทเรียน (Practice Quiz)</h3>

              <div className="p-4 bg-white/5 border border-white/10 rounded-xl space-y-3">
                <p className="text-xs sm:text-sm font-bold text-white m-0">
                  คำถาม: โครงสร้างใดของเซลล์ทำหน้าที่เกี่ยวกับการสังเคราะห์โปรตีนและไม่มีเยื่อหุ้ม?
                </p>

                <div className="space-y-2">
                  {[
                    "1. ไมโทคอนเดรีย (Mitochondria)",
                    "2. ไรโบโซม (Ribosome)",
                    "3. กอลจิคอมเพล็กซ์ (Golgi Complex)",
                    "4. ไลโซโซม (Lysosome)",
                  ].map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedQuizAnswer(idx);
                        setQuizChecked(false);
                      }}
                      className={`w-full text-left p-3 rounded-xl text-xs font-medium border transition-all ${
                        selectedQuizAnswer === idx
                          ? "bg-bio-green text-white border-bio-green"
                          : "bg-white/5 text-white/80 border-white/10 hover:border-white/30"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {selectedQuizAnswer !== null && (
                  <button
                    onClick={() => setQuizChecked(true)}
                    className="w-full bg-bio-green text-white text-xs font-bold py-2.5 rounded-xl hover:bg-bio-green-hover transition-colors mt-2"
                  >
                    ตรวจคำตอบ
                  </button>
                )}

                {quizChecked && (
                  <div
                    className={`p-3 rounded-xl text-xs font-bold mt-2 ${
                      selectedQuizAnswer === 1
                        ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                        : "bg-rose-950/80 text-rose-300 border border-rose-500/40"
                    }`}
                  >
                    {selectedQuizAnswer === 1
                      ? "✨ ถูกต้องครับ! ไรโบโซม (Ribosome) ทำหน้าที่สังเคราะห์โปรตีนและไม่มีเยื่อหุ้มเซลล์"
                      : "❌ ยังไม่ถูกต้องครับ คำตอบที่ถูกต้องคือ ข้อ 2. ไรโบโซม (Ribosome)"}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Curriculum Navigation Sidebar */}
        <div className="bg-[#132019] border-l border-white/10 p-4 overflow-y-auto max-h-[calc(100vh-64px)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-extrabold text-white m-0">สารบัญบทเรียน (Syllabus)</h3>
              <p className="text-[11px] text-white/60 m-0 mt-0.5">
                {course.lessonsCount} บทเรียน ({course.totalHours})
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {course.syllabus.map((chapter, chapIdx) => (
              <div
                key={chapter.id}
                className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
              >
                <div className="p-3 bg-white/5 font-bold text-xs text-white flex items-center justify-between border-b border-white/10">
                  <span className="truncate pr-2">
                    {chapIdx + 1}. {chapter.title}
                  </span>
                  <span className="text-[10px] text-bio-green shrink-0 font-semibold">
                    {chapter.duration}
                  </span>
                </div>

                <div className="divide-y divide-white/5">
                  {chapter.lessons.map((lesson, lessIdx) => {
                    const isActive = activeChapterIndex === chapIdx && activeLessonIndex === lessIdx;

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          selectLesson(chapIdx, lessIdx);
                        }}
                        className={`w-full text-left p-3 text-xs flex items-center justify-between transition-colors ${
                          isActive
                            ? "bg-bio-green text-white font-bold"
                            : "hover:bg-white/10 text-white/80"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate pr-2">
                          {progressByLesson[lesson.id]?.isCompleted ? (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
                          ) : isActive ? (
                            <Play className="w-3.5 h-3.5 fill-current shrink-0 text-white" />
                          ) : (
                            <Clock className="w-3.5 h-3.5 text-white/35 shrink-0" />
                          )}
                          <span className="truncate">
                            {chapIdx + 1}.{lessIdx + 1} {lesson.title}
                          </span>
                        </div>
                        <span className="text-[10px] opacity-70 shrink-0">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
