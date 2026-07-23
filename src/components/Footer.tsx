import React from "react";
import Link from "next/link";

export const Footer: React.FC = () => {
  return (
    <footer className="pt-[70px] pb-[25px] border-t border-bio-line bg-white" id="contact">
      <div className="max-w-[1180px] px-5 mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-[35px] sm:gap-[50px]">
        {/* Brand Column */}
        <div>
          <Link
            href="#top"
            className="relative text-[34px] font-extrabold text-bio-green tracking-tighter inline-block mb-3"
          >
            <span className="absolute -top-[1px] -right-1 text-xs text-[#69a94f] rotate-[-25deg]">
              ●
            </span>
            inbio
          </Link>
          <p className="text-[#6e7a72] text-sm leading-relaxed m-0">
            สถาบันเรียนพิเศษออนไลน์
            <br />
            ที่เน้นคุณภาพ เข้าใจง่าย และใส่ใจนักเรียน
          </p>
        </div>

        {/* Menu Column */}
        <div>
          <h4 className="font-bold text-base text-bio-ink mt-0 mb-3">เมนู</h4>
          <div className="flex flex-col gap-2">
            <a href="#top" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              หน้าหลัก
            </a>
            <a href="#courses" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              คอร์สเรียน
            </a>
            <a href="#about" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              เกี่ยวกับเรา
            </a>
            <a href="#articles" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              บทความ
            </a>
          </div>
        </div>

        {/* Support Column */}
        <div>
          <h4 className="font-bold text-base text-bio-ink mt-0 mb-3">ช่วยเหลือ</h4>
          <div className="flex flex-col gap-2">
            <a href="#" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              คำถามที่พบบ่อย
            </a>
            <a href="#" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              วิธีการสมัครเรียน
            </a>
            <a href="#" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              วิธีการชำระเงิน
            </a>
            <a href="#" className="text-[#516158] text-sm hover:text-bio-green transition-colors">
              นโยบายการคืนเงิน
            </a>
          </div>
        </div>

        {/* Contact Column */}
        <div>
          <h4 className="font-bold text-base text-bio-ink mt-0 mb-3">ติดต่อเรา</h4>
          <p className="text-[#6e7a72] text-sm leading-relaxed m-0">
            LINE: @inbio
            <br />
            Email: info@inbio.co.th
            <br />
            โทร: 099-123-4567
            <br />
            จันทร์–ศุกร์ 9:00–18:00
          </p>
        </div>
      </div>

      <div className="max-w-[1180px] px-5 mx-auto border-t border-bio-line mt-[45px] pt-[20px] text-[#7b867f] text-xs">
        © 2026 inbio. All rights reserved.
      </div>
    </footer>
  );
};
