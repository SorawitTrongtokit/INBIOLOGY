"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

function getSignUpErrorMessage(code?: string, fallback?: string) {
  switch (code) {
    case "email_address_not_authorized":
      return "Supabase ยังไม่อนุญาตให้ส่งอีเมลยืนยันไปยังอีเมลนี้ กรุณาตั้งค่า Custom SMTP หรือปิด Confirm email ชั่วคราวใน Supabase Dashboard";
    case "email_address_invalid":
    case "validation_failed":
      return "รูปแบบอีเมลไม่ถูกต้อง หรือโดเมนอีเมลนี้ไม่รองรับ";
    case "weak_password":
      return "รหัสผ่านยังไม่ผ่านเงื่อนไขความปลอดภัย กรุณาใช้ตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และสัญลักษณ์";
    case "email_exists":
    case "user_already_exists":
      return "อีเมลนี้มีบัญชีอยู่แล้ว กรุณาเข้าสู่ระบบหรือกดลืมรหัสผ่าน";
    case "email_provider_disabled":
      return "การสมัครสมาชิกด้วยอีเมลถูกปิดอยู่ กรุณาเปิด Email provider ใน Supabase Dashboard";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "ส่งอีเมลบ่อยเกินไป กรุณารอสักครู่แล้วลองใหม่";
    case "captcha_failed":
      return "การตรวจสอบ CAPTCHA ไม่สำเร็จ กรุณาลองใหม่";
    case "unexpected_failure":
      return "Supabase Auth เกิดข้อผิดพลาดภายใน กรุณาตรวจ Auth logs หรือ database trigger";
    default:
      return fallback
        ? `สมัครสมาชิกไม่สำเร็จ: ${fallback}`
        : "สมัครสมาชิกไม่สำเร็จ กรุณาลองอีกครั้ง";
  }
}

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gradeLevel, setGradeLevel] = useState("ม.4");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const gradeOptions = ["ม.4", "ม.5", "ม.6", "ม.ปลาย / TCAS"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน กรุณาตรวจสอบอีกครั้ง");
      return;
    }

    if (password.length < 8) {
      setErrorMessage("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (!agreeTerms) {
      setErrorMessage("กรุณายอมรับเงื่อนไขการใช้งานก่อนสมัครสมาชิก");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName.trim(),
          phone: phone.trim(),
          grade_level: gradeLevel,
        },
      },
    });
    setIsLoading(false);

    if (error) {
      setErrorMessage(getSignUpErrorMessage(error.code, error.message));
      return;
    }

    setPassword("");
    setConfirmPassword("");

    if (data.session) {
      router.replace("/");
      router.refresh();
      return;
    }

    setSuccessMessage(
      "สมัครสมาชิกแล้ว กรุณาเปิดอีเมลเพื่อยืนยันบัญชีก่อนเข้าสู่ระบบ",
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8]">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 sm:py-16 px-5">
        <div className="w-full max-w-[1050px] bg-white border border-bio-line rounded-3xl overflow-hidden shadow-bio grid grid-cols-1 md:grid-cols-2">
          {/* Left Decorative Showcase Panel */}
          <div className="bg-gradient-to-br from-[#0c4a2a] via-[#0b6b3a] to-[#16824a] text-white p-8 sm:p-12 flex flex-col justify-between relative overflow-hidden hidden md:flex">
            <div className="dna dna-one opacity-20"></div>
            <div className="dna dna-two opacity-20"></div>

            <div>
              <Link href="/" className="inline-block text-3xl font-extrabold text-white tracking-tighter mb-8">
                ●inbio
              </Link>
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-bold text-[#c8ead5]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  JOIN INBIO TODAY
                </span>
                <h2 className="text-3xl font-extrabold leading-tight">
                  สร้างบัญชีใหม่
                  <br />
                  พร้อมเก่งชีวะตั้งแต่วันนี้
                </h2>
                <p className="text-sm text-[#dcece2] leading-relaxed">
                  สมัครสมาชิกฟรี สัมผัสประสบการณ์เรียนชีววิทยาแนวใหม่ สรุปภาพเข้าใจง่าย คลิป HD ไม่อั้น
                </p>
              </div>
            </div>

            <div className="space-y-4 pt-8 border-t border-white/15">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-[#c8ead5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white m-0">ทดลองเรียนฟรี</h4>
                  <p className="text-[11px] text-[#dcece2] m-0">เข้าถึงบททดลองและแนวข้อสอบย่อย</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center shrink-0">
                  <GraduationCap className="w-5 h-5 text-[#c8ead5]" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white m-0">ติวเตอร์มืออาชีพ</h4>
                  <p className="text-[11px] text-[#dcece2] m-0">คำแนะนำและเทคนิคการทำข้อสอบ TCAS</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Registration Form */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-6">
              <span className="text-xs font-extrabold text-bio-green tracking-wider uppercase block mb-1">
                CREATE ACCOUNT
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-bio-ink m-0">
                สมัครสมาชิกฟรี
              </h1>
              <p className="text-xs sm:text-sm text-bio-muted mt-1 m-0">
                เริ่มต้นเส้นทางความเข้าใจชีวะอย่างแท้จริง
              </p>
            </div>

            {errorMessage && (
              <div role="alert" className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
                ⚠️ {errorMessage}
              </div>
            )}

            {successMessage && (
              <div role="status" className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold">
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-bio-ink">ชื่อ - นามสกุล</label>
                <div className="relative">
                  <User className="w-4 h-4 text-bio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="สมชาย เรียนดี"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-bio-cream/60 border border-bio-line rounded-xl text-xs sm:text-sm font-medium text-bio-ink focus:outline-none focus:border-bio-green focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Email & Phone grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-bio-ink">อีเมล</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-bio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="student@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-bio-cream/60 border border-bio-line rounded-xl text-xs font-medium text-bio-ink focus:outline-none focus:border-bio-green focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-bio-ink">เบอร์โทรศัพท์</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-bio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="0812345678"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 bg-bio-cream/60 border border-bio-line rounded-xl text-xs font-medium text-bio-ink focus:outline-none focus:border-bio-green focus:bg-white transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Grade Level Selector */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-bio-ink">ระดับชั้นการศึกษาปัจจุบัน</label>
                <div className="grid grid-cols-4 gap-2">
                  {gradeOptions.map((grade) => (
                    <button
                      key={grade}
                      type="button"
                      onClick={() => setGradeLevel(grade)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        gradeLevel === grade
                          ? "bg-bio-green text-white border-bio-green shadow-sm"
                          : "bg-bio-cream/50 text-bio-ink border-bio-line hover:border-bio-green/40"
                      }`}
                    >
                      {grade}
                    </button>
                  ))}
                </div>
              </div>

              {/* Passwords grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-bio-ink">รหัสผ่าน</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-bio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="อย่างน้อย 8 ตัวอักษร"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-bio-cream/60 border border-bio-line rounded-xl text-xs font-medium text-bio-ink focus:outline-none focus:border-bio-green focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-bio-ink">ยืนยันรหัสผ่าน</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-bio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="new-password"
                      placeholder="กรอกรหัสผ่านซ้ำอีกครั้ง"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 bg-bio-cream/60 border border-bio-line rounded-xl text-xs font-medium text-bio-ink focus:outline-none focus:border-bio-green focus:bg-white transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-bio-muted hover:text-bio-ink"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer text-xs text-bio-muted select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="w-4 h-4 accent-bio-green rounded cursor-pointer mt-0.5"
                  />
                  <span>
                    ฉันได้อ่านและยอมรับ{" "}
                    <a href="/terms" className="text-bio-green font-bold hover:underline">
                      ข้อกำหนดการใช้งาน
                    </a>{" "}
                    และ{" "}
                    <a href="/privacy" className="text-bio-green font-bold hover:underline">
                      นโยบายความเป็นส่วนตัว
                    </a>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn rounded-xl py-3 font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
              >
                {isLoading ? (
                  <span>กำลังสร้างบัญชี...</span>
                ) : (
                  <>
                    <span>สมัครสมาชิก</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-xs text-bio-muted text-center mt-6">
              มีบัญชีเรียนอยู่แล้ว?{" "}
              <Link href="/login" className="text-bio-green font-bold hover:underline">
                เข้าสู่ระบบที่นี่
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
