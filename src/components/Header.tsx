"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import {
  BookOpen,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  UserRound,
  X,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type NavLink = {
  label: string;
  href: string;
  section?: string;
};

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const isHomePage = pathname === "/";

  const navLinks: NavLink[] = [
    { label: "หน้าหลัก", href: isHomePage ? "#top" : "/" },
    { label: "คอร์สเรียน", href: "/courses" },
    {
      label: "เกี่ยวกับเรา",
      href: isHomePage ? "#about" : "/#about",
      section: "about",
    },
    {
      label: "รีวิวผู้เรียน",
      href: isHomePage ? "#reviews" : "/#reviews",
      section: "reviews",
    },
    {
      label: "บทความ",
      href: isHomePage ? "#articles" : "/#articles",
      section: "articles",
    },
  ];

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileMenuOpen]);

  const isActive = (link: NavLink) => {
    if (link.section) return false;
    if (link.href === "/courses") return pathname.startsWith("/courses");
    if (link.href === "/" || link.href === "#top") return pathname === "/";
    return pathname === link.href;
  };

  const handleSignOut = async () => {
    if (isSigningOut) return;
    setIsSigningOut(true);
    const { error } = await createClient().auth.signOut({ scope: "local" });
    setIsSigningOut(false);

    if (!error) {
      setMobileMenuOpen(false);
      router.replace("/");
      router.refresh();
    }
  };

  const displayName =
    user?.user_metadata?.full_name?.trim() || user?.email?.split("@")[0];

  return (
    <header className="sticky top-0 z-50 border-b border-bio-line/80 bg-white/95 shadow-[0_1px_12px_rgba(15,76,42,0.04)] backdrop-blur-xl">
      <div className="mx-auto flex h-[70px] max-w-[1180px] items-center gap-5 px-5">
        <Link
          href="/"
          className="relative shrink-0 text-[32px] font-extrabold tracking-tighter text-bio-green"
          aria-label="กลับหน้าหลัก inbio"
        >
          <span className="absolute -right-1 -top-px rotate-[-25deg] text-xs text-[#69a94f]">
            ●
          </span>
          inbio
        </Link>

        <nav
          className="ml-auto hidden items-center gap-1 lg:flex"
          aria-label="เมนูหลัก"
        >
          {navLinks.map((link) => {
            const active = isActive(link);
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-bio-green-soft text-bio-green"
                    : "text-[#405147] hover:bg-bio-cream hover:text-bio-green"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden min-w-[180px] items-center justify-end gap-2 lg:flex">
          {!isAuthReady ? (
            <div
              className="h-10 w-36 animate-pulse rounded-xl bg-bio-cream"
              aria-label="กำลังตรวจสอบสถานะผู้ใช้"
            />
          ) : user ? (
            <>
              <div
                className="flex min-w-0 items-center gap-2 rounded-xl border border-bio-line bg-[#f8faf8] px-3 py-2"
                title={user.email}
              >
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-bio-green-soft text-bio-green">
                  <UserRound className="h-4 w-4" />
                </span>
                <span className="max-w-24 truncate text-xs font-bold text-bio-ink">
                  {displayName}
                </span>
              </div>
              {user.app_metadata?.role === "admin" && (
                <Link
                  href="/admin"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-bio-line text-bio-green transition-colors hover:bg-bio-green-soft"
                  aria-label="เปิดศูนย์จัดการ Admin"
                  title="Admin Center"
                >
                  <ShieldCheck className="h-4 w-4" />
                </Link>
              )}
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-bio-green px-4 py-2.5 text-sm font-bold text-white shadow-bio-btn transition-all hover:-translate-y-0.5 hover:bg-bio-green-hover"
              >
                <LayoutDashboard className="h-4 w-4" />
                ห้องเรียน
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                aria-label="ออกจากระบบ"
                title="ออกจากระบบ"
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-bio-muted transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2.5 text-sm font-bold text-[#304138] transition-colors hover:bg-bio-cream hover:text-bio-green"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-xl bg-bio-green px-4 py-2.5 text-sm font-bold text-white shadow-bio-btn transition-all hover:-translate-y-0.5 hover:bg-bio-green-hover"
              >
                สมัครสมาชิก
                <ChevronRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="ml-auto grid h-11 w-11 place-items-center rounded-xl border border-bio-line bg-white text-bio-ink transition-colors hover:bg-bio-cream lg:hidden"
          aria-expanded={mobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={mobileMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <>
          <button
            type="button"
            className="fixed inset-0 top-[70px] z-40 bg-[#102619]/25 backdrop-blur-[2px] lg:hidden"
            aria-label="ปิดเมนู"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            id="mobile-navigation"
            className="absolute left-0 right-0 top-[70px] z-50 border-b border-bio-line bg-white px-5 pb-6 pt-3 shadow-xl lg:hidden"
          >
            <div className="mx-auto max-w-[620px]">
              {isAuthReady && user && (
                <div className="mb-3 flex items-center gap-3 rounded-2xl bg-bio-cream/70 p-3.5">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-bio-green text-white">
                    <UserRound className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="m-0 truncate text-sm font-extrabold text-bio-ink">
                      {displayName}
                    </p>
                    <p className="m-0 truncate text-[11px] text-bio-muted">
                      {user.email}
                    </p>
                  </div>
                </div>
              )}

              <nav
                className="grid grid-cols-1 gap-1 sm:grid-cols-2"
                aria-label="เมนูมือถือ"
              >
                {navLinks.map((link) => {
                  const active = isActive(link);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-11 items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-bold transition-colors ${
                        active
                          ? "bg-bio-green-soft text-bio-green"
                          : "text-[#304138] hover:bg-bio-cream"
                      }`}
                    >
                      {link.label}
                      <ChevronRight className="h-4 w-4 opacity-45" />
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-3 border-t border-bio-line pt-3">
                {!isAuthReady ? (
                  <div className="h-11 w-full animate-pulse rounded-xl bg-bio-cream" />
                ) : user ? (
                  <div className="space-y-2">
                    {user.app_metadata?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-bio-green/20 bg-bio-green-soft px-4 text-sm font-bold text-bio-green"
                      >
                        <ShieldCheck className="h-4 w-4" />
                        เปิดศูนย์จัดการ Admin
                      </Link>
                    )}
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <Link
                        href="/dashboard"
                        onClick={() => setMobileMenuOpen(false)}
                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-bio-green px-4 text-sm font-bold text-white shadow-bio-btn"
                      >
                        <BookOpen className="h-4 w-4" />
                        ไปที่ห้องเรียนของฉัน
                      </Link>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        disabled={isSigningOut}
                        className="inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border border-rose-200 px-4 text-sm font-bold text-rose-600 disabled:opacity-50"
                      >
                        <LogOut className="h-4 w-4" />
                        ออก
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-bio-line text-sm font-bold text-bio-ink"
                    >
                      เข้าสู่ระบบ
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl bg-bio-green text-sm font-bold text-white shadow-bio-btn"
                    >
                      สมัครสมาชิก
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
