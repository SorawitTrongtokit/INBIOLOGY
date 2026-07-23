"use client";

import React, { useEffect } from "react";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#09170f]/65 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Modal Content Box */}
      <div className="relative w-[min(520px,calc(100%-30px))] bg-white rounded-[22px] p-[28px] text-center z-10 shadow-bio-modal animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute right-[18px] top-[10px] bg-none border-0 text-[32px] text-[#516158] hover:text-bio-ink cursor-pointer"
          aria-label="ปิด"
        >
          ×
        </button>

        <div className="h-[240px] rounded-[15px] bg-gradient-to-br from-[#0c5f36] to-[#82af65] grid place-items-center text-white text-[54px] mb-5 shadow-inner">
          ▶
        </div>

        <h2 className="text-2xl font-bold text-bio-ink mb-1 mt-0">
          ตัวอย่างคอร์ส inbio
        </h2>
        <p className="text-bio-muted text-sm m-0 mb-6">
          บททดลอง: โครงสร้างเซลล์และหน้าที่ของออร์แกเนลล์
        </p>

        <button
          onClick={onClose}
          className="w-full bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn rounded-[11px] py-3 font-bold text-base transition-all"
        >
          เริ่มเรียนบททดลอง
        </button>
      </div>
    </div>
  );
};
