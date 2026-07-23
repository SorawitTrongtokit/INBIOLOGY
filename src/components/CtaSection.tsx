import React from "react";
import { ScrollReveal } from "./ScrollReveal";

export const CtaSection: React.FC = () => {
  return (
    <section className="pb-[90px] bg-[#f8faf8]">
      <div className="max-w-[1180px] px-5 mx-auto">
        <ScrollReveal>
          <div className="bg-bio-green text-white rounded-[24px] p-[35px] sm:p-[50px_55px] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="block text-[#c8ead5] text-xs font-extrabold tracking-[1.6px] mb-2">
                START LEARNING TODAY
              </span>
              <h2 className="text-[29px] sm:text-[34px] font-extrabold m-0 leading-tight">
                พร้อมเก่งชีวะไปด้วยกันหรือยัง?
              </h2>
              <p className="m-0 mt-2 text-[#dcece2] text-sm sm:text-base">
                เริ่มเรียนฟรี พร้อมบททดลองและแบบทดสอบวัดระดับ
              </p>
            </div>
            <button className="bg-white text-[#193c2b] shadow-bio-light hover:-translate-y-0.5 rounded-[13px] px-[25px] py-[15px] font-bold text-sm sm:text-base transition-all shrink-0">
              สมัครเรียนฟรี
            </button>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};
