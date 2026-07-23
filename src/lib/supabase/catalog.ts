import type {
  Article,
  Chapter,
  Course,
  CourseCategory,
  GradeLevel,
  Lesson,
  Review,
  Tutor,
} from "@/types";
import { createPublicClient } from "./client";

type CourseRow = {
  id: number;
  instructor_id: number;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  category: string;
  grade_level: string;
  price: number | string;
  original_price: number | string | null;
  tag: string;
  cover_class: string;
  art_type: string;
  highlights: string[];
  duration_minutes: number;
  is_extra: boolean;
  is_popular: boolean;
  rating_average: number | string;
  reviews_count: number;
  students_count: number;
};

type InstructorRow = {
  id: number;
  name: string;
  title: string;
  avatar_url: string | null;
  bio: string;
  experience: string;
};

type ChapterRow = {
  id: number;
  course_id: number;
  title: string;
  position: number;
  duration_minutes: number;
};

type LessonRow = {
  id: number;
  chapter_id: number;
  title: string;
  position: number;
  duration_seconds: number;
  is_free_preview: boolean;
};

type ArticleRow = {
  id: number;
  icon: string;
  category: string;
  title: string;
};

type ReviewRow = {
  id: number;
  rating: number;
  review_text: string;
};

const COURSE_COLUMNS =
  "id,instructor_id,code,title,subtitle,description,category,grade_level,price,original_price,tag,cover_class,art_type,highlights,duration_minutes,is_extra,is_popular,rating_average,reviews_count,students_count";

let coursesRequest: Promise<Course[]> | undefined;
let articlesRequest: Promise<Article[]> | undefined;

function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} นาที`;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0
    ? `${hours} ชม. ${remainingMinutes} นาที`
    : `${hours} ชั่วโมง`;
}

function formatSeconds(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")} นาที`;
}

function toTutor(row: InstructorRow | undefined): Tutor {
  return {
    name: row?.name ?? "ทีมผู้สอน INBIO",
    title: row?.title ?? "ติวเตอร์ชีววิทยา",
    avatar: row?.avatar_url ?? "/images/tutor-placeholder.svg",
    bio: row?.bio ?? "",
    experience: row?.experience ?? "",
  };
}

function toLesson(row: LessonRow): Lesson {
  return {
    id: row.id.toString(),
    title: row.title,
    duration: formatSeconds(row.duration_seconds),
    durationSeconds: row.duration_seconds,
    isFreePreview: row.is_free_preview,
  };
}

function buildCourses(
  courseRows: CourseRow[],
  instructorRows: InstructorRow[],
  chapterRows: ChapterRow[],
  lessonRows: LessonRow[],
): Course[] {
  const instructors = new Map(instructorRows.map((row) => [row.id, row]));
  const lessonsByChapter = new Map<number, LessonRow[]>();

  lessonRows.forEach((lesson) => {
    const lessons = lessonsByChapter.get(lesson.chapter_id) ?? [];
    lessons.push(lesson);
    lessonsByChapter.set(lesson.chapter_id, lessons);
  });

  const chaptersByCourse = new Map<number, ChapterRow[]>();
  chapterRows.forEach((chapter) => {
    const chapters = chaptersByCourse.get(chapter.course_id) ?? [];
    chapters.push(chapter);
    chaptersByCourse.set(chapter.course_id, chapters);
  });

  return courseRows.map((row) => {
    const syllabus: Chapter[] = (chaptersByCourse.get(row.id) ?? [])
      .sort((a, b) => a.position - b.position)
      .map((chapter) => ({
        id: chapter.id.toString(),
        title: chapter.title,
        duration: formatMinutes(chapter.duration_minutes),
        lessons: (lessonsByChapter.get(chapter.id) ?? [])
          .sort((a, b) => a.position - b.position)
          .map(toLesson),
      }));

    return {
      id: row.code,
      title: row.title,
      subtitle: row.subtitle,
      description: row.description,
      category: row.category as CourseCategory,
      gradeLevel: row.grade_level as GradeLevel,
      rating: Number(row.rating_average),
      reviewsCount: row.reviews_count,
      studentsCount: row.students_count,
      lessonsCount: syllabus.reduce(
        (total, chapter) => total + chapter.lessons.length,
        0,
      ),
      totalHours: formatMinutes(row.duration_minutes),
      price: Number(row.price),
      originalPrice:
        row.original_price === null ? undefined : Number(row.original_price),
      tag: row.tag,
      coverClass: row.cover_class,
      artType: row.art_type as Course["artType"],
      isExtra: row.is_extra,
      isPopular: row.is_popular,
      tutor: toTutor(instructors.get(row.instructor_id)),
      highlights: row.highlights,
      syllabus,
    };
  });
}

async function loadCourses() {
  const supabase = createPublicClient();
  const [coursesResult, instructorsResult, chaptersResult, lessonsResult] =
    await Promise.all([
      supabase
        .from("courses")
        .select(COURSE_COLUMNS)
        .eq("status", "published")
        .order("code"),
      supabase
        .from("instructors")
        .select("id,name,title,avatar_url,bio,experience")
        .eq("is_active", true)
        .order("id"),
      supabase
        .from("course_chapters")
        .select("id,course_id,title,position,duration_minutes")
        .order("course_id")
        .order("position"),
      supabase
        .from("lessons")
        .select(
          "id,chapter_id,title,position,duration_seconds,is_free_preview",
        )
        .eq("is_published", true)
        .order("chapter_id")
        .order("position"),
    ]);

  const error =
    coursesResult.error ??
    instructorsResult.error ??
    chaptersResult.error ??
    lessonsResult.error;
  if (error) throw error;

  return buildCourses(
    (coursesResult.data ?? []) as CourseRow[],
    (instructorsResult.data ?? []) as InstructorRow[],
    (chaptersResult.data ?? []) as ChapterRow[],
    (lessonsResult.data ?? []) as LessonRow[],
  );
}

export function getCourses() {
  coursesRequest ??= loadCourses().catch((error) => {
    coursesRequest = undefined;
    throw error;
  });
  return coursesRequest;
}

async function loadArticles() {
  const { data, error } = await createPublicClient()
    .from("articles")
    .select("id,icon,category,title")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw error;

  return ((data ?? []) as ArticleRow[]).map((row) => ({
    id: row.id.toString(),
    icon: row.icon,
    category: row.category,
    title: row.title,
    link: "#articles",
  }));
}

export function getArticles() {
  articlesRequest ??= loadArticles().catch((error) => {
    articlesRequest = undefined;
    throw error;
  });
  return articlesRequest;
}

export async function getCourseWithReviews(code: string) {
  const courses = await getCourses();
  const course = courses.find((item) => item.id === code);
  if (!course) return { course: undefined, reviews: [] };

  const supabase = createPublicClient();
  const { data: courseRecord, error: courseError } = await supabase
    .from("courses")
    .select("id")
    .eq("code", code)
    .eq("status", "published")
    .maybeSingle();

  if (courseError) throw courseError;
  if (!courseRecord) return { course, reviews: [] };

  const { data, error } = await supabase
    .from("course_reviews")
    .select("id,rating,review_text")
    .eq("course_id", courseRecord.id)
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(12);

  if (error) throw error;

  const reviews: Review[] = ((data ?? []) as ReviewRow[]).map((row) => ({
    id: row.id.toString(),
    text: row.review_text,
    author: "ผู้เรียน INBIO",
    avatarLetter: "I",
    school: "ผู้เรียนที่ยืนยันแล้ว",
    rating: row.rating,
  }));

  return { course, reviews };
}
