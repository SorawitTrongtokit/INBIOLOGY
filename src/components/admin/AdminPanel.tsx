"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Archive,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  FileText,
  GraduationCap,
  Inbox,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  Pencil,
  PlayCircle,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  Star,
  Trash2,
  Upload,
  UserPlus,
  Users,
  Video,
  X,
} from "lucide-react";
import {
  AdminAccessError,
  type AdminArticle,
  type AdminChapter,
  type AdminCourse,
  type AdminData,
  type AdminInstructor,
  type AdminLesson,
  type CourseInput,
  answerQuestion,
  createAssetUrl,
  deleteChapter,
  deleteLesson,
  deleteLessonAsset,
  getAdminData,
  moderateReview,
  saveArticle,
  saveChapter,
  saveCourse,
  saveEnrollment,
  saveInstructor,
  saveLesson,
  uploadLessonAsset,
} from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/client";

type Tab =
  | "overview"
  | "courses"
  | "curriculum"
  | "students"
  | "inbox"
  | "articles";

const tabs: Array<{
  id: Tab;
  label: string;
  shortLabel: string;
  icon: typeof LayoutDashboard;
}> = [
  { id: "overview", label: "ภาพรวม", shortLabel: "ภาพรวม", icon: LayoutDashboard },
  { id: "courses", label: "คอร์สและติวเตอร์", shortLabel: "คอร์ส", icon: BookOpen },
  { id: "curriculum", label: "บทเรียนและไฟล์", shortLabel: "บทเรียน", icon: PlayCircle },
  { id: "students", label: "นักเรียนและสิทธิ์", shortLabel: "นักเรียน", icon: Users },
  { id: "inbox", label: "คำถามและรีวิว", shortLabel: "กล่องงาน", icon: Inbox },
  { id: "articles", label: "บทความ", shortLabel: "บทความ", icon: FileText },
];

const emptyCourse: CourseInput = {
  code: "",
  instructor_id: null,
  slug: "",
  title: "",
  subtitle: "",
  description: "",
  category: "basic",
  grade_level: "ม.4",
  price: 0,
  original_price: null,
  tag: "",
  cover_class: "bio-course-1",
  art_type: "cell",
  highlights: [],
  duration_minutes: 0,
  is_extra: false,
  is_popular: false,
  status: "draft",
};

const emptyInstructor: Omit<AdminInstructor, "id"> = {
  name: "",
  title: "",
  avatar_url: null,
  bio: "",
  experience: "",
  is_active: true,
};

const emptyArticle: Omit<AdminArticle, "id" | "created_at" | "updated_at"> = {
  slug: "",
  category: "ชีววิทยา",
  title: "",
  excerpt: "",
  content: "",
  cover_image_url: null,
  icon: "book",
  status: "draft",
  published_at: null,
};

const inputClass =
  "w-full rounded-xl border border-[#dce8df] bg-white px-3.5 py-2.5 text-sm text-bio-ink outline-none transition focus:border-bio-green focus:ring-2 focus:ring-bio-green/10";
const labelClass = "mb-1.5 block text-xs font-bold text-[#53635a]";
const cardClass =
  "rounded-2xl border border-[#e0e9e3] bg-white shadow-[0_10px_30px_rgba(15,76,42,0.05)]";

function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return "เกิดข้อผิดพลาด กรุณาลองใหม่";
}

