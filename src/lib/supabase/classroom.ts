import type { User } from "@supabase/supabase-js";
import type { Course, Lesson } from "@/types";
import { getCourses } from "./catalog";
import { createClient } from "./client";

type EnrollmentRow = {
  course_id: number;
  status: string;
  enrolled_at: string;
  expires_at: string | null;
};

type ProgressRow = {
  lesson_id: number;
  position_seconds: number;
  is_completed: boolean;
  last_watched_at: string;
};

type QuestionRow = {
  id: number;
  lesson_id: number;
  question: string;
  answer: string | null;
  status: "pending" | "answered" | "closed";
  created_at: string;
};

type LessonAssetRow = {
  lesson_id: number;
  video_storage_path: string | null;
  document_storage_path: string | null;
};

export interface StudentCourseProgress {
  course: Course;
  progressPercentage: number;
  completedLessons: number;
}

export interface StudentDashboardData {
  studentName: string;
  enrolledCourses: StudentCourseProgress[];
  totalLessonsCompleted: number;
  totalStudyHours: string;
  overallProgressPercentage: number;
  lastStudiedCourse?: Course;
  lastStudiedLesson?: {
    courseId: string;
    chapterTitle: string;
    lessonTitle: string;
  };
}

export interface LessonProgress {
  positionSeconds: number;
  isCompleted: boolean;
  lastWatchedAt: string;
}

export interface ClassroomQuestion {
  id: string;
  lessonId: string;
  text: string;
  answer?: string;
  status: "pending" | "answered" | "closed";
  createdAt: string;
}

export interface ClassroomData {
  course: Course;
  studentName: string;
  progressByLesson: Record<string, LessonProgress>;
  notesByLesson: Record<string, string>;
  questions: ClassroomQuestion[];
  assetsByLesson: Record<
    string,
    { videoUrl?: string; documentUrl?: string }
  >;
  initialChapterIndex: number;
  initialLessonIndex: number;
}

export class AuthenticationRequiredError extends Error {
  constructor() {
    super("กรุณาเข้าสู่ระบบก่อนใช้งาน");
    this.name = "AuthenticationRequiredError";
  }
}

export class CourseAccessError extends Error {
  constructor(message = "บัญชีนี้ยังไม่มีสิทธิ์เข้าเรียนคอร์สนี้") {
    super(message);
    this.name = "CourseAccessError";
  }
}

function allLessons(course: Course) {
  return course.syllabus.flatMap((chapter) => chapter.lessons);
}

function isEnrollmentUsable(enrollment: EnrollmentRow) {
  return (
    ["active", "completed"].includes(enrollment.status) &&
    (!enrollment.expires_at ||
      new Date(enrollment.expires_at).getTime() > Date.now())
  );
}

function formatStudyTime(seconds: number) {
  if (seconds < 60) return "0 นาที";

  const hours = seconds / 3600;
  if (hours < 1) return `${Math.floor(seconds / 60)} นาที`;
  return `${hours.toFixed(1).replace(".0", "")} ชั่วโมง`;
}

async function getAuthenticatedUser(): Promise<User> {
  const {
    data: { user },
    error,
  } = await createClient().auth.getUser();

  if (error || !user) throw new AuthenticationRequiredError();
  return user;
}

function mapQuestion(row: QuestionRow): ClassroomQuestion {
  return {
    id: row.id.toString(),
    lessonId: row.lesson_id.toString(),
    text: row.question,
    answer: row.answer ?? undefined,
    status: row.status,
    createdAt: row.created_at,
  };
}

