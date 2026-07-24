"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { useArticle, useArticles } from "@/hooks/useCatalog";
import {
  ArrowLeft,
  Clock,
  Calendar,
  User,
  Share2,
  Check,
  BookOpen,
  ArrowRight,
  Sparkles,
  Dna,
  HeartPulse,
  Leaf,
  GraduationCap,
} from "lucide-react";

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "";
  const { data: article, isLoading, error } = useArticle(slug);
  const { data: allArticles } = useArticles();
  const [copied, setCopied] = useState(false);

  const relatedArticles = (allArticles || [])
    .filter((a) => a.id !== slug && a.id !== article?.id)
    .slice(0, 3);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "dna":
        return <Dna className="w-8 h-8 text-bio-green stroke-[1.8]" />;
      case "heart-pulse":
        return <HeartPulse className="w-8 h-8 text-bio-green stroke-[1.8]" />;
      case "leaf":
        return <Leaf className="w-8 h-8 text-bio-green stroke-[1.8]" />;
      default:
        return <BookOpen className="w-8 h-8 text-bio-green stroke-[1.8]" />;
    }
  };

  const renderContent = (content: string) => {
    const paragraphs = content.split("\n\n");
    return paragraphs.map((para, index) => {
      const trimmed = para.trim();
      if (!trimmed) return null;

      // Heading 3
      if (trimmed.startsWith("### ")) {
        return (
          <h3
            key={index}
            className="text-xl sm:text-2xl font-extrabold text-bio-dark mt-8 mb-4 border-l-4 border-bio-green pl-3"
          >
            {trimmed.replace(/^###\s+/, "")}
          </h3>
        );
      }

      // Heading 4
      if (trimmed.startsWith("#### ")) {
        return (
          <h4
            key={index}
            className="text-lg font-extrabold text-bio-ink mt-6 mb-3"
          >
            {trimmed.replace(/^####\s+/, "")}
          </h4>
        );
      }

      // Blockquote / Tip box
      if (trimmed.startsWith("> ")) {
        const text = trimmed.replace(/^>\s+/, "");
        return (
          <div
            key={index}
            className="my-6 p-5 bg-bio-green-soft/70 border border-bio-green/30 rounded-2xl text-bio-dark text-sm leading-relaxed"
          >
            {renderFormattedText(text)}
          </div>
        );
      }

      // Table formatting
      if (trimmed.includes("|") && trimmed.includes("---")) {
        const rows = trimmed
          .split("\n")
          .filter((r) => r.trim() && !r.includes("---"));
        if (rows.length > 0) {
          const headerCells = rows[0]
            .split("|")
            .filter((c) => c.trim() !== "")
            .map((c) => c.trim());
          const bodyRows = rows.slice(1).map((r) =>
            r
              .split("|")
              .filter((c) => c.trim() !== "")
              .map((c) => c.trim()),
          );

          return (
            <div key={index} className="my-6 overflow-x-auto rounded-2xl border border-bio-line shadow-sm">
              <table className="w-full text-xs sm:text-sm text-left">
                <thead className="bg-[#eef5f0] text-bio-dark font-extrabold border-b border-bio-line">
                  <tr>
                    {headerCells.map((cell, idx) => (
                      <th key={idx} className="p-3.5 sm:p-4">
                        {renderFormattedText(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#edf3ee] bg-white">
                  {bodyRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-[#f8faf8]">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3.5 sm:p-4 text-[#4a5c50]">
                          {renderFormattedText(cell)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
      }

      // Bullet List
      if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
        const items = trimmed.split("\n").map((item) => item.replace(/^[*|-]\s+/, ""));
        return (
          <ul key={index} className="my-4 space-y-2.5 pl-2">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="flex items-start gap-2.5 text-sm sm:text-base text-[#415247] leading-relaxed">
                <span className="w-2 h-2 rounded-full bg-bio-green shrink-0 mt-2" />
                <span>{renderFormattedText(item)}</span>
              </li>
            ))}
          </ul>
        );
      }

      // Numbered List
      if (/^\d+\.\s+/.test(trimmed)) {
        const items = trimmed.split("\n").map((item) => item.replace(/^\d+\.\s+/, ""));
        return (
          <ol key={index} className="my-4 space-y-2.5 pl-2">
            {items.map((item, iIdx) => (
              <li key={iIdx} className="flex items-start gap-3 text-sm sm:text-base text-[#415247] leading-relaxed">
                <span className="w-5 h-5 rounded-full bg-bio-green-soft text-bio-green font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {iIdx + 1}
                </span>
                <span>{renderFormattedText(item)}</span>
              </li>
            ))}
          </ol>
        );
      }

      // Horizontal Rule
      if (trimmed === "---") {
        return <hr key={index} className="my-8 border-t border-bio-line" />;
      }

      // Normal Paragraph
      return (
        <p key={index} className="my-4 text-sm sm:text-base text-[#3b4c41] leading-relaxed">
          {renderFormattedText(trimmed)}
        </p>
      );
    });
  };

  const renderFormattedText = (text: string) => {
    // Basic inline bold formatting (**text**)
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-extrabold text-bio-dark">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fbfdfb] text-bio-ink font-sans">
      <Header />

      <main className="flex-1 pb-20">
        {/* Breadcrumb & Navigation */}
        <section className="bg-[#f2f7f4] border-b border-bio-line py-4 px-5">
          <div className="max-w-[860px] mx-auto flex items-center justify-between gap-4 text-xs font-semibold text-[#67796d]">
            <div className="flex items-center gap-2 flex-wrap">
              <Link href="/" className="hover:text-bio-green">
                หน้าหลัก
              </Link>
              <span>/</span>
              <Link href="/articles" className="hover:text-bio-green">
                บทความ
              </Link>
              <span>/</span>
              <span className="text-bio-green font-bold truncate max-w-[200px] sm:max-w-none">
                {article?.title || "รายละเอียดบทความ"}
              </span>
            </div>
            <Link
              href="/articles"
              className="inline-flex items-center gap-1.5 text-bio-green font-bold hover:underline shrink-0"
            >
              <ArrowLeft className="w-4 h-4" /> ย้อนกลับ
            </Link>
          </div>
        </section>

        {isLoading ? (
          <div className="max-w-[860px] mx-auto px-5 pt-12 space-y-6">
            <div className="h-10 animate-pulse bg-[#eaf2eb] rounded-xl w-3/4" />
            <div className="h-6 animate-pulse bg-[#eaf2eb] rounded-xl w-1/2" />
            <div className="h-64 animate-pulse bg-[#eaf2eb] rounded-2xl w-full" />
          </div>
        ) : error || !article ? (
          <div className="max-w-[860px] mx-auto px-5 pt-16 text-center">
            <div className="bg-white rounded-3xl p-12 border border-bio-line shadow-sm max-w-md mx-auto">
              <BookOpen className="w-12 h-12 text-bio-green mx-auto mb-4" />
              <h2 className="text-xl font-bold text-bio-ink mb-2">
                ไม่พบบทความที่คุณกำลังตามหา
              </h2>
              <p className="text-xs text-[#6a7c70] mb-6">
                บทความอาจถูกลบหรือย้ายที่อยู่ หรือท่านระบุลิงก์ไม่ถูกต้อง
              </p>
              <Link
                href="/articles"
                className="px-6 py-3 bg-bio-green text-white font-extrabold text-xs rounded-xl hover:bg-bio-green-2 transition-colors inline-flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> กลับสู่คลังบทความ
              </Link>
            </div>
          </div>
        ) : (
          <article className="max-w-[860px] mx-auto px-5 pt-10">
            {/* Header / Meta */}
            <header className="mb-8 border-b border-bio-line pb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3.5 py-1 bg-bio-green-soft text-bio-green font-extrabold text-xs rounded-full">
                  {article.category}
                </span>
                <span className="text-xs text-[#75877b] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-bio-green" />
                  {article.readTime || "5 นาทีในการอ่าน"}
                </span>
                {article.publishedAt && (
                  <span className="text-xs text-[#75877b] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-bio-green" />
                    {article.publishedAt}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-bio-dark leading-tight mb-5">
                {article.title}
              </h1>

              {/* Author & Share Bar */}
              <div className="flex items-center justify-between flex-wrap gap-4 pt-4 border-t border-[#f0f4f1]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-bio-green-soft border border-bio-green/30 flex items-center justify-center text-bio-green font-bold text-sm">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-extrabold text-bio-ink">
                      {article.author || "ดร.วิภาวี กิจเจริญ (ครูพี่อิน)"}
                    </h4>
                    <p className="text-[11px] text-[#728578]">
                      ผู้เชี่ยวชาญด้านชีววิทยา INBIO
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-[#d6e5da] rounded-xl text-xs font-bold text-[#4c5e52] hover:bg-bio-green-soft hover:text-bio-green transition-all shadow-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-bio-green" /> คัดลอกลิงก์แล้ว!
                    </>
                  ) : (
                    <>
                      <Share2 className="w-4 h-4" /> แชร์บทความ
                    </>
                  )}
                </button>
              </div>
            </header>

            {/* Excerpt Box */}
            <div className="mb-8 p-6 bg-gradient-to-r from-bio-green-soft/80 to-[#edf7f0] rounded-2xl border border-bio-green/20">
              <h4 className="text-xs font-extrabold text-bio-green tracking-wider uppercase mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> สรุปสาระสำคัญ (Key Summary)
              </h4>
              <p className="text-sm font-semibold text-bio-dark leading-relaxed">
                {article.excerpt}
              </p>
            </div>

            {/* Icon / Hero Visual */}
            <div className="my-8 p-10 bg-gradient-to-br from-[#eaf4ed] via-[#f2f8f4] to-[#e4f2e7] rounded-3xl border border-bio-line flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-3">
                {getIcon(article.icon)}
              </div>
              <span className="text-xs font-extrabold text-bio-green tracking-widest uppercase">
                INBIO BIOLOGY ARTICLE
              </span>
            </div>

            {/* Main Content Body */}
            <div className="prose max-w-none mb-12">
              {renderContent(article.content ?? "")}
            </div>

            {/* In-article Course Banner */}
            <div className="my-12 p-8 bg-gradient-to-br from-[#125c3e] to-[#2c7a55] rounded-3xl text-white shadow-lg grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              <div className="md:col-span-8">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-bold text-bio-green-soft mb-3">
                  <GraduationCap className="w-4 h-4" /> ติวเข้มชีววิทยา ม.ปลาย
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-2">
                  ต้องการสรุปเนื้อหาชีวะแบบเต็มบท พร้อมลุยโจทย์?
                </h3>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  เรียนกับ ดร.วิภาวี (ครูพี่อิน) เข้าใจกลไก ไม่ต้องท่องจำแบบนกแก้วนกขุนทอง
                </p>
              </div>
              <div className="md:col-span-4 flex justify-start md:justify-end">
                <Link
                  href="/courses"
                  className="px-5 py-3 bg-white text-bio-dark hover:bg-bio-green-soft font-extrabold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
                >
                  ดูคอร์สเรียนชีวะ <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Related Articles Section */}
            {relatedArticles.length > 0 && (
              <section className="pt-10 border-t border-bio-line mt-12">
                <h3 className="text-xl font-extrabold text-bio-ink mb-6 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-bio-green" /> บทความที่คุณอาจสนใจ
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {relatedArticles.map((rel) => (
                    <Link
                      key={rel.id}
                      href={`/articles/${rel.slug}`}
                      className="bg-white p-5 rounded-2xl border border-bio-line hover:border-bio-green/40 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[11px] font-bold text-bio-green block mb-1.5">
                          {rel.category}
                        </span>
                        <h4 className="text-sm font-extrabold text-bio-ink leading-snug group-hover:text-bio-green transition-colors line-clamp-2 mb-2">
                          {rel.title}
                        </h4>
                        <p className="text-xs text-[#63756a] line-clamp-2 leading-relaxed">
                          {rel.excerpt}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#f0f4f1] text-bio-green font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        อ่านบทความ <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>
        )}
      </main>

      <Footer />
    </div>
  );
}