function formatDate(value?: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("th-TH", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatMoney(value: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatusPill({ value }: { value: string }) {
  const styles =
    value === "published" || value === "active" || value === "answered"
      ? "bg-emerald-50 text-emerald-700"
      : value === "pending" || value === "draft"
        ? "bg-amber-50 text-amber-700"
        : value === "rejected" || value === "cancelled" || value === "refunded"
          ? "bg-rose-50 text-rose-700"
          : "bg-slate-100 text-slate-600";
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${styles}`}>
      {value}
    </span>
  );
}

export function AdminPanel() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("overview");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getAdminData());
    } catch (loadError) {
      setError(errorMessage(loadError));
      if (loadError instanceof AdminAccessError) {
        window.setTimeout(() => router.replace("/"), 1800);
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const run = async (
    key: string,
    successMessage: string,
    action: () => Promise<void>,
  ) => {
    setBusy(key);
    setError("");
    setNotice("");
    try {
      await action();
      setNotice(successMessage);
      await load();
    } catch (actionError) {
      setError(errorMessage(actionError));
    } finally {
      setBusy("");
    }
  };

  const signOut = async () => {
    await createClient().auth.signOut({ scope: "local" });
    router.replace("/");
  };

  if (loading && !data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f8f6]">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-bio-green" />
          <p className="mt-3 text-sm font-bold text-[#607067]">
            กำลังเปิดศูนย์จัดการ…
          </p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f5f8f6] px-5">
        <div className={`${cardClass} max-w-md p-8 text-center`}>
          <ShieldCheck className="mx-auto h-12 w-12 text-rose-500" />
          <h1 className="mt-4 text-xl font-extrabold text-bio-ink">
            ไม่สามารถเปิดหน้า Admin
          </h1>
          <p className="mt-2 text-sm text-[#68766e]">{error}</p>
          <Link
            href="/"
            className="mt-5 inline-flex rounded-xl bg-bio-green px-5 py-2.5 text-sm font-bold text-white"
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </main>
    );
  }

  const pendingCount =
    data.questions.filter((item) => item.status === "pending").length +
    data.reviews.filter((item) => item.status === "pending").length;

  return (
    <div className="min-h-screen bg-[#f4f7f5] text-bio-ink">
      <header className="sticky top-0 z-40 border-b border-[#dfe9e2] bg-white/95 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1500px] items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setMobileNavOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-xl border border-[#dfe9e2] lg:hidden"
            aria-label="เปิดเมนู Admin"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="text-2xl font-extrabold text-bio-green">
            inbio
          </Link>
          <span className="rounded-lg bg-bio-green-soft px-2.5 py-1 text-xs font-extrabold text-bio-green">
            ADMIN
          </span>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => void load()}
              disabled={loading}
              className="grid h-10 w-10 place-items-center rounded-xl border border-[#dfe9e2] text-[#526158] hover:bg-[#f5f8f6]"
              aria-label="โหลดข้อมูลใหม่"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/dashboard"
              className="hidden rounded-xl border border-[#dfe9e2] px-3.5 py-2 text-xs font-bold hover:bg-[#f5f8f6] sm:block"
            >
              มุมมองนักเรียน
            </Link>
            <button
              onClick={() => void signOut()}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#15251b] px-3.5 text-xs font-bold text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">ออกจากระบบ</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-[1500px] grid-cols-1 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="sticky top-16 hidden h-[calc(100vh-64px)] border-r border-[#dfe9e2] bg-white p-4 lg:block">
          <nav className="space-y-1.5" aria-label="เมนูผู้ดูแลระบบ">
            {tabs.map((item) => (
              <AdminNavButton
                key={item.id}
                item={item}
                active={tab === item.id}
                badge={item.id === "inbox" ? pendingCount : 0}
                onClick={() => setTab(item.id)}
              />
            ))}
          </nav>
          <div className="absolute bottom-5 left-4 right-4 rounded-2xl bg-[#10271a] p-4 text-white">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <p className="mt-2 text-xs font-bold">พื้นที่สำหรับผู้ดูแลเท่านั้น</p>
            <p className="mt-1 text-[11px] leading-relaxed text-white/55">
              ทุกคำสั่งตรวจสิทธิ์ซ้ำที่ Supabase RLS
            </p>
          </div>
        </aside>

        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileNavOpen(false)}
              aria-label="ปิดเมนู"
            />
            <aside className="relative h-full w-[290px] bg-white p-4 shadow-2xl">
              <div className="mb-5 flex items-center justify-between">
                <strong className="text-bio-green">Admin Center</strong>
                <button
                  onClick={() => setMobileNavOpen(false)}
                  className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f6f4]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="space-y-1.5">
                {tabs.map((item) => (
                  <AdminNavButton
                    key={item.id}
                    item={item}
                    active={tab === item.id}
                    badge={item.id === "inbox" ? pendingCount : 0}
                    onClick={() => {
                      setTab(item.id);
                      setMobileNavOpen(false);
                    }}
                  />
                ))}
              </nav>
            </aside>
          </div>
        )}

        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-bio-green">
                INBIO MANAGEMENT
              </p>
              <h1 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                {tabs.find((item) => item.id === tab)?.label}
              </h1>
            </div>
            <p className="text-xs text-[#718078]">
              อัปเดตล่าสุด {new Date().toLocaleTimeString("th-TH")}
            </p>
          </div>

          {(error || notice) && (
            <div
              className={`mb-5 flex items-start justify-between rounded-xl border px-4 py-3 text-sm font-semibold ${
                error
                  ? "border-rose-200 bg-rose-50 text-rose-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              <span>{error || notice}</span>
              <button onClick={() => (error ? setError("") : setNotice(""))}>
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {tab === "overview" && <Overview data={data} setTab={setTab} />}
          {tab === "courses" && (
            <CoursesManager data={data} busy={busy} run={run} />
          )}
          {tab === "curriculum" && (
            <CurriculumManager data={data} busy={busy} run={run} />
          )}
          {tab === "students" && (
            <StudentsManager data={data} busy={busy} run={run} />
          )}
          {tab === "inbox" && (
            <InboxManager data={data} busy={busy} run={run} />
          )}
          {tab === "articles" && (
            <ArticlesManager data={data} busy={busy} run={run} />
          )}
        </main>
      </div>
    </div>
  );
}

function AdminNavButton({
  item,
  active,
  badge,
  onClick,
}: {
  item: (typeof tabs)[number];
  active: boolean;
  badge: number;
  onClick: () => void;
}) {
  const Icon = item.icon;
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition ${
        active
          ? "bg-bio-green text-white shadow-bio-btn"
          : "text-[#526158] hover:bg-[#f1f6f3] hover:text-bio-green"
      }`}
    >
      <Icon className="h-4 w-4" />
      <span>{item.label}</span>
      {badge > 0 && (
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] ${
            active ? "bg-white/20" : "bg-rose-100 text-rose-700"
          }`}
        >
          {badge}
        </span>
      )}
    </button>
  );
}

