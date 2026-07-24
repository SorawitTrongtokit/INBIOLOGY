export type CourseCategory = "basic" | "exam" | "deep";
export type GradeLevel = "ม.4" | "ม.5" | "ม.6" | "ม.ปลาย / TCAS";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  durationSeconds?: number;
  isFreePreview?: boolean;
}

export interface Chapter {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Tutor {
  name: string;
  title: string;
  avatar: string;
  bio: string;
  experience: string;
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  category: CourseCategory;
  gradeLevel: GradeLevel;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  lessonsCount: number;
  totalHours: string;
  price: number;
  originalPrice?: number;
  tag: string;
  coverClass: string;
  artType: "cell" | "dna" | "plant" | "heart" | "micro";
  isExtra?: boolean;
  isPopular?: boolean;
  tutor: Tutor;
  highlights: string[];
  syllabus: Chapter[];
}

export interface Benefit {
  id: string;
  icon: string;
  title: string;
  description: string;
}

export interface Review {
  id: string;
  text: string;
  author: string;
  avatarLetter: string;
  school: string;
  rating?: number;
}

export interface Article {
  id: string;
  slug: string;
  icon: string;
  category: string;
  title: string;
  link: string;
  excerpt: string;
  content?: string;
  readTime?: string;
  publishedAt?: string;
  author?: string;
}

export interface StatItem {
  value: string;
  label: string;
}
