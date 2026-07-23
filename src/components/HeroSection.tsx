"use client";

import React from "react";
import { ScrollReveal } from "./ScrollReveal";
import { Check, Play, Dna, Microscope, Sparkles } from "lucide-react";

interface HeroSectionProps {
  onOpenPreview: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenPreview }) => {
  return (
    <section className="relative min-h-[650px] pt-[45px] sm:pt-[55px] md:pt-[80px] pb-[100px] sm:pb-[120px] hero-visual-bg overflow-hidden">
      <div className="max-w-[1180px] px-5 mx-auto grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] items-center gap-[50px]">
        {/* Hero Copy */}
        <ScrollReveal className="hero-copy">
          <span className="inline-flex items-center gap-1.5 text-bio-green-2 text-xs font-extrabold tracking-[1.6px] mb-3.5 bg-bio-green-soft px-3 py-1 rounded-full border border-bio-green/20">
            <Sparkles className="w-3.5 h-3.5 text-bio-green" />
            BIOLOGY LEARNING PLATFORM
          </span>
          <h1 className="text-[38px] sm:text-[54px] leading-[1.18] mb-5 tracking-tight font-extrabold">
            <span className="text-[60px] sm:text-[82px] text-bio-green leading-[0.9] block font-extrabold">
              inbio
            </span>
            เรียนชีวะ เข้าใจง่าย <em className="not-italic text-bio-green">เก่งได้จริง</em>
          </h1>
          <p className="text-base sm:text-[19px] text-[#435149] max-w-[620px] leading-relaxed">
            สรุปให้เข้าใจ กระชับ เชื่อมโยงทุกเรื่องชีวะ
            ตั้งแต่พื้นฐานจนถึงข้อสอบ ม.ปลาย และ TCAS
          </p>

          <div className="flex flex-col sm:flex-row gap-3.5 my-[30px]">
            <a
              href="#courses"
              className="bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn hover:-translate-y-0.5 rounded-[13px] px-[25px] py-[15px] font-bold text-center transition-all flex items-center justify-center gap-2"
            >
              ดูคอร์สเรียนทั้งหมด
            </a>
            <button
              onClick={onOpenPreview}
              className="bg-white text-[#193c2b] hover:-translate-y-0.5 shadow-bio-light rounded-[13px] px-[25px] py-[15px] font-bold transition-all text-center flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 fill-current text-bio-green" /> ดูตัวอย่างคอร์ส
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-[22px] mt-8">
            <div className="flex items-start gap-2.5">
              <div className="grid place-items-center w-[28px] h-[28px] rounded-full text-bio-green bg-white shadow-[0_5px_15px_rgba(22,92,50,0.1)] shrink-0 mt-0.5">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>
                <strong className="block text-sm font-bold">เนื้อหาคุณภาพ</strong>
                <small className="block text-[11px] text-bio-muted">
                  โดยติวเตอร์ชีวะมืออาชีพ
                </small>
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="grid place-items-center w-[28px] h-[28px] rounded-full text-bio-green bg-white shadow-[0_5px_15px_rgba(22,92,50,0.1)] shrink-0 mt-0.5">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>
                <strong className="block text-sm font-bold">อัปเดตเนื้อหา</strong>
                <small className="block text-[11px] text-bio-muted">
                  ตรงตามหลักสูตรล่าสุด
                </small>
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <div className="grid place-items-center w-[28px] h-[28px] rounded-full text-bio-green bg-white shadow-[0_5px_15px_rgba(22,92,50,0.1)] shrink-0 mt-0.5">
                <Check className="w-4 h-4 stroke-[3]" />
              </div>
              <span>
                <strong className="block text-sm font-bold">เรียนได้ทุกที่</strong>
                <small className="block text-[11px] text-bio-muted">
                  มือถือ แท็บเล็ต คอม
                </small>
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Hero Visual */}
        <ScrollReveal className="relative h-[360px] sm:h-[460px] lg:h-[520px]">
          {/* DNA Graphics */}
          <div className="dna dna-one"></div>
          <div className="dna dna-two"></div>

          {/* Microscope Card */}
          <div className="science-card absolute inset-[45px_5px_20px_25px] sm:inset-[65px_30px_35px_65px]">
            <div className="microscope scale-[0.72] sm:scale-100">
              <div className="scope-arm"></div>
              <div className="scope-lens"></div>
              <div className="scope-stage"></div>
              <div className="scope-base"></div>
            </div>
          </div>

          {/* Leaf Accents */}
          <div className="leaf leaf-a"></div>
          <div className="leaf leaf-b"></div>
          <div className="leaf leaf-c"></div>

          {/* Books Stack */}
          <div className="book-stack absolute right-0 bottom-[45px] rotate-[5deg] scale-[0.72] sm:scale-100 origin-bottom-right sm:origin-center">
            <div className="w-[175px] py-[12px] px-[17px] -my-[2px] bg-[#f5efe0] border border-[#cfc8b6] border-l-[18px] border-l-bio-green font-extrabold text-[#386448] shadow-bio-card">
              BIOLOGY
            </div>
            <div className="w-[175px] py-[12px] px-[17px] -my-[2px] bg-[#f5efe0] border border-[#cfc8b6] border-l-[18px] border-l-bio-green font-extrabold text-[#386448] shadow-bio-card">
              GENETICS
            </div>
            <div className="w-[175px] py-[12px] px-[17px] -my-[2px] bg-[#f5efe0] border border-[#cfc8b6] border-l-[18px] border-l-bio-green font-extrabold text-[#386448] shadow-bio-card">
              ECOLOGY
            </div>
          </div>

          {/* Floating Badges */}
          <div className="hidden sm:flex items-center gap-1.5 absolute right-[6px] top-[40px] bg-white border border-[#e6eee7] rounded-full py-2.5 px-3.5 text-xs font-bold shadow-bio text-bio-ink">
            <Dna className="w-4 h-4 text-bio-green" /> พันธุศาสตร์
          </div>
          <div className="hidden sm:flex items-center gap-1.5 absolute left-[6px] bottom-[28px] bg-white border border-[#e6eee7] rounded-full py-2.5 px-3.5 text-xs font-bold shadow-bio text-bio-ink">
            <Microscope className="w-4 h-4 text-bio-green" /> เซลล์และจุลชีพ
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
