import { createClient } from "./client";
import { invalidateCatalog } from "./catalog";

export type AdminCourse = {
  id: number;
  code: string;
  instructor_id: number | null;
  slug: string;
  title: string;
  subtitle: string | null;
  description: string;
  category: "basic" | "exam" | "deep";
  grade_level: string;
  price: number;
  original_price: number | null;
  tag: string | null;
  cover_class: string;
  art_type: string;
  highlights: string[];
  duration_minutes: number;
  is_extra: boolean;
  is_popular: boolean;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  rating_average: number;
  reviews_count: number;
  students_count: number;
  created_at: string;
  updated_at: string;
};

export type AdminInstructor = {
  id: number;
  name: string;
  title: string;
  avatar_url: string | null;
  bio: string;
  experience: string;
  is_active: boolean;
};

export type AdminChapter = {
  id: number;
  course_id: number;
  title: string;
  position: number;
  duration_minutes: number;
};

export type AdminLesson = {
  id: number;
  chapter_id: number;
  title: string;
  description: string | null;
  position: number;
  duration_seconds: number;
  is_free_preview: boolean;
  is_published: boolean;
};

export type AdminLessonAsset = {
  lesson_id: number;
  video_storage_path: string | null;
  document_storage_path: string | null;
};

export type AdminProfile = {
  id: string;
  email: string | null;
  full_name: string;
  phone: string | null;
  grade_level: string | null;
  school: string | null;
  created_at: string;
};

export type AdminEnrollment = {
  user_id: string;
  course_id: number;
  status: "active" | "completed" | "cancelled" | "refunded";
  amount_paid: number;
  enrolled_at: string;
  expires_at: string | null;
  completed_at: string | null;
};

export type AdminQuestion = {
  id: number;
  user_id: string;
  lesson_id: number;
  question: string;
  answer: string | null;
  status: "pending" | "answered" | "closed";
  created_at: string;
  answered_at: string | null;
  updated_at: string;
};

export type AdminReview = {
  id: number;
  course_id: number;
  user_id: string;
  rating: number;
  review_text: string;
  status: "pending" | "published" | "rejected";
  created_at: string;
};

