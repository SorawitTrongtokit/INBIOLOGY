import React from "react";
import { REVIEWS_DATA } from "@/data/mockData";
import { ScrollReveal } from "./ScrollReveal";

export const ReviewsSection: React.FC = () => {
  return (
    <section className="py-[75px] sm:py-[105px] bg-white" id="reviews">
      <div className="max-w-[1180px] px-5 mx-auto">
        <ScrollReveal className="text-center mb-[30px]">
          <span className="block text-bio-green-2 text-xs font-extrabold tracking-[1.6px] mb-2">
            STUDENT REVIEWS
          </span>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold leading-tight m-0">
            เสียงจากนักเรียน
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {REVIEWS_DATA.map((review) => (
            <ScrollReveal key={review.id}>
              <article className="p-[28px] border border-bio-line rounded-[17px] bg-white h-full flex flex-col justify-between hover:border-bio-green/40 transition-colors">
                <p className="min-h-[90px] text-[#405148] text-sm leading-relaxed mb-6">
                  {review.text}
                </p>
                <div className="flex items-center gap-3">
                  <span className="w-[44px] h-[44px] rounded-full grid place-items-center bg-bio-green-soft text-bio-green font-extrabold text-base shrink-0">
                    {review.avatarLetter}
                  </span>
                  <div className="flex flex-col">
                    <b className="text-sm font-bold text-bio-ink">{review.author}</b>
                    <small className="text-xs text-bio-muted">{review.school}</small>
                  </div>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
};
