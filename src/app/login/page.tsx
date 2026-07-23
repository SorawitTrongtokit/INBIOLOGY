"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingReset, setIsSendingReset] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setIsLoading(false);

    if (error) {
      setErrorMessage(
        error.message.toLowerCase().includes("email not confirmed")
          ? "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ"
          : "อีเมลหรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง",
      );
      return;
    }

    const requestedPath = new URLSearchParams(window.location.search).get("next");
    const nextPath =
      requestedPath?.startsWith("/") && !requestedPath.startsWith("//")
        ? requestedPath
        : "/";
    router.replace(nextPath);
    router.refresh();
  };

  const handleForgotPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    if (!email.trim()) {
      setErrorMessage("กรุณากรอกอีเมลก่อนขอลิงก์ตั้งรหัสผ่านใหม่");
      return;
    }

    setIsSendingReset(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/update-password`,
    });
    setIsSendingReset(false);

    if (error) {
      setErrorMessage("ยังส่งอีเมลตั้งรหัสผ่านใหม่ไม่ได้ กรุณาลองอีกครั้ง");
      return;
    }

    setSuccessMessage(
      "หากอีเมลนี้มีบัญชีอยู่ ระบบจะส่งลิงก์ตั้งรหัสผ่านใหม่ให้ กรุณาตรวจสอบกล่องจดหมาย",
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8]">
      <Header />

      <main className="flex-grow flex items-center justify-center py-12 sm:py-16 px-5">
        <div className="w-full max-w-[1000px] bg-white border border-bio-line rounded-3xl overflow-hidden shadow-bio grid grid-cols-1 md:grid-cols-2">
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
                  BIOLOGY LEARNING PLATFORM
                </span>
                <h2 className="text-3xl font-extrabold leading-tight">
                  เรียนชีวะ เข้าใจง่าย
                  <br />
                  เก่งได้จริง กับ inbio
                </h2>
                <p className="text-sm text-[#dcece2] leading-relaxed">
                  เข้าสู่ระบบเพื่อเรียนบทเรียนต่อ ทำแบบทดสอบวัดระดับ และดาวน์โหลดชีทสรุปสีสันสดใส
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-8 border-t border-white/15">
              <div className="flex items-center gap-2.5 text-xs text-[#e6f4ea] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#c8ead5] shrink-0" />
                <span>เข้าถึงบทเรียนวิดีโอคุณภาพได้ 24 ชั่วโมง</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#e6f4ea] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#c8ead5] shrink-0" />
                <span>ติดตามความคืบหน้าการเรียนรายบุคคล</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-[#e6f4ea] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#c8ead5] shrink-0" />
                <span>สอบถามข้อสงสัยกับทีมงานติวเตอร์โดยตรง</span>
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-xs font-extrabold text-bio-green tracking-wider uppercase block mb-1">
                WELCOME BACK
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-bio-ink m-0">
                เข้าสู่ระบบ
              </h1>
              <p className="text-xs sm:text-sm text-bio-muted mt-1 m-0">
                กรอกข้อมูลด้านล่างเพื่อเข้าสู่บัญชีเรียนของคุณ
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold"
              >
                ⚠️ {errorMessage}
              </div>
            )}

            {successMessage && (
              <div
                role="status"
                className="mb-5 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 font-semibold"
              >
                {successMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-bio-ink">
                  อีเมล
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-bio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="student@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-bio-cream/60 border border-bio-line rounded-xl text-sm font-medium text-bio-ink focus:outline-none focus:border-bio-green focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-bio-ink">
                    รหัสผ่าน
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={isSendingReset}
                    className="text-xs font-semibold text-bio-green hover:underline"
                  >
                    {isSendingReset ? "กำลังส่ง..." : "ลืมรหัสผ่าน?"}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-5 h-5 text-bio-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3 bg-bio-cream/60 border border-bio-line rounded-xl text-sm font-medium text-bio-ink focus:outline-none focus:border-bio-green focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bio-muted hover:text-bio-ink"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn rounded-xl py-3.5 font-bold text-sm sm:text-base transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {isLoading ? (
                  <span>กำลังเข้าสู่ระบบ...</span>
                ) : (
                  <>
                    <span>เข้าสู่ระบบ</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-bio-line text-center">
              <p className="text-xs text-bio-muted mt-6">
                ยังไม่มีบัญชีเรียน inbio?{" "}
                <Link
                  href="/register"
                  className="text-bio-green font-bold hover:underline"
                >
                  สมัครสมาชิกฟรีที่นี่
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