export async function getStudentDashboard(): Promise<StudentDashboardData> {
  const supabase = createClient();
  const user = await getAuthenticatedUser();

  const [courses, profileResult, enrollmentResult, courseCodeResult] =
    await Promise.all([
      getCourses(),
      supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
      supabase
        .from("enrollments")
        .select("course_id,status,enrolled_at,expires_at")
        .in("status", ["active", "completed"])
        .order("enrolled_at", { ascending: false }),
      supabase.from("courses").select("id,code").eq("status", "published"),
    ]);

  const firstError =
    profileResult.error ?? enrollmentResult.error ?? courseCodeResult.error;
  if (firstError) throw firstError;

  const usableEnrollments = ((enrollmentResult.data ?? []) as EnrollmentRow[])
    .filter(isEnrollmentUsable);
  const codeByDatabaseId = new Map(
    (courseCodeResult.data ?? []).map((row) => [Number(row.id), row.code]),
  );
  const enrolledCodes = new Set(
    usableEnrollments
      .map((row) => codeByDatabaseId.get(row.course_id))
      .filter((code): code is string => Boolean(code)),
  );
  const enrolledCourseList = courses.filter((course) =>
    enrolledCodes.has(course.id),
  );
  const lessonIds = enrolledCourseList.flatMap((course) =>
    allLessons(course).map((lesson) => Number(lesson.id)),
  );

  let progressRows: ProgressRow[] = [];
  if (lessonIds.length > 0) {
    const progressResult = await supabase
      .from("lesson_progress")
      .select("lesson_id,position_seconds,is_completed,last_watched_at")
      .in("lesson_id", lessonIds)
      .order("last_watched_at", { ascending: false });

    if (progressResult.error) throw progressResult.error;
    progressRows = (progressResult.data ?? []) as ProgressRow[];
  }

  const progressByLesson = new Map(
    progressRows.map((row) => [row.lesson_id.toString(), row]),
  );
  const enrolledCourses = enrolledCourseList.map((course) => {
    const lessons = allLessons(course);
    const completedLessons = lessons.filter(
      (lesson) => progressByLesson.get(lesson.id)?.is_completed,
    ).length;
    return {
      course,
      completedLessons,
      progressPercentage:
        lessons.length === 0
          ? 0
          : Math.round((completedLessons / lessons.length) * 100),
    };
  });

  const totalLessons = enrolledCourseList.reduce(
    (total, course) => total + course.lessonsCount,
    0,
  );
  const totalLessonsCompleted = progressRows.filter(
    (row) => row.is_completed,
  ).length;
  const totalStudySeconds = enrolledCourseList.reduce(
    (total, course) =>
      total +
      allLessons(course).reduce((courseTotal, lesson) => {
        const progress = progressByLesson.get(lesson.id);
        if (!progress) return courseTotal;
        return (
          courseTotal +
          (progress.is_completed
            ? lesson.durationSeconds ?? 0
            : Math.min(progress.position_seconds, lesson.durationSeconds ?? 0))
        );
      }, 0),
    0,
  );

  const latestProgress = progressRows[0];
  let lastStudiedCourse: Course | undefined;
  let lastStudiedLesson: StudentDashboardData["lastStudiedLesson"];
  if (latestProgress) {
    for (const course of enrolledCourseList) {
      for (const chapter of course.syllabus) {
        const lesson = chapter.lessons.find(
          (item) => item.id === latestProgress.lesson_id.toString(),
        );
        if (lesson) {
          lastStudiedCourse = course;
          lastStudiedLesson = {
            courseId: course.id,
            chapterTitle: chapter.title,
            lessonTitle: lesson.title,
          };
          break;
        }
      }
      if (lastStudiedCourse) break;
    }
  }

  if (!lastStudiedCourse && enrolledCourseList[0]) {
    const firstCourse = enrolledCourseList[0];
    const firstChapter = firstCourse.syllabus[0];
    const firstLesson = firstChapter?.lessons[0];
    lastStudiedCourse = firstCourse;
    if (firstLesson) {
      lastStudiedLesson = {
        courseId: firstCourse.id,
        chapterTitle: firstChapter.title,
        lessonTitle: firstLesson.title,
      };
    }
  }

  return {
    studentName:
      profileResult.data?.full_name?.trim() ||
      user.user_metadata?.full_name ||
      "นักเรียน INBIO",
    enrolledCourses,
    totalLessonsCompleted,
    totalStudyHours: formatStudyTime(totalStudySeconds),
    overallProgressPercentage:
      totalLessons === 0
        ? 0
        : Math.round((totalLessonsCompleted / totalLessons) * 100),
    lastStudiedCourse,
    lastStudiedLesson,
  };
}

