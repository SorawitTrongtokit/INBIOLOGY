"use client";

import React from "react";
import { useArticles } from "@/hooks/useCatalog";
import { ScrollReveal } from "./ScrollReveal";
import { Dna, HeartPulse, Leaf, ArrowRight } from "lucide-react";

export const ArticlesSection: React.FC = () => {
  const { data: articles, isLoading, error } = useArticles();
  const getArticleIcon = (iconName: string) => {
    switch (iconName) {
      case "dna":
        return <Dna className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      case "heart-pulse":
        return <HeartPulse className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      case "leaf":
        return <Leaf className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      default:
        return <Leaf className="w-7 h-7 text-bio-green stroke-[1.8]" />;
    }
  };

  return (
    <section className="py-[75px] sm:py-[105px] bg-[#f8faf8]" id="articles">
      <div className="max-w-[1180px] px-5 mx-auto">
        <ScrollReveal className="mb-[30px]">
          <span className="block text-bio-green-2 text-xs font-extrabold tracking-[1.6px] mb-2">
            BIOLOGY BLOG
          </span>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold leading-tight m-0">
            บทความล่าสุด
          </h2>
        </ScrollReveal>

        {error ? (
          <p className="rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            โหลดบทความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="h-40 animate-pulse rounded-[16px] border border-bio-line bg-white"
                />
              ))
            : articles.map((article) => (
            <ScrollReveal key={article.id}>
              <article className="flex gap-[18px] p-6 bg-white border border-bio-line rounded-[16px] items-start hover:border-bio-green/40 hover:shadow-sm transition-all h-full">
                <div className="w-12 h-12 rounded-xl bg-bio-green-soft flex items-center justify-center shrink-0">
                  {getArticleIcon(article.icon)}
                </div>
                <div className="flex flex-col justify-between h-full">
                  <div>
                    <small className="text-bio-green font-bold text-xs block mb-1">
                      {article.category}
                    </small>
                    <h3 className="my-1 text-[17px] font-bold text-bio-ink leading-snug">
                      {article.title}
                    </h3>
                  </div>
                  <a
                    href={article.link}
                    className="text-bio-green font-bold text-xs mt-3 inline-flex items-center gap-1 hover:underline"
                  >
                    อ่านต่อ <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </article>
            </ScrollReveal>
          ))}
          </div>
        )}
      </div>
    </section>
  );
};