export type AdminArticle = {
  id: number;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string | null;
  icon: string | null;
  status: "draft" | "published" | "archived";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminData = {
  courses: AdminCourse[];
  instructors: AdminInstructor[];
  chapters: AdminChapter[];
  lessons: AdminLesson[];
  assets: AdminLessonAsset[];
  profiles: AdminProfile[];
  enrollments: AdminEnrollment[];
  questions: AdminQuestion[];
  reviews: AdminReview[];
  articles: AdminArticle[];
};

export type CourseInput = Pick<
  AdminCourse,
  | "code"
  | "instructor_id"
  | "slug"
  | "title"
  | "subtitle"
  | "description"
  | "category"
  | "grade_level"
  | "price"
  | "original_price"
  | "tag"
  | "cover_class"
  | "art_type"
  | "highlights"
  | "duration_minutes"
  | "is_extra"
  | "is_popular"
  | "status"
>;

export class AdminAccessError extends Error {
  constructor(message = "บัญชีนี้ไม่มีสิทธิ์เข้าหน้าแอดมิน") {
    super(message);
    this.name = "AdminAccessError";
  }
}

async function ensureAdmin() {
  const supabase = createClient();

  // getUser() verifies the JWT server-side — unlike getSession() which only reads local storage
  let userResult = await supabase.auth.getUser();
  if (userResult.error || !userResult.data.user) {
    throw new AdminAccessError("กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน");
  }

  // If role claim is missing (stale JWT), attempt a token refresh and re-check
  if (userResult.data.user.app_metadata?.role !== "admin") {
    const refreshResult = await supabase.auth.refreshSession();
    if (refreshResult.error) throw refreshResult.error;

    userResult = await supabase.auth.getUser();
    if (userResult.error || !userResult.data.user) {
      throw new AdminAccessError("กรุณาเข้าสู่ระบบด้วยบัญชีแอดมิน");
    }
  }

  if (userResult.data.user.app_metadata?.role !== "admin") {
    throw new AdminAccessError();
  }

  return userResult.data.user;
}

function firstError(
  results: Array<{ error: { message: string } | null }>,
) {
  return results.find((result) => result.error)?.error ?? null;
}

export async function getAdminData(): Promise<AdminData> {
  await ensureAdmin();
  const supabase = createClient();

  const results = await Promise.all([
    supabase
      .from("courses")
      .select(
        "id,code,instructor_id,slug,title,subtitle,description,category,grade_level,price,original_price,tag,cover_class,art_type,highlights,duration_minutes,is_extra,is_popular,status,published_at,rating_average,reviews_count,students_count,created_at,updated_at",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("instructors")
      .select("id,name,title,avatar_url,bio,experience,is_active")
      .order("name"),
    supabase
      .from("course_chapters")
      .select("id,course_id,title,position,duration_minutes")
      .order("course_id")
      .order("position"),
    supabase
      .from("lessons")
      .select(
        "id,chapter_id,title,description,position,duration_seconds,is_free_preview,is_published",
      )
      .order("chapter_id")
      .order("position"),
    supabase
      .from("lesson_assets")
      .select("lesson_id,video_storage_path,document_storage_path"),
    supabase
      .from("profiles")
      .select("id,email,full_name,phone,grade_level,school,created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("enrollments")
      .select(
        "user_id,course_id,status,amount_paid,enrolled_at,expires_at,completed_at",
      )
      .order("enrolled_at", { ascending: false }),
    supabase
      .from("lesson_questions")
      .select(
        "id,user_id,lesson_id,question,answer,status,created_at,answered_at,updated_at",
      )
      .order("created_at", { ascending: false }),
    supabase
      .from("course_reviews")
      .select("id,course_id,user_id,rating,review_text,status,created_at")
      .order("created_at", { ascending: false }),
    supabase
      .from("articles")
      .select(
        "id,slug,category,title,excerpt,content,cover_image_url,icon,status,published_at,created_at,updated_at",
      )
      .order("created_at", { ascending: false }),
  ]);

  const error = firstError(results);
  if (error) throw error;

  return {
    courses: (results[0].data ?? []) as AdminCourse[],
    instructors: (results[1].data ?? []) as AdminInstructor[],
    chapters: (results[2].data ?? []) as AdminChapter[],
    lessons: (results[3].data ?? []) as AdminLesson[],
    assets: (results[4].data ?? []) as AdminLessonAsset[],
    profiles: (results[5].data ?? []) as AdminProfile[],
    enrollments: (results[6].data ?? []) as AdminEnrollment[],
    questions: (results[7].data ?? []) as AdminQuestion[],
    reviews: (results[8].data ?? []) as AdminReview[],
    articles: (results[9].data ?? []) as AdminArticle[],
  };
}

export async function saveCourse(input: CourseInput, id?: number) {
  await ensureAdmin();
  const payload = {
    ...input,
    subtitle: input.subtitle || null,
    original_price: input.original_price || null,
    tag: input.tag || null,
    instructor_id: input.instructor_id || null,
    published_at:
      input.status === "published" ? new Date().toISOString() : null,
  };
  const query = id
    ? createClient().from("courses").update(payload).eq("id", id)
    : createClient().from("courses").insert(payload);
  const { error } = await query;
  if (error) throw error;
  invalidateCatalog();
}

export async function saveInstructor(
  input: Omit<AdminInstructor, "id">,
  id?: number,
) {
  await ensureAdmin();
  const query = id
    ? createClient().from("instructors").update(input).eq("id", id)
    : createClient().from("instructors").insert(input);
  const { error } = await query;
  if (error) throw error;
}

export async function saveChapter(
  input: Omit<AdminChapter, "id">,
  id?: number,
) {
  await ensureAdmin();
  const query = id
    ? createClient().from("course_chapters").update(input).eq("id", id)
    : createClient().from("course_chapters").insert(input);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteChapter(id: number) {
  await ensureAdmin();
  const { error } = await createClient()
    .from("course_chapters")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function saveLesson(
  input: Omit<AdminLesson, "id">,
  id?: number,
) {
  await ensureAdmin();
  const query = id
    ? createClient().from("lessons").update(input).eq("id", id)
    : createClient().from("lessons").insert(input);
  const { error } = await query;
  if (error) throw error;
}

export async function deleteLesson(id: number) {
  await ensureAdmin();
  const { error } = await createClient().from("lessons").delete().eq("id", id);
  if (error) throw error;
}

function cleanFileName(file: File) {
  const extension = file.name.split(".").pop()?.toLowerCase() || "bin";
  const baseName = file.name
    .replace(/\.[^/.]+$/, "")
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${baseName || "course-asset"}.${extension}`;
}

export async function uploadLessonAsset(
  courseId: number,
  lessonId: number,
  kind: "video" | "document",
  file: File,
) {
  await ensureAdmin();
  const supabase = createClient();
  const bucket = kind === "video" ? "course-videos" : "course-documents";
  const column =
    kind === "video" ? "video_storage_path" : "document_storage_path";
  const path = `courses/${courseId}/lessons/${lessonId}/${Date.now()}-${cleanFileName(file)}`;
  const currentResult = await supabase
    .from("lesson_assets")
    .select("video_storage_path,document_storage_path")
    .eq("lesson_id", lessonId)
    .maybeSingle();
  if (currentResult.error) throw currentResult.error;

  const uploadResult = await supabase.storage
    .from(bucket)
    .upload(path, file, { cacheControl: "3600", upsert: false });
  if (uploadResult.error) throw uploadResult.error;

  const saveResult = await supabase.from("lesson_assets").upsert(
    { lesson_id: lessonId, [column]: path },
    { onConflict: "lesson_id" },
  );
  if (saveResult.error) {
    await supabase.storage.from(bucket).remove([path]);
    throw saveResult.error;
  }

  const previousPath =
    kind === "video"
      ? currentResult.data?.video_storage_path
      : currentResult.data?.document_storage_path;
  if (previousPath && previousPath !== path) {
    await supabase.storage.from(bucket).remove([previousPath]);
  }
}

export async function deleteLessonAsset(
  lessonId: number,
  kind: "video" | "document",
  path: string,
) {
  await ensureAdmin();
  const supabase = createClient();
  const bucket = kind === "video" ? "course-videos" : "course-documents";
  const column =
    kind === "video" ? "video_storage_path" : "document_storage_path";
  const removeResult = await supabase.storage.from(bucket).remove([path]);
  if (removeResult.error) throw removeResult.error;
  const { error } = await supabase
    .from("lesson_assets")
    .update({ [column]: null })
    .eq("lesson_id", lessonId);
  if (error) throw error;
}

export async function createAssetUrl(
  kind: "video" | "document",
  path: string,
) {
  await ensureAdmin();
  const bucket = kind === "video" ? "course-videos" : "course-documents";
  const { data, error } = await createClient()
    .storage.from(bucket)
    .createSignedUrl(path, 60 * 15);
  if (error) throw error;
  return data.signedUrl;
}

export async function saveEnrollment(input: {
  user_id: string;
  course_id: number;
  status: AdminEnrollment["status"];
  amount_paid: number;
  expires_at: string | null;
}) {
  await ensureAdmin();
  const { error } = await createClient().from("enrollments").upsert(
    {
      ...input,
      expires_at: input.expires_at || null,
      completed_at:
        input.status === "completed" ? new Date().toISOString() : null,
    },
    { onConflict: "user_id,course_id" },
  );
  if (error) throw error;
}

export async function answerQuestion(
  id: number,
  answer: string,
  status: AdminQuestion["status"] = "answered",
) {
  await ensureAdmin();
  const { error } = await createClient()
    .from("lesson_questions")
    .update({
      answer: answer.trim() || null,
      status,
      answered_at: status === "answered" ? new Date().toISOString() : null,
    })
    .eq("id", id);
  if (error) throw error;
}

export async function moderateReview(
  id: number,
  status: AdminReview["status"],
) {
  await ensureAdmin();
  const { error } = await createClient()
    .from("course_reviews")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}

export async function saveArticle(
  input: Omit<AdminArticle, "id" | "created_at" | "updated_at">,
  id?: number,
) {
  await ensureAdmin();
  const payload = {
    ...input,
    cover_image_url: input.cover_image_url || null,
    icon: input.icon || null,
    published_at:
      input.status === "published"
        ? input.published_at || new Date().toISOString()
        : null,
  };
  const query = id
    ? createClient().from("articles").update(payload).eq("id", id)
    : createClient().from("articles").insert(payload);
  const { error } = await query;
  if (error) throw error;
  invalidateCatalog();
}
