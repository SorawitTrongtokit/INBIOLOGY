"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  useEffect(() => {
    const supabase = createClient();

    void supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setAuthReady(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const navLinks = [
    { label: "หน้าหลัก", href: isHomePage ? "#top" : "/" },
    { label: "คอร์สเรียนทั้งหมด", href: "/courses" },
    { label: "เกี่ยวกับเรา", href: isHomePage ? "#about" : "/#about" },
    { label: "รีวิว", href: isHomePage ? "#reviews" : "/#reviews" },
    { label: "บทความ", href: isHomePage ? "#articles" : "/#articles" },
    { label: "ติดต่อเรา", href: isHomePage ? "#contact" : "/#contact" },
  ];

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut({ scope: "local" });
    setMobileMenuOpen(false);
  };

  const displayName =
    (user?.user_metadata.full_name as string | undefined)?.split(" ")[0] ??
    user?.email ??
    "บัญชีของฉัน";

  return (
    <header className="sticky top-0 z-50 bg-white/94 backdrop-blur-md border-b border-bio-line/80">
      <div className="max-w-[1180px] px-5 mx-auto h-[76px] flex items-center justify-between gap-[34px]">
        {/* Brand */}
        <Link
          href="/"
          className="relative text-[34px] font-extrabold text-bio-green tracking-tighter"
          aria-label="inbio home"
        >
          <span className="absolute -top-[1px] -right-1 text-xs text-[#69a94f] rotate-[-25deg]">
            ●
          </span>
          inbio
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-[28px] ml-auto">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`text-sm font-semibold transition-colors duration-200 ${
                pathname === link.href
                  ? "text-bio-green font-bold"
                  : "text-[#304138] hover:text-bio-green"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Buttons */}
        <div className="hidden lg:flex items-center gap-2.5">
          {authReady && user ? (
            <>
              <span className="max-w-40 truncate text-sm font-bold text-bio-ink">
                สวัสดี {displayName}
              </span>
              <button
                type="button"
                onClick={handleSignOut}
                className="bg-[#f5f7f5] text-[#20352a] hover:bg-bio-green-soft hover:text-bio-green rounded-[11px] px-[19px] py-[11px] font-bold text-sm transition-all"
              >
                ออกจากระบบ
              </button>
            </>
          ) : authReady ? (
            <>
              <Link
                href="/login"
                className="bg-[#f5f7f5] text-[#20352a] hover:bg-bio-green-soft hover:text-bio-green hover:-translate-y-0.5 rounded-[11px] px-[19px] py-[11px] font-bold text-sm transition-all"
              >
                เข้าสู่ระบบ
              </Link>
              <Link
                href="/register"
                className="bg-bio-green text-white hover:bg-bio-green-hover shadow-bio-btn hover:-translate-y-0.5 rounded-[11px] px-[19px] py-[11px] font-bold text-sm transition-all"
              >
                สมัครเรียน
              </Link>
            </>
          ) : null}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="lg:hidden p-2 text-bio-ink bg-none border-0 ml-auto"
          aria-expanded={mobileMenuOpen}
          aria-label="เปิดเมนู"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <div className="w-6 h-0.5 bg-[#173b28] my-[5px] transition-all"></div>
          <div className="w-6 h-0.5 bg-[#173b28] my-[5px] transition-all"></div>
          <div className="w-6 h-0.5 bg-[#173b28] my-[5px] transition-all"></div>
        </button>
      </div>

      {/* Mobile Drawer Nav */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute left-5 right-5 top-[76px] bg-white border border-bio-line rounded-2xl p-[18px] flex flex-col gap-3.5 shadow-bio animate-in fade-in slide-in-from-top-2 duration-200 z-50">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={handleNavClick}
                className="text-sm font-semibold text-[#304138] hover:text-bio-green py-1 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-col gap-2 pt-2 border-t border-bio-line">
            {authReady && user ? (
              <>
                <span className="truncate text-center text-sm font-bold text-bio-ink">
                  สวัสดี {displayName}
                </span>
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full bg-[#f5f7f5] text-[#20352a] rounded-[11px] py-2.5 font-bold text-sm text-center"
                >
                  ออกจากระบบ
                </button>
              </>
            ) : authReady ? (
              <>
                <Link
                  href="/login"
                  onClick={handleNavClick}
                  className="w-full bg-[#f5f7f5] text-[#20352a] rounded-[11px] py-2.5 font-bold text-sm text-center"
                >
                  เข้าสู่ระบบ
                </Link>
                <Link
                  href="/register"
                  onClick={handleNavClick}
                  className="w-full bg-bio-green text-white shadow-bio-btn rounded-[11px] py-2.5 font-bold text-sm text-center"
                >
                  สมัครเรียน
                </Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
};