function Overview({ data, setTab }: { data: AdminData; setTab: (tab: Tab) => void }) {
  const revenue = data.enrollments
    .filter((item) => !["cancelled", "refunded"].includes(item.status))
    .reduce((sum, item) => sum + Number(item.amount_paid), 0);
  const cards = [
    {
      label: "นักเรียนทั้งหมด",
      value: data.profiles.length.toLocaleString("th-TH"),
      detail: `${data.enrollments.filter((item) => item.status === "active").length} สิทธิ์กำลังใช้งาน`,
      icon: Users,
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "คอร์สเผยแพร่",
      value: data.courses
        .filter((item) => item.status === "published")
        .length.toLocaleString("th-TH"),
      detail: `${data.courses.length} คอร์สทั้งหมด`,
      icon: BookOpen,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "ยอดลงทะเบียน",
      value: data.enrollments.length.toLocaleString("th-TH"),
      detail: `${data.lessons.length} บทเรียน`,
      icon: GraduationCap,
      color: "bg-violet-50 text-violet-700",
    },
    {
      label: "รายรับที่บันทึก",
      value: formatMoney(revenue),
      detail: "ไม่รวมรายการยกเลิก/คืนเงิน",
      icon: CircleDollarSign,
      color: "bg-amber-50 text-amber-700",
    },
  ];
  const pendingQuestions = data.questions.filter(
    (item) => item.status === "pending",
  );
  const pendingReviews = data.reviews.filter(
    (item) => item.status === "pending",
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <article key={card.label} className={`${cardClass} p-5`}>
              <div className={`grid h-10 w-10 place-items-center rounded-xl ${card.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-4 text-xs font-bold text-[#728078]">{card.label}</p>
              <p className="mt-1 text-2xl font-extrabold">{card.value}</p>
              <p className="mt-1 text-[11px] text-[#8a9690]">{card.detail}</p>
            </article>
          );
        })}
      </section>

      <section className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <div className={`${cardClass} overflow-hidden`}>
          <div className="flex items-center justify-between border-b border-[#edf2ee] p-5">
            <div>
              <h2 className="font-extrabold">คอร์สล่าสุด</h2>
              <p className="text-xs text-[#7b8880]">สถานะเนื้อหาและจำนวนผู้เรียน</p>
            </div>
            <button
              onClick={() => setTab("courses")}
              className="inline-flex items-center gap-1 text-xs font-bold text-bio-green"
            >
              จัดการทั้งหมด <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="divide-y divide-[#edf2ee]">
            {data.courses.slice(0, 6).map((course) => (
              <div key={course.id} className="flex items-center gap-3 p-4 sm:px-5">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-bio-green-soft font-extrabold text-bio-green">
                  {course.code.toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{course.title}</p>
                  <p className="text-[11px] text-[#839087]">
                    {course.students_count} ผู้เรียน · {formatMoney(course.price)}
                  </p>
                </div>
                <StatusPill value={course.status} />
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardClass} p-5`}>
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold">งานที่ต้องทำ</h2>
            <BarChart3 className="h-5 w-5 text-bio-green" />
          </div>
          <div className="mt-5 space-y-3">
            <button
              onClick={() => setTab("inbox")}
              className="flex w-full items-center gap-3 rounded-xl bg-amber-50 p-4 text-left"
            >
              <MessageSquare className="h-5 w-5 text-amber-600" />
              <span className="flex-1 text-sm font-bold">คำถามรอคำตอบ</span>
              <strong className="text-amber-700">{pendingQuestions.length}</strong>
            </button>
            <button
              onClick={() => setTab("inbox")}
              className="flex w-full items-center gap-3 rounded-xl bg-violet-50 p-4 text-left"
            >
              <Star className="h-5 w-5 text-violet-600" />
              <span className="flex-1 text-sm font-bold">รีวิวรอตรวจ</span>
              <strong className="text-violet-700">{pendingReviews.length}</strong>
            </button>
            <button
              onClick={() => setTab("curriculum")}
              className="flex w-full items-center gap-3 rounded-xl bg-blue-50 p-4 text-left"
            >
              <Upload className="h-5 w-5 text-blue-600" />
              <span className="flex-1 text-sm font-bold">บทเรียนยังไม่มีวิดีโอ</span>
              <strong className="text-blue-700">
                {
                  data.lessons.filter(
                    (lesson) =>
                      !data.assets.find(
                        (asset) =>
                          asset.lesson_id === lesson.id &&
                          asset.video_storage_path,
                      ),
                  ).length
                }
              </strong>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function CoursesManager({
  data,
  busy,
  run,
}: ManagerProps) {
  const [editingId, setEditingId] = useState<number | undefined>();
  const [form, setForm] = useState<CourseInput>(emptyCourse);
  const [instructorId, setInstructorId] = useState<number | undefined>();
  const [instructorForm, setInstructorForm] =
    useState<Omit<AdminInstructor, "id">>(emptyInstructor);
  const [search, setSearch] = useState("");
  const filtered = data.courses.filter((course) =>
    `${course.title} ${course.code}`.toLowerCase().includes(search.toLowerCase()),
  );

  const editCourse = (course: AdminCourse) => {
    setEditingId(course.id);
    setForm({
      code: course.code,
      instructor_id: course.instructor_id,
      slug: course.slug,
      title: course.title,
      subtitle: course.subtitle ?? "",
      description: course.description,
      category: course.category,
      grade_level: course.grade_level,
      price: Number(course.price),
      original_price: course.original_price
        ? Number(course.original_price)
        : null,
      tag: course.tag ?? "",
      cover_class: course.cover_class,
      art_type: course.art_type,
      highlights: course.highlights ?? [],
      duration_minutes: course.duration_minutes,
      is_extra: course.is_extra,
      is_popular: course.is_popular,
      status: course.status,
    });
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void run("course", "บันทึกคอร์สเรียบร้อย", async () => {
      await saveCourse(form, editingId);
      setEditingId(undefined);
      setForm(emptyCourse);
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(380px,0.85fr)]">
      <section className={`${cardClass} min-w-0 overflow-hidden`}>
        <div className="flex flex-wrap items-center gap-3 border-b border-[#edf2ee] p-5">
          <div>
            <h2 className="font-extrabold">รายการคอร์ส</h2>
            <p className="text-xs text-[#7a8880]">{data.courses.length} คอร์ส</p>
          </div>
          <div className="relative ml-auto min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#98a39c]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ค้นหาคอร์ส…"
              className={`${inputClass} pl-9`}
            />
          </div>
          <button
            onClick={() => {
              setEditingId(undefined);
              setForm(emptyCourse);
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-bio-green px-4 py-2.5 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" /> เพิ่มคอร์ส
          </button>
        </div>
        <div className="divide-y divide-[#edf2ee]">
          {filtered.map((course) => (
            <button
              key={course.id}
              onClick={() => editCourse(course)}
              className={`flex w-full items-center gap-3 p-4 text-left transition hover:bg-[#f8faf8] sm:px-5 ${
                editingId === course.id ? "bg-emerald-50/60" : ""
              }`}
            >
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#eff6f1] text-xs font-extrabold text-bio-green">
                {course.code.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold">{course.title}</p>
                <p className="mt-0.5 text-[11px] text-[#7e8b83]">
                  {course.grade_level} · {formatMoney(course.price)} ·{" "}
                  {course.students_count} ผู้เรียน
                </p>
              </div>
              <StatusPill value={course.status} />
              <Pencil className="h-4 w-4 text-[#9ba69f]" />
            </button>
          ))}
        </div>

        <details className="border-t border-[#edf2ee] p-5">
          <summary className="cursor-pointer text-sm font-extrabold text-bio-green">
            จัดการข้อมูลติวเตอร์ ({data.instructors.length})
          </summary>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="space-y-2">
              {data.instructors.map((instructor) => (
                <button
                  key={instructor.id}
                  onClick={() => {
                    setInstructorId(instructor.id);
                    setInstructorForm({
                      name: instructor.name,
                      title: instructor.title,
                      avatar_url: instructor.avatar_url,
                      bio: instructor.bio,
                      experience: instructor.experience,
                      is_active: instructor.is_active,
                    });
                  }}
                  className="flex w-full items-center justify-between rounded-xl border border-[#e2ebe5] p-3 text-left"
                >
                  <span>
                    <strong className="block text-sm">{instructor.name}</strong>
                    <small className="text-[#7d8a82]">{instructor.title}</small>
                  </span>
                  <StatusPill value={instructor.is_active ? "active" : "inactive"} />
                </button>
              ))}
            </div>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void run("instructor", "บันทึกติวเตอร์เรียบร้อย", async () => {
                  await saveInstructor(instructorForm, instructorId);
                  setInstructorId(undefined);
                  setInstructorForm(emptyInstructor);
                });
              }}
              className="space-y-3 rounded-xl bg-[#f7faf8] p-4"
            >
              <Field label="ชื่อ">
                <input
                  required
                  className={inputClass}
                  value={instructorForm.name}
                  onChange={(event) =>
                    setInstructorForm({ ...instructorForm, name: event.target.value })
                  }
                />
              </Field>
              <Field label="ตำแหน่ง / คำโปรย">
                <input
                  required
                  className={inputClass}
                  value={instructorForm.title}
                  onChange={(event) =>
                    setInstructorForm({ ...instructorForm, title: event.target.value })
                  }
                />
              </Field>
              <Field label="ประสบการณ์">
                <input
                  className={inputClass}
                  value={instructorForm.experience}
                  onChange={(event) =>
                    setInstructorForm({
                      ...instructorForm,
                      experience: event.target.value,
                    })
                  }
                />
              </Field>
              <Field label="ประวัติย่อ">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={instructorForm.bio}
                  onChange={(event) =>
                    setInstructorForm({ ...instructorForm, bio: event.target.value })
                  }
                />
              </Field>
              <button
                disabled={busy === "instructor"}
                className="inline-flex items-center gap-2 rounded-xl bg-[#15251b] px-4 py-2.5 text-xs font-bold text-white"
              >
                {busy === "instructor" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                บันทึกติวเตอร์
              </button>
            </form>
          </div>
        </details>
      </section>

      <form onSubmit={submit} className={`${cardClass} h-fit p-5 xl:sticky xl:top-24`}>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-extrabold">
              {editingId ? "แก้ไขคอร์ส" : "สร้างคอร์สใหม่"}
            </h2>
            <p className="text-xs text-[#7b8880]">
              เปลี่ยนสถานะเป็น published เมื่อพร้อมขาย
            </p>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(undefined);
                setForm(emptyCourse);
              }}
              className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f6f4]"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="รหัสคอร์ส">
            <input
              required
              className={inputClass}
              value={form.code}
              placeholder="เช่น c7"
              onChange={(event) => setForm({ ...form, code: event.target.value })}
            />
          </Field>
          <Field label="Slug">
            <input
              required
              className={inputClass}
              value={form.slug}
              placeholder="biology-m4"
              onChange={(event) => setForm({ ...form, slug: event.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="ชื่อคอร์ส">
              <input
                required
                className={inputClass}
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="คำโปรย">
              <input
                className={inputClass}
                value={form.subtitle ?? ""}
                onChange={(event) =>
                  setForm({ ...form, subtitle: event.target.value })
                }
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="รายละเอียด">
              <textarea
                required
                rows={4}
                className={inputClass}
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </Field>
          </div>
          <Field label="ติวเตอร์">
            <select
              className={inputClass}
              value={form.instructor_id ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  instructor_id: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
            >
              <option value="">ไม่ระบุ</option>
              {data.instructors.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="ระดับชั้น">
            <input
              required
              className={inputClass}
              value={form.grade_level}
              onChange={(event) =>
                setForm({ ...form, grade_level: event.target.value })
              }
            />
          </Field>
          <Field label="หมวด">
            <select
              className={inputClass}
              value={form.category}
              onChange={(event) =>
                setForm({
                  ...form,
                  category: event.target.value as CourseInput["category"],
                })
              }
            >
              <option value="basic">พื้นฐาน</option>
              <option value="exam">เตรียมสอบ</option>
              <option value="deep">เจาะลึก</option>
            </select>
          </Field>
          <Field label="สถานะ">
            <select
              className={inputClass}
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status: event.target.value as CourseInput["status"],
                })
              }
            >
              <option value="draft">ฉบับร่าง</option>
              <option value="published">เผยแพร่</option>
              <option value="archived">เก็บถาวร</option>
            </select>
          </Field>
          <Field label="ราคา">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.price}
              onChange={(event) =>
                setForm({ ...form, price: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="ราคาเต็ม">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.original_price ?? ""}
              onChange={(event) =>
                setForm({
                  ...form,
                  original_price: event.target.value
                    ? Number(event.target.value)
                    : null,
                })
              }
            />
          </Field>
          <Field label="ระยะเวลา (นาที)">
            <input
              type="number"
              min="0"
              className={inputClass}
              value={form.duration_minutes}
              onChange={(event) =>
                setForm({ ...form, duration_minutes: Number(event.target.value) })
              }
            />
          </Field>
          <Field label="ป้ายกำกับ">
            <input
              className={inputClass}
              value={form.tag ?? ""}
              onChange={(event) => setForm({ ...form, tag: event.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="จุดเด่น (แยกบรรทัด)">
              <textarea
                rows={3}
                className={inputClass}
                value={form.highlights.join("\n")}
                onChange={(event) =>
                  setForm({
                    ...form,
                    highlights: event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </div>
          <label className="flex items-center gap-2 text-xs font-bold">
            <input
              type="checkbox"
              checked={form.is_popular}
              onChange={(event) =>
                setForm({ ...form, is_popular: event.target.checked })
              }
            />
            คอร์สยอดนิยม
          </label>
          <label className="flex items-center gap-2 text-xs font-bold">
            <input
              type="checkbox"
              checked={form.is_extra}
              onChange={(event) =>
                setForm({ ...form, is_extra: event.target.checked })
              }
            />
            คอร์สเสริม
          </label>
        </div>
        <button
          disabled={busy === "course"}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bio-green px-4 py-3 text-sm font-bold text-white shadow-bio-btn disabled:opacity-60"
        >
          {busy === "course" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          บันทึกคอร์ส
        </button>
      </form>
    </div>
  );
}

type ManagerProps = {
  data: AdminData;
  busy: string;
  run: (
    key: string,
    message: string,
    action: () => Promise<void>,
  ) => Promise<void>;
};

function CurriculumManager({ data, busy, run }: ManagerProps) {
  const [courseId, setCourseId] = useState(data.courses[0]?.id ?? 0);
  const chapters = data.chapters.filter((item) => item.course_id === courseId);
  const [chapterId, setChapterId] = useState(chapters[0]?.id ?? 0);
  const activeChapter =
    chapters.find((item) => item.id === chapterId) ?? chapters[0];
  const lessons = data.lessons.filter(
    (item) => item.chapter_id === activeChapter?.id,
  );
  const [chapterForm, setChapterForm] = useState<Omit<AdminChapter, "id">>({
    course_id: courseId,
    title: "",
    position: chapters.length + 1,
    duration_minutes: 0,
  });
  const [editingChapterId, setEditingChapterId] = useState<number>();
  const [lessonForm, setLessonForm] = useState<Omit<AdminLesson, "id">>({
    chapter_id: activeChapter?.id ?? 0,
    title: "",
    description: "",
    position: lessons.length + 1,
    duration_seconds: 0,
    is_free_preview: false,
    is_published: true,
  });
  const [editingLessonId, setEditingLessonId] = useState<number>();

  useEffect(() => {
    const firstChapter = data.chapters.find((item) => item.course_id === courseId);
    setChapterId(firstChapter?.id ?? 0);
    setEditingChapterId(undefined);
    setChapterForm({
      course_id: courseId,
      title: "",
      position:
        data.chapters.filter((item) => item.course_id === courseId).length + 1,
      duration_minutes: 0,
    });
  }, [courseId, data.chapters]);

  useEffect(() => {
    const chapter = data.chapters.find((item) => item.id === chapterId);
    const chapterLessons = data.lessons.filter(
      (item) => item.chapter_id === chapterId,
    );
    setEditingLessonId(undefined);
    setLessonForm({
      chapter_id: chapter?.id ?? 0,
      title: "",
      description: "",
      position: chapterLessons.length + 1,
      duration_seconds: 0,
      is_free_preview: false,
      is_published: true,
    });
  }, [chapterId, data.chapters, data.lessons]);

  const editChapter = (chapter: AdminChapter) => {
    setChapterId(chapter.id);
    setEditingChapterId(chapter.id);
    setChapterForm({
      course_id: chapter.course_id,
      title: chapter.title,
      position: chapter.position,
      duration_minutes: chapter.duration_minutes,
    });
  };

  const editLesson = (lesson: AdminLesson) => {
    setEditingLessonId(lesson.id);
    setLessonForm({
      chapter_id: lesson.chapter_id,
      title: lesson.title,
      description: lesson.description ?? "",
      position: lesson.position,
      duration_seconds: lesson.duration_seconds,
      is_free_preview: lesson.is_free_preview,
      is_published: lesson.is_published,
    });
  };

  return (
    <div className="space-y-5">
      <section className={`${cardClass} p-4 sm:p-5`}>
        <label className={labelClass}>เลือกคอร์สที่จะจัดหลักสูตร</label>
        <select
          className={`${inputClass} max-w-xl`}
          value={courseId}
          onChange={(event) => setCourseId(Number(event.target.value))}
        >
          {data.courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.code.toUpperCase()} — {course.title}
            </option>
          ))}
        </select>
      </section>

      <div className="grid gap-5 xl:grid-cols-[0.75fr_1fr_1.1fr]">
        <section className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-[#edf2ee] p-4">
            <h2 className="font-extrabold">บท / Chapter</h2>
            <p className="text-xs text-[#7d8982]">{chapters.length} บท</p>
          </div>
          <div className="divide-y divide-[#edf2ee]">
            {chapters.map((chapter) => (
              <button
                key={chapter.id}
                onClick={() => editChapter(chapter)}
                className={`flex w-full items-center gap-3 p-4 text-left ${
                  activeChapter?.id === chapter.id
                    ? "bg-emerald-50 text-bio-green"
                    : "hover:bg-[#f8faf8]"
                }`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-white text-xs font-extrabold shadow-sm">
                  {chapter.position}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold">
                  {chapter.title}
                </span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ))}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void run("chapter", "บันทึกบทเรียบร้อย", async () => {
                await saveChapter(chapterForm, editingChapterId);
                setEditingChapterId(undefined);
              });
            }}
            className="space-y-3 border-t border-[#edf2ee] bg-[#f8faf8] p-4"
          >
            <strong className="text-sm">
              {editingChapterId ? "แก้ไขบท" : "เพิ่มบทใหม่"}
            </strong>
            <input
              required
              className={inputClass}
              placeholder="ชื่อบท"
              value={chapterForm.title}
              onChange={(event) =>
                setChapterForm({ ...chapterForm, title: event.target.value })
              }
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                required
                type="number"
                min="1"
                className={inputClass}
                title="ลำดับ"
                value={chapterForm.position}
                onChange={(event) =>
                  setChapterForm({
                    ...chapterForm,
                    position: Number(event.target.value),
                  })
                }
              />
              <input
                type="number"
                min="0"
                className={inputClass}
                title="ระยะเวลานาที"
                value={chapterForm.duration_minutes}
                onChange={(event) =>
                  setChapterForm({
                    ...chapterForm,
                    duration_minutes: Number(event.target.value),
                  })
                }
              />
            </div>
            <div className="flex gap-2">
              <button
                disabled={busy === "chapter"}
                className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-bio-green px-3 py-2.5 text-xs font-bold text-white"
              >
                <Save className="h-3.5 w-3.5" /> บันทึก
              </button>
              {editingChapterId && (
                <button
                  type="button"
                  onClick={() => {
                    if (!window.confirm("ลบบทนี้และบทเรียนทั้งหมดภายในหรือไม่?"))
                      return;
                    void run("chapter-delete", "ลบบทเรียบร้อย", () =>
                      deleteChapter(editingChapterId),
                    );
                  }}
                  className="grid h-10 w-10 place-items-center rounded-xl bg-rose-50 text-rose-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>
        </section>

        <section className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-[#edf2ee] p-4">
            <h2 className="font-extrabold">บทเรียน</h2>
            <p className="truncate text-xs text-[#7d8982]">
              {activeChapter?.title || "เลือกบทก่อน"}
            </p>
          </div>
          <div className="divide-y divide-[#edf2ee]">
            {lessons.map((lesson) => {
              const asset = data.assets.find(
                (item) => item.lesson_id === lesson.id,
              );
              return (
                <button
                  key={lesson.id}
                  onClick={() => editLesson(lesson)}
                  className={`w-full p-4 text-left hover:bg-[#f8faf8] ${
                    editingLessonId === lesson.id ? "bg-emerald-50/70" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-bio-green">
                      {lesson.position}.
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm font-bold">
                      {lesson.title}
                    </span>
                    {!lesson.is_published && <Archive className="h-4 w-4 text-amber-500" />}
                  </div>
                  <div className="mt-2 flex gap-2 text-[10px]">
                    <span
                      className={`rounded px-2 py-0.5 ${
                        asset?.video_storage_path
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      วิดีโอ {asset?.video_storage_path ? "✓" : "—"}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 ${
                        asset?.document_storage_path
                          ? "bg-blue-50 text-blue-700"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      PDF {asset?.document_storage_path ? "✓" : "—"}
                    </span>
                  </div>
                </button>
              );
            })}
            {lessons.length === 0 && (
              <p className="p-6 text-center text-xs text-[#86928b]">
                ยังไม่มีบทเรียนในบทนี้
              </p>
            )}
          </div>
        </section>

        <section className={`${cardClass} h-fit p-5`}>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-extrabold">
                {editingLessonId ? "แก้ไขบทเรียน" : "เพิ่มบทเรียน"}
              </h2>
              <p className="text-xs text-[#7d8982]">
                เนื้อหา วิดีโอ และเอกสารประกอบ
              </p>
            </div>
            {editingLessonId && (
              <button
                onClick={() => setEditingLessonId(undefined)}
                className="grid h-9 w-9 place-items-center rounded-xl bg-[#f3f6f4]"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          {!activeChapter ? (
            <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-700">
              เพิ่มหรือเลือกบทก่อนสร้างบทเรียน
            </p>
          ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void run("lesson", "บันทึกบทเรียนเรียบร้อย", async () => {
                  await saveLesson(lessonForm, editingLessonId);
                  setEditingLessonId(undefined);
                });
              }}
              className="space-y-4"
            >
              <Field label="ชื่อบทเรียน">
                <input
                  required
                  className={inputClass}
                  value={lessonForm.title}
                  onChange={(event) =>
                    setLessonForm({ ...lessonForm, title: event.target.value })
                  }
                />
              </Field>
              <Field label="คำอธิบาย">
                <textarea
                  rows={3}
                  className={inputClass}
                  value={lessonForm.description ?? ""}
                  onChange={(event) =>
                    setLessonForm({
                      ...lessonForm,
                      description: event.target.value,
                    })
                  }
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="ลำดับ">
                  <input
                    type="number"
                    min="1"
                    className={inputClass}
                    value={lessonForm.position}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        position: Number(event.target.value),
                      })
                    }
                  />
                </Field>
                <Field label="วินาที">
                  <input
                    type="number"
                    min="0"
                    className={inputClass}
                    value={lessonForm.duration_seconds}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        duration_seconds: Number(event.target.value),
                      })
                    }
                  />
                </Field>
              </div>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={lessonForm.is_published}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        is_published: event.target.checked,
                      })
                    }
                  />
                  เปิดให้เรียน
                </label>
                <label className="flex items-center gap-2 text-xs font-bold">
                  <input
                    type="checkbox"
                    checked={lessonForm.is_free_preview}
                    onChange={(event) =>
                      setLessonForm({
                        ...lessonForm,
                        is_free_preview: event.target.checked,
                      })
                    }
                  />
                  ดูตัวอย่างฟรี
                </label>
              </div>
              <button
                disabled={busy === "lesson"}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bio-green px-4 py-3 text-xs font-bold text-white"
              >
                <Save className="h-4 w-4" /> บันทึกข้อมูลบทเรียน
              </button>
              {editingLessonId && (
                <>
                  <AssetUploader
                    data={data}
                    courseId={courseId}
                    lessonId={editingLessonId}
                    busy={busy}
                    run={run}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (!window.confirm("ลบบทเรียนนี้และข้อมูลที่เกี่ยวข้องหรือไม่?"))
                        return;
                      void run("lesson-delete", "ลบบทเรียนเรียบร้อย", () =>
                        deleteLesson(editingLessonId),
                      );
                    }}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700"
                  >
                    <Trash2 className="h-4 w-4" /> ลบบทเรียน
                  </button>
                </>
              )}
            </form>
          )}
        </section>
      </div>
    </div>
  );
}

function AssetUploader({
  data,
  courseId,
  lessonId,
  busy,
  run,
}: ManagerProps & { courseId: number; lessonId: number }) {
  const asset = data.assets.find((item) => item.lesson_id === lessonId);

  const upload = (
    kind: "video" | "document",
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    void run(`upload-${kind}`, "อัปโหลดไฟล์เรียบร้อย", () =>
      uploadLessonAsset(courseId, lessonId, kind, file),
    );
    event.target.value = "";
  };

  const row = (
    kind: "video" | "document",
    path: string | null | undefined,
  ) => {
    const isVideo = kind === "video";
    const Icon = isVideo ? Video : FileText;
    return (
      <div className="rounded-xl border border-[#e1eae4] p-3">
        <div className="flex items-center gap-2">
          <span
            className={`grid h-9 w-9 place-items-center rounded-lg ${
              isVideo ? "bg-violet-50 text-violet-700" : "bg-blue-50 text-blue-700"
            }`}
          >
            <Icon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <strong className="block text-xs">
              {isVideo ? "วิดีโอบทเรียน" : "เอกสาร PDF"}
            </strong>
            <p className="truncate text-[10px] text-[#829087]">
              {path || "ยังไม่มีไฟล์"}
            </p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <label className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#15251b] px-3 py-2 text-[11px] font-bold text-white">
            {busy === `upload-${kind}` ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {path ? "เปลี่ยนไฟล์" : "อัปโหลด"}
            <input
              type="file"
              className="sr-only"
              accept={isVideo ? "video/mp4,video/webm,video/quicktime" : "application/pdf"}
              onChange={(event) => upload(kind, event)}
            />
          </label>
          {path && (
            <>
              <button
                type="button"
                onClick={() =>
                  void (async () => {
                    try {
                      window.open(await createAssetUrl(kind, path), "_blank", "noopener");
                    } catch {
                      // The global panel reports write errors; preview failures are rare.
                    }
                  })()
                }
                className="rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-bold text-emerald-700"
              >
                เปิดดู
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!window.confirm("ลบไฟล์นี้หรือไม่?")) return;
                  void run(`delete-${kind}`, "ลบไฟล์เรียบร้อย", () =>
                    deleteLessonAsset(lessonId, kind, path),
                  );
                }}
                className="grid h-8 w-8 place-items-center rounded-lg bg-rose-50 text-rose-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-3 border-t border-[#edf2ee] pt-4">
      <div>
        <strong className="text-xs">ไฟล์ประกอบบทเรียน</strong>
        <p className="text-[10px] text-[#839087]">
          วิดีโอไม่เกิน 2 GB · PDF ไม่เกิน 50 MB · เก็บแบบ Private
        </p>
      </div>
      {row("video", asset?.video_storage_path)}
      {row("document", asset?.document_storage_path)}
    </div>
  );
}

function StudentsManager({ data, busy, run }: ManagerProps) {
  const [search, setSearch] = useState("");
  const [userId, setUserId] = useState(data.profiles[0]?.id ?? "");
  const [courseId, setCourseId] = useState(data.courses[0]?.id ?? 0);
  const [status, setStatus] = useState<
    "active" | "completed" | "cancelled" | "refunded"
  >("active");
  const [amount, setAmount] = useState(0);
  const [expiresAt, setExpiresAt] = useState("");
  const filteredProfiles = data.profiles.filter((profile) =>
    `${profile.full_name} ${profile.email ?? ""} ${profile.phone ?? ""}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const profileById = new Map(data.profiles.map((item) => [item.id, item]));
  const courseById = new Map(data.courses.map((item) => [item.id, item]));

  return (
    <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
      <section className={`${cardClass} min-w-0 overflow-hidden`}>
        <div className="flex flex-wrap items-center gap-3 border-b border-[#edf2ee] p-5">
          <div>
            <h2 className="font-extrabold">บัญชีนักเรียน</h2>
            <p className="text-xs text-[#7d8982]">{data.profiles.length} บัญชี</p>
          </div>
          <div className="relative ml-auto min-w-[220px] flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#95a098]" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="ชื่อ อีเมล หรือเบอร์โทร"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-xs">
            <thead className="bg-[#f7f9f8] text-[#718078]">
              <tr>
                <th className="px-5 py-3 font-bold">นักเรียน</th>
                <th className="px-4 py-3 font-bold">ระดับชั้น</th>
                <th className="px-4 py-3 font-bold">คอร์ส</th>
                <th className="px-4 py-3 font-bold">สมัครเมื่อ</th>
                <th className="px-4 py-3 font-bold">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edf2ee]">
              {filteredProfiles.map((profile) => {
                const enrollments = data.enrollments.filter(
                  (item) => item.user_id === profile.id,
                );
                return (
                  <tr key={profile.id}>
                    <td className="px-5 py-4">
                      <strong className="block text-sm">
                        {profile.full_name || "ยังไม่ระบุชื่อ"}
                      </strong>
                      <span className="text-[#7d8982]">{profile.email || "—"}</span>
                    </td>
                    <td className="px-4 py-4">{profile.grade_level || "—"}</td>
                    <td className="px-4 py-4">
                      <span className="font-bold">{enrollments.length}</span>
                      <span className="text-[#89958e]"> คอร์ส</span>
                    </td>
                    <td className="px-4 py-4 text-[#6e7d74]">
                      {formatDate(profile.created_at)}
                    </td>
                    <td className="px-4 py-4">
                      <button
                        onClick={() => setUserId(profile.id)}
                        className="rounded-lg bg-bio-green-soft px-3 py-2 font-bold text-bio-green"
                      >
                        ให้สิทธิ์
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="space-y-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            void run("enrollment", "อัปเดตสิทธิ์เข้าเรียนเรียบร้อย", () =>
              saveEnrollment({
                user_id: userId,
                course_id: courseId,
                status,
                amount_paid: amount,
                expires_at: expiresAt
                  ? new Date(`${expiresAt}T23:59:59`).toISOString()
                  : null,
              }),
            );
          }}
          className={`${cardClass} p-5`}
        >
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
              <UserPlus className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-extrabold">ให้สิทธิ์เข้าเรียน</h2>
              <p className="text-xs text-[#7d8982]">เพิ่มหรืออัปเดต Enrollment</p>
            </div>
          </div>
          <div className="mt-5 space-y-4">
            <Field label="นักเรียน">
              <select
                className={inputClass}
                value={userId}
                onChange={(event) => setUserId(event.target.value)}
              >
                {data.profiles.map((profile) => (
                  <option key={profile.id} value={profile.id}>
                    {profile.full_name || profile.email}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="คอร์ส">
              <select
                className={inputClass}
                value={courseId}
                onChange={(event) => setCourseId(Number(event.target.value))}
              >
                {data.courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.code.toUpperCase()} — {course.title}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="สถานะ">
                <select
                  className={inputClass}
                  value={status}
                  onChange={(event) =>
                    setStatus(
                      event.target.value as
                        | "active"
                        | "completed"
                        | "cancelled"
                        | "refunded",
                    )
                  }
                >
                  <option value="active">ใช้งาน</option>
                  <option value="completed">เรียนจบ</option>
                  <option value="cancelled">ยกเลิก</option>
                  <option value="refunded">คืนเงิน</option>
                </select>
              </Field>
              <Field label="ยอดชำระ">
                <input
                  type="number"
                  min="0"
                  className={inputClass}
                  value={amount}
                  onChange={(event) => setAmount(Number(event.target.value))}
                />
              </Field>
            </div>
            <Field label="วันหมดอายุ (เว้นว่าง = ไม่หมดอายุ)">
              <input
                type="date"
                className={inputClass}
                value={expiresAt}
                onChange={(event) => setExpiresAt(event.target.value)}
              />
            </Field>
            <button
              disabled={busy === "enrollment" || !userId || !courseId}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bio-green px-4 py-3 text-sm font-bold text-white"
            >
              {busy === "enrollment" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <CheckCircle2 className="h-4 w-4" />
              )}
              ยืนยันสิทธิ์
            </button>
          </div>
        </form>

        <section className={`${cardClass} overflow-hidden`}>
          <div className="border-b border-[#edf2ee] p-5">
            <h2 className="font-extrabold">สิทธิ์ล่าสุด</h2>
          </div>
          <div className="max-h-[430px] divide-y divide-[#edf2ee] overflow-y-auto">
            {data.enrollments.slice(0, 20).map((item) => (
              <div
                key={`${item.user_id}-${item.course_id}`}
                className="p-4 text-xs"
              >
                <div className="flex items-center justify-between gap-2">
                  <strong className="truncate">
                    {profileById.get(item.user_id)?.full_name ||
                      profileById.get(item.user_id)?.email ||
                      "ผู้ใช้"}
                  </strong>
                  <StatusPill value={item.status} />
                </div>
                <p className="mt-1 truncate text-[#78867d]">
                  {courseById.get(item.course_id)?.title || `Course #${item.course_id}`}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function InboxManager({ data, busy, run }: ManagerProps) {
  const [mode, setMode] = useState<"questions" | "reviews">("questions");
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const profileById = new Map(data.profiles.map((item) => [item.id, item]));
  const lessonById = new Map(data.lessons.map((item) => [item.id, item]));
  const courseById = new Map(data.courses.map((item) => [item.id, item]));

  return (
    <section className={`${cardClass} overflow-hidden`}>
      <div className="flex items-center gap-2 border-b border-[#edf2ee] p-4 sm:p-5">
        <button
          onClick={() => setMode("questions")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
            mode === "questions"
              ? "bg-bio-green text-white"
              : "bg-[#f2f5f3] text-[#607067]"
          }`}
        >
          คำถาม ({data.questions.filter((item) => item.status === "pending").length})
        </button>
        <button
          onClick={() => setMode("reviews")}
          className={`rounded-xl px-4 py-2.5 text-xs font-bold ${
            mode === "reviews"
              ? "bg-bio-green text-white"
              : "bg-[#f2f5f3] text-[#607067]"
          }`}
        >
          รีวิว ({data.reviews.filter((item) => item.status === "pending").length})
        </button>
      </div>

      {mode === "questions" ? (
        <div className="divide-y divide-[#edf2ee]">
          {data.questions.map((question) => (
            <article key={question.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill value={question.status} />
                <span className="text-xs font-bold text-[#53635a]">
                  {profileById.get(question.user_id)?.full_name ||
                    profileById.get(question.user_id)?.email ||
                    "นักเรียน"}
                </span>
                <span className="text-xs text-[#8b978f]">
                  · {lessonById.get(question.lesson_id)?.title || "บทเรียน"}
                </span>
                <span className="ml-auto text-[11px] text-[#8b978f]">
                  {formatDate(question.created_at)}
                </span>
              </div>
              <p className="mt-3 text-sm font-semibold leading-relaxed">
                {question.question}
              </p>
              <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                <textarea
                  rows={2}
                  className={`${inputClass} flex-1`}
                  placeholder="พิมพ์คำตอบจากทีมติวเตอร์…"
                  value={answers[question.id] ?? question.answer ?? ""}
                  onChange={(event) =>
                    setAnswers({ ...answers, [question.id]: event.target.value })
                  }
                />
                <div className="flex gap-2 sm:flex-col">
                  <button
                    onClick={() =>
                      void run(`answer-${question.id}`, "ตอบคำถามเรียบร้อย", () =>
                        answerQuestion(
                          question.id,
                          answers[question.id] ?? question.answer ?? "",
                          "answered",
                        ),
                      )
                    }
                    disabled={
                      busy === `answer-${question.id}` ||
                      !(answers[question.id] ?? question.answer ?? "").trim()
                    }
                    className="inline-flex flex-1 items-center justify-center gap-1 rounded-xl bg-bio-green px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
                  >
                    <Save className="h-3.5 w-3.5" /> ตอบ
                  </button>
                  <button
                    onClick={() =>
                      void run(`close-${question.id}`, "ปิดคำถามเรียบร้อย", () =>
                        answerQuestion(
                          question.id,
                          answers[question.id] ?? question.answer ?? "",
                          "closed",
                        ),
                      )
                    }
                    className="flex-1 rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600"
                  >
                    ปิด
                  </button>
                </div>
              </div>
            </article>
          ))}
          {data.questions.length === 0 && <EmptyState text="ยังไม่มีคำถาม" />}
        </div>
      ) : (
        <div className="divide-y divide-[#edf2ee]">
          {data.reviews.map((review) => (
            <article key={review.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill value={review.status} />
                <span className="text-xs font-bold">
                  {profileById.get(review.user_id)?.full_name || "นักเรียน"}
                </span>
                <span className="text-xs text-[#829087]">
                  · {courseById.get(review.course_id)?.title || "คอร์ส"}
                </span>
                <span className="ml-auto text-amber-500">
                  {"★".repeat(review.rating)}
                  <span className="text-slate-200">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed">{review.review_text}</p>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() =>
                    void run(`review-${review.id}`, "เผยแพร่รีวิวแล้ว", () =>
                      moderateReview(review.id, "published"),
                    )
                  }
                  className="rounded-xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700"
                >
                  อนุมัติ
                </button>
                <button
                  onClick={() =>
                    void run(`review-${review.id}`, "ปฏิเสธรีวิวแล้ว", () =>
                      moderateReview(review.id, "rejected"),
                    )
                  }
                  className="rounded-xl bg-rose-50 px-4 py-2 text-xs font-bold text-rose-700"
                >
                  ปฏิเสธ
                </button>
                <button
                  onClick={() =>
                    void run(`review-${review.id}`, "ย้ายรีวิวไปรอตรวจแล้ว", () =>
                      moderateReview(review.id, "pending"),
                    )
                  }
                  className="rounded-xl bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600"
                >
                  รอตรวจ
                </button>
              </div>
            </article>
          ))}
          {data.reviews.length === 0 && <EmptyState text="ยังไม่มีรีวิว" />}
        </div>
      )}
    </section>
  );
}

function ArticlesManager({ data, busy, run }: ManagerProps) {
  const [editingId, setEditingId] = useState<number>();
  const [form, setForm] = useState(emptyArticle);

  const edit = (article: AdminArticle) => {
    setEditingId(article.id);
    setForm({
      slug: article.slug,
      category: article.category,
      title: article.title,
      excerpt: article.excerpt,
      content: article.content,
      cover_image_url: article.cover_image_url,
      icon: article.icon,
      status: article.status,
      published_at: article.published_at,
    });
  };

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
      <section className={`${cardClass} overflow-hidden`}>
        <div className="flex items-center justify-between border-b border-[#edf2ee] p-5">
          <div>
            <h2 className="font-extrabold">คลังบทความ</h2>
            <p className="text-xs text-[#7d8982]">{data.articles.length} บทความ</p>
          </div>
          <button
            onClick={() => {
              setEditingId(undefined);
              setForm(emptyArticle);
            }}
            className="inline-flex items-center gap-1 rounded-xl bg-bio-green px-4 py-2.5 text-xs font-bold text-white"
          >
            <Plus className="h-4 w-4" /> เขียนใหม่
          </button>
        </div>
        <div className="divide-y divide-[#edf2ee]">
          {data.articles.map((article) => (
            <button
              key={article.id}
              onClick={() => edit(article)}
              className={`w-full p-5 text-left hover:bg-[#f8faf8] ${
                editingId === article.id ? "bg-emerald-50/60" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-bio-green-soft px-2.5 py-1 text-[10px] font-bold text-bio-green">
                  {article.category}
                </span>
                <StatusPill value={article.status} />
                <span className="ml-auto text-[10px] text-[#8a968f]">
                  {formatDate(article.updated_at)}
                </span>
              </div>
              <h3 className="mt-3 text-sm font-extrabold">{article.title}</h3>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-[#728078]">
                {article.excerpt}
              </p>
            </button>
          ))}
          {data.articles.length === 0 && <EmptyState text="ยังไม่มีบทความ" />}
        </div>
      </section>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void run("article", "บันทึกบทความเรียบร้อย", async () => {
            await saveArticle(form, editingId);
            setEditingId(undefined);
            setForm(emptyArticle);
          });
        }}
        className={`${cardClass} h-fit p-5 xl:sticky xl:top-24`}
      >
        <div className="mb-5">
          <h2 className="font-extrabold">
            {editingId ? "แก้ไขบทความ" : "บทความใหม่"}
          </h2>
          <p className="text-xs text-[#7d8982]">เนื้อหาจะแสดงเมื่อสถานะเป็น published</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="หมวดหมู่">
            <input
              required
              className={inputClass}
              value={form.category}
              onChange={(event) => setForm({ ...form, category: event.target.value })}
            />
          </Field>
          <Field label="สถานะ">
            <select
              className={inputClass}
              value={form.status}
              onChange={(event) =>
                setForm({
                  ...form,
                  status: event.target.value as typeof form.status,
                })
              }
            >
              <option value="draft">ฉบับร่าง</option>
              <option value="published">เผยแพร่</option>
              <option value="archived">เก็บถาวร</option>
            </select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Slug">
              <input
                required
                className={inputClass}
                value={form.slug}
                placeholder="ชื่อบทความภาษาอังกฤษ"
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="ชื่อบทความ">
              <input
                required
                className={inputClass}
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="คำโปรย">
              <textarea
                required
                rows={3}
                className={inputClass}
                value={form.excerpt}
                onChange={(event) =>
                  setForm({ ...form, excerpt: event.target.value })
                }
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="เนื้อหา">
              <textarea
                required
                rows={12}
                className={inputClass}
                value={form.content}
                onChange={(event) =>
                  setForm({ ...form, content: event.target.value })
                }
              />
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="URL รูปหน้าปก">
              <input
                className={inputClass}
                value={form.cover_image_url ?? ""}
                onChange={(event) =>
                  setForm({ ...form, cover_image_url: event.target.value })
                }
              />
            </Field>
          </div>
        </div>
        <button
          disabled={busy === "article"}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-bio-green px-4 py-3 text-sm font-bold text-white"
        >
          {busy === "article" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          บันทึกบทความ
        </button>
      </form>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
    </label>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="p-10 text-center text-sm text-[#89958e]">
      <Inbox className="mx-auto mb-2 h-7 w-7 opacity-50" />
      {text}
    </div>
  );
}