export async function getClassroomData(
  courseCode: string,
): Promise<ClassroomData> {
  const supabase = createClient();
  const user = await getAuthenticatedUser();
  const courses = await getCourses();
  const course = courses.find((item) => item.id === courseCode);
  if (!course) throw new CourseAccessError("ไม่พบคอร์สเรียนที่ร้องขอ");

  const [courseResult, profileResult] = await Promise.all([
    supabase
      .from("courses")
      .select("id")
      .eq("code", courseCode)
      .eq("status", "published")
      .maybeSingle(),
    supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle(),
  ]);
  if (courseResult.error) throw courseResult.error;
  if (profileResult.error) throw profileResult.error;
  if (!courseResult.data) throw new CourseAccessError("ไม่พบคอร์สเรียนที่ร้องขอ");

  const { data: enrollment, error: enrollmentError } = await supabase
    .from("enrollments")
    .select("course_id,status,enrolled_at,expires_at")
    .eq("course_id", courseResult.data.id)
    .maybeSingle();
  if (enrollmentError) throw enrollmentError;

  const isAdmin = user.app_metadata?.role === "admin";
  if (!isAdmin && (!enrollment || !isEnrollmentUsable(enrollment as EnrollmentRow))) {
    throw new CourseAccessError();
  }

  const lessonIds = allLessons(course).map((lesson) => Number(lesson.id));
  const [progressResult, notesResult, questionsResult, assetsResult] =
    await Promise.all([
    lessonIds.length
      ? supabase
          .from("lesson_progress")
          .select("lesson_id,position_seconds,is_completed,last_watched_at")
          .in("lesson_id", lessonIds)
          .order("last_watched_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    lessonIds.length
      ? supabase
          .from("lesson_notes")
          .select("lesson_id,content")
          .in("lesson_id", lessonIds)
      : Promise.resolve({ data: [], error: null }),
    lessonIds.length
      ? supabase
          .from("lesson_questions")
          .select("id,lesson_id,question,answer,status,created_at")
          .in("lesson_id", lessonIds)
          .order("created_at", { ascending: false })
      : Promise.resolve({ data: [], error: null }),
    lessonIds.length
      ? supabase
          .from("lesson_assets")
          .select("lesson_id,video_storage_path,document_storage_path")
          .in("lesson_id", lessonIds)
      : Promise.resolve({ data: [], error: null }),
    ]);

  const firstError =
    progressResult.error ??
    notesResult.error ??
    questionsResult.error ??
    assetsResult.error;
  if (firstError) throw firstError;

  const assetEntries = await Promise.all(
    ((assetsResult.data ?? []) as LessonAssetRow[]).map(async (row) => {
      const [videoResult, documentResult] = await Promise.all([
        row.video_storage_path
          ? supabase.storage
              .from("course-videos")
              .createSignedUrl(row.video_storage_path, 60 * 60 * 6)
          : Promise.resolve({ data: null, error: null }),
        row.document_storage_path
          ? supabase.storage
              .from("course-documents")
              .createSignedUrl(row.document_storage_path, 60 * 60 * 6)
          : Promise.resolve({ data: null, error: null }),
      ]);

      return [
        row.lesson_id.toString(),
        {
          videoUrl: videoResult.data?.signedUrl,
          documentUrl: documentResult.data?.signedUrl,
        },
      ] as const;
    }),
  );

  const progressRows = (progressResult.data ?? []) as ProgressRow[];
  const progressByLesson = Object.fromEntries(
    progressRows.map((row) => [
      row.lesson_id.toString(),
      {
        positionSeconds: row.position_seconds,
        isCompleted: row.is_completed,
        lastWatchedAt: row.last_watched_at,
      },
    ]),
  );
  const notesByLesson = Object.fromEntries(
    (notesResult.data ?? []).map((row) => [
      row.lesson_id.toString(),
      row.content,
    ]),
  );

  const latestLessonId = progressRows[0]?.lesson_id.toString();
  let initialChapterIndex = 0;
  let initialLessonIndex = 0;
  if (latestLessonId) {
    course.syllabus.some((chapter, chapterIndex) => {
      const lessonIndex = chapter.lessons.findIndex(
        (lesson) => lesson.id === latestLessonId,
      );
      if (lessonIndex === -1) return false;
      initialChapterIndex = chapterIndex;
      initialLessonIndex = lessonIndex;
      return true;
    });
  }

  return {
    course,
    studentName:
      profileResult.data?.full_name?.trim() ||
      user.user_metadata?.full_name ||
      "นักเรียน INBIO",
    progressByLesson,
    notesByLesson,
    questions: ((questionsResult.data ?? []) as QuestionRow[]).map(mapQuestion),
    assetsByLesson: Object.fromEntries(assetEntries),
    initialChapterIndex,
    initialLessonIndex,
  };
}

export async function saveLessonProgress(
  lesson: Lesson,
  isCompleted: boolean,
) {
  const supabase = createClient();
  const user = await getAuthenticatedUser();
  const now = new Date().toISOString();
  const durationSeconds = lesson.durationSeconds ?? 0;
  const { error } = await supabase.from("lesson_progress").upsert(
    {
      user_id: user.id,
      lesson_id: Number(lesson.id),
      position_seconds: isCompleted ? durationSeconds : 0,
      is_completed: isCompleted,
      last_watched_at: now,
      completed_at: isCompleted ? now : null,
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) throw error;
  return now;
}

export async function saveLessonNote(lessonId: string, content: string) {
  const supabase = createClient();
  const user = await getAuthenticatedUser();
  const { error } = await supabase.from("lesson_notes").upsert(
    {
      user_id: user.id,
      lesson_id: Number(lessonId),
      content,
    },
    { onConflict: "user_id,lesson_id" },
  );
  if (error) throw error;
}

export async function addLessonQuestion(
  lessonId: string,
  question: string,
): Promise<ClassroomQuestion> {
  const supabase = createClient();
  const user = await getAuthenticatedUser();
  const { data, error } = await supabase
    .from("lesson_questions")
    .insert({
      user_id: user.id,
      lesson_id: Number(lessonId),
      question: question.trim(),
    })
    .select("id,lesson_id,question,answer,status,created_at")
    .single();

  if (error) throw error;
  return mapQuestion(data as QuestionRow);
}
