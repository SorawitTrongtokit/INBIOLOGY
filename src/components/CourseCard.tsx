import React from "react";
import Link from "next/link";
import { Course } from "@/types";
import { ScrollReveal } from "./ScrollReveal";
import { Dna, Microscope, Sprout, HeartPulse, BookOpenCheck, Star } from "lucide-react";

interface CourseCardProps {
  course: Course;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  return (
    <ScrollReveal>
      <Link href={`/courses/${course.id}`} className="block h-full group">
        <article className="border border-[#e4eae5] rounded-[18px] overflow-hidden bg-white group-hover:-translate-y-2 group-hover:shadow-bio transition-all duration-300 h-full flex flex-col justify-between">
          {/* Course Cover */}
          <div className={`h-[190px] p-5 relative overflow-hidden text-white ${course.coverClass}`}>
            <div className="flex items-center justify-between z-10 relative">
              <span className="inline-block bg-white/18 backdrop-blur-md px-[10px] py-[5px] rounded-full text-[11px] font-semibold border border-white/20">
                {course.tag}
              </span>
              {course.gradeLevel && (
                <span className="bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold">
                  {course.gradeLevel}
                </span>
              )}
            </div>

            {/* Dynamic Graphic Artwork */}
            {course.artType === "cell" && (
              <div className="cell-illustration opacity-80"></div>
            )}
            {course.artType === "dna" && (
              <div className="absolute -right-4 -bottom-4 opacity-30 select-none">
                <Dna className="w-36 h-36 text-white stroke-[1.2]" />
              </div>
            )}
            {course.artType === "plant" && (
              <div className="absolute -right-3 -bottom-3 opacity-35 select-none">
                <Sprout className="w-32 h-32 text-white stroke-[1.2]" />
              </div>
            )}
            {course.artType === "heart" && (
              <div className="absolute -right-3 -bottom-3 opacity-35 select-none">
                <HeartPulse className="w-32 h-32 text-red-900 stroke-[1.2]" />
              </div>
            )}
            {course.artType === "micro" && (
              <div className="absolute -right-3 -bottom-3 opacity-35 select-none">
                <Microscope className="w-32 h-32 text-white stroke-[1.2]" />
              </div>
            )}

            <h3 className="absolute left-5 bottom-[18px] text-[22px] font-bold max-w-[200px] m-0 z-10 leading-tight drop-shadow-sm group-hover:underline">
              {course.title}
            </h3>
          </div>

          {/* Course Body */}
          <div className="p-[18px] flex flex-col justify-between flex-grow">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span>{course.rating || 4.9}</span>
                </div>
                <span className="text-[11px] text-bio-muted">
                  ({course.studentsCount ? `${course.studentsCount.toLocaleString()} นักเรียน` : "1,000+ นักเรียน"})
                </span>
              </div>

              <h3 className="text-[17px] font-bold mb-1.5 mt-0 text-bio-ink">{course.subtitle}</h3>
              <p className="text-xs text-bio-muted min-h-[38px] m-0 leading-relaxed line-clamp-2">
                {course.description}
              </p>
            </div>

            <div className="flex justify-between items-center mt-[17px] text-xs text-[#476052] font-semibold border-t border-bio-line/60 pt-3">
              <span className="flex items-center gap-1">
                <BookOpenCheck className="w-4 h-4 text-bio-green" />
                {course.lessonsCount} บทเรียน
              </span>
              <div className="text-right">
                {course.originalPrice && (
                  <span className="text-[11px] text-bio-muted line-through mr-1.5">
                    {course.originalPrice.toLocaleString()}.-
                  </span>
                )}
                <b className="text-bio-green text-sm font-bold">
                  {typeof course.price === "number" ? `${course.price.toLocaleString()} บาท` : course.price}
                </b>
              </div>
            </div>
          </div>
        </article>
      </Link>
    </ScrollReveal>
  );
};
