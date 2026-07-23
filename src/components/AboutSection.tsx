import React from "react";
import { STATS_DATA } from "@/data/mockData";
import { ScrollReveal } from "./ScrollReveal";

export const AboutSection: React.FC = () => {
  return (
    <section className="py-[75px] sm:py-[105px] bg-gradient-to-r from-[#f8faf5] to-[#edf5e7]" id="about">
      <div className="max-w-[1180px] px-5 mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1.15fr_0.7fr_1fr] items-center gap-[50px]">
        {/* Story */}
        <ScrollReveal>
          <span className="block text-bio-green-2 text-xs font-extrabold tracking-[1.6px] mb-2">
            WHY INBIO
          </span>
          <h2 className="text-[30px] sm:text-[38px] font-extrabold leading-tight m-0 mb-4">
            เราไม่ได้สอนแค่ให้จำ
            <br />
            แต่สอนให้เข้าใจ
          </h2>
          <p className="text-bio-muted max-w-[470px] text-base sm:text-[17px] mb-6">
            เราเชื่อว่าชีวะไม่ใช่เรื่องยาก ถ้าเราเข้าใจธรรมชาติของมันอย่างแท้จริง
          </p>
          <a
            href="#contact"
            className="inline-flex bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn rounded-[11px] px-[19px] py-[11px] font-bold text-sm transition-all"
          >
            เกี่ยวกับเรา
          </a>
        </ScrollReveal>

        {/* Stats Grid */}
        <ScrollReveal className="grid grid-cols-2 gap-5 sm:gap-[22px]">
          {STATS_DATA.map((stat, i) => (
            <div key={i} className="flex flex-col">
              <strong className="text-[30px] font-extrabold text-bio-green">
                {stat.value}
              </strong>
              <span className="text-xs sm:text-[13px] text-bio-muted">{stat.label}</span>
            </div>
          ))}
        </ScrollReveal>

        {/* Tablet Mockup Visual */}
        <ScrollReveal className="flex justify-center">
          <div className="h-[330px] sm:h-[370px] w-full max-w-[330px] sm:max-w-none bg-[#23352b] rounded-[26px] p-[15px] -rotate-6 shadow-bio-tablet">
            <div className="h-full bg-white rounded-[16px] p border border-[#e2e9e3] p-[26px] flex flex-col items-center justify-between">
              <span className="text-[28px] font-extrabold text-bio-green">
                inbio
              </span>
              <div className="w-[130px] sm:w-[150px] h-[130px] sm:h-[150px] border-[9px] border-[#7ea36a] rounded-[36%_48%_40%_45%] relative my-4">
                <div className="absolute w-[40px] h-[40px] rounded-full bg-[#b4ce9e] left-[45px] top-[40px]"></div>
              </div>
              <div className="w-full">
                <div className="h-2 w-full bg-[#e7ece8] rounded-full overflow-hidden mb-1">
                  <div className="h-full w-[72%] bg-bio-green rounded-full"></div>
                </div>
                <small className="block text-center text-xs text-bio-muted font-medium">
                  Cell Structure — 72%
                </small>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
