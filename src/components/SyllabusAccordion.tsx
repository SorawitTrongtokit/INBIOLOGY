"use client";

import React, { useState } from "react";
import { Chapter } from "@/types";
import { ChevronDown, PlayCircle, Lock, Clock } from "lucide-react";

interface SyllabusAccordionProps {
  chapters: Chapter[];
  onSelectPreviewLesson?: (lessonTitle: string) => void;
}

export const SyllabusAccordion: React.FC<SyllabusAccordionProps> = ({
  chapters,
  onSelectPreviewLesson,
}) => {
  // Default first chapter open
  const [openChapters, setOpenChapters] = useState<Record<string, boolean>>({
    [chapters[0]?.id || ""]: true,
  });

  const toggleChapter = (id: string) => {
    setOpenChapters((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="space-y-4">
      {chapters.map((chapter, index) => {
        const isOpen = !!openChapters[chapter.id];
        return (
          <div
            key={chapter.id}
            className="border border-bio-line rounded-2xl overflow-hidden bg-white shadow-sm transition-all"
          >
            {/* Chapter Header */}
            <button
              onClick={() => toggleChapter(chapter.id)}
              className="w-full flex items-center justify-between p-4 sm:p-5 bg-bio-cream/60 hover:bg-bio-green-soft/40 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-bio-green text-white font-bold text-sm grid place-items-center shrink-0">
                  {index + 1}
                </span>
                <div>
                  <h4 className="font-bold text-bio-ink text-sm sm:text-base leading-snug">
                    {chapter.title}
                  </h4>
                  <span className="text-xs text-bio-muted flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    {chapter.lessons.length} บทเรียน ({chapter.duration})
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-bio-muted transition-transform duration-300 ${
                  isOpen ? "rotate-180 text-bio-green" : ""
                }`}
              />
            </button>

            {/* Chapter Lessons List */}
            {isOpen && (
              <div className="divide-y divide-bio-line/60 bg-white">
                {chapter.lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex items-center justify-between p-3.5 sm:px-6 sm:py-4 hover:bg-gray-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3 pr-2">
                      {lesson.isFreePreview ? (
                        <PlayCircle className="w-5 h-5 text-bio-green shrink-0" />
                      ) : (
                        <Lock className="w-4 h-4 text-bio-muted/70 shrink-0 ml-0.5" />
                      )}
                      <span className="text-xs sm:text-sm font-medium text-bio-ink leading-normal">
                        {lesson.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-bio-muted font-medium">
                        {lesson.duration}
                      </span>
                      {lesson.isFreePreview && (
                        <button
                          onClick={() => onSelectPreviewLesson?.(lesson.title)}
                          className="bg-bio-green-soft text-bio-green text-[11px] font-bold px-2.5 py-1 rounded-full hover:bg-bio-green hover:text-white transition-colors"
                        >
                          ทดลองเรียนฟรี
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
