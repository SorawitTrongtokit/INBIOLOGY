"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getSession().then(({ data }) => {
      setHasRecoverySession(Boolean(data.session));
      setIsChecking(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasRecoverySession(true);
      }
      setIsChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password.length < 8) {
      setErrorMessage("รหัสผ่านใหม่ต้องมีอย่างน้อย 8 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
      return;
    }

    setIsLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      setErrorMessage("ตั้งรหัสผ่านใหม่ไม่สำเร็จ ลิงก์อาจหมดอายุ กรุณาขอลิงก์ใหม่");
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setSuccessMessage("ตั้งรหัสผ่านใหม่สำเร็จ กำลังพากลับไปหน้าหลัก...");
    window.setTimeout(() => {
      router.replace("/");
      router.refresh();
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8]">
      <Header />
      <main className="flex-grow flex items-center justify-center px-5 py-12 sm:py-16">
        <div className="w-full max-w-lg rounded-3xl border border-bio-line bg-white p-8 shadow-bio sm:p-12">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-bio-green-soft text-bio-green">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <h1 className="text-2xl font-extrabold text-bio-ink">ตั้งรหัสผ่านใหม่</h1>
            <p className="mt-2 text-sm text-bio-muted">
              รหัสผ่านจะถูกจัดเก็บแบบแฮช จึงไม่มีใคร—including ผู้ดูแลระบบ—อ่านรหัสเดิมกลับมาได้
            </p>
          </div>

          {errorMessage && (
            <div role="alert" className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-semibold text-red-600">
              ⚠️ {errorMessage}
            </div>
          )}

          {successMessage && (
            <div role="status" className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-semibold text-emerald-700">
              {successMessage}
            </div>
          )}

          {!isChecking && !hasRecoverySession ? (
            <div className="text-center">
              <p className="text-sm text-bio-muted">
                ลิงก์นี้ไม่ถูกต้องหรือหมดอายุแล้ว กรุณาขอลิงก์ใหม่จากหน้าเข้าสู่ระบบ
              </p>
              <Link href="/login" className="mt-5 inline-flex rounded-xl bg-bio-green px-5 py-3 text-sm font-bold text-white">
                กลับไปหน้าเข้าสู่ระบบ
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-bio-ink">รหัสผ่านใหม่</span>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-bio-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-xl border border-bio-line bg-bio-cream/60 py-3 pl-11 pr-11 text-sm text-bio-ink focus:border-bio-green focus:bg-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-bio-muted"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </label>

              <label className="block">
                <span className="mb-1.5 block text-xs font-bold text-bio-ink">ยืนยันรหัสผ่านใหม่</span>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-bio-muted" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full rounded-xl border border-bio-line bg-bio-cream/60 py-3 pl-11 pr-4 text-sm text-bio-ink focus:border-bio-green focus:bg-white focus:outline-none"
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={isChecking || !hasRecoverySession || isLoading}
                className="w-full rounded-xl bg-bio-green py-3.5 text-sm font-bold text-white shadow-bio-btn transition-all hover:bg-bio-green-hover disabled:opacity-60"
              >
                {isLoading ? "กำลังบันทึก..." : "บันทึกรหัสผ่านใหม่"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
