import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ShieldCheck, ArrowLeft, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "นโยบายความเป็นส่วนตัว | inbio",
  description: "นโยบายความเป็นส่วนตัวและการคุ้มครองข้อมูลส่วนบุคคล (PDPA) ของ inbio แพลตฟอร์มเรียนชีววิทยาออนไลน์",
};

const sections = [
  {
    title: "1. ข้อมูลที่เราเก็บรวบรวม",
    body: `เราเก็บรวบรวมข้อมูลที่จำเป็นต่อการให้บริการ ได้แก่ (1) ข้อมูลที่ท่านให้โดยตรง เช่น ชื่อ-นามสกุล อีเมล เบอร์โทรศัพท์ ระดับชั้น และรหัสผ่าน (เก็บในรูปแบบแฮช) (2) ข้อมูลการใช้งาน เช่น ความคืบหน้าการเรียน บทเรียนที่รับชม และโน้ตส่วนตัว (3) ข้อมูลทางเทคนิค เช่น IP address ประเภทเบราว์เซอร์ และเวลาการเข้าใช้`,
  },
  {
    title: "2. วัตถุประสงค์ในการใช้ข้อมูล",
    body: `เราใช้ข้อมูลของท่านเพื่อ (1) ให้บริการ ติดตาม และปรับปรุงประสบการณ์การเรียน (2) ติดต่อสื่อสารเกี่ยวกับบัญชีหรือคอร์สเรียน (3) วิเคราะห์ประสิทธิภาพของเนื้อหาเพื่อปรับปรุงหลักสูตร (4) ปฏิบัติตามข้อกำหนดทางกฎหมาย`,
  },
  {
    title: "3. ฐานทางกฎหมายในการประมวลผลข้อมูล (PDPA)",
    body: `บริษัทดำเนินการประมวลผลข้อมูลส่วนบุคคลภายใต้พระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562 (PDPA) โดยอาศัยฐาน (1) ความยินยอม (Consent) สำหรับการส่งข้อมูลการตลาด (2) การปฏิบัติตามสัญญา (Contract) สำหรับการให้บริการคอร์สเรียน (3) ประโยชน์โดยชอบด้วยกฎหมาย (Legitimate Interest) สำหรับการพัฒนาบริการ`,
  },
  {
    title: "4. การแบ่งปันข้อมูล",
    body: `เราไม่ขาย เช่า หรือแบ่งปันข้อมูลส่วนบุคคลของท่านให้แก่บุคคลที่สามเพื่อวัตถุประสงค์ทางการตลาด เราอาจเปิดเผยข้อมูลเท่าที่จำเป็นแก่ผู้ให้บริการโครงสร้างพื้นฐาน เช่น Supabase (ฐานข้อมูลและการยืนยันตัวตน) ซึ่งได้รับการคัดเลือกตามมาตรฐานการรักษาความปลอดภัยสูง`,
  },
  {
    title: "5. ระยะเวลาการเก็บรักษาข้อมูล",
    body: `เราเก็บข้อมูลส่วนบุคคลของท่านตลอดระยะเวลาที่ท่านมีบัญชีกับเรา และอาจเก็บต่อไปสูงสุด 3 ปีหลังจากการยกเลิกบัญชี เพื่อวัตถุประสงค์ทางกฎหมายและการบัญชี ข้อมูลที่ไม่จำเป็นจะถูกลบหรือทำให้ไม่ระบุตัวตนได้`,
  },
  {
    title: "6. สิทธิ์ของเจ้าของข้อมูล",
    body: `ท่านมีสิทธิ์ตาม PDPA ดังต่อไปนี้: (1) สิทธิ์ในการเข้าถึงและรับสำเนาข้อมูล (2) สิทธิ์แก้ไขข้อมูลให้ถูกต้อง (3) สิทธิ์ขอลบข้อมูล (Right to Erasure) (4) สิทธิ์คัดค้านการประมวลผล (5) สิทธิ์ขอให้ระงับการประมวลผล หากต้องการใช้สิทธิ์เหล่านี้ กรุณาติดต่อ hello@inbio.ac.th`,
  },
  {
    title: "7. ความปลอดภัยของข้อมูล",
    body: `เราใช้มาตรการรักษาความปลอดภัยที่เหมาะสม ได้แก่ การเข้ารหัส SSL/TLS สำหรับข้อมูลระหว่างส่ง การเก็บรหัสผ่านในรูปแบบแฮช (bcrypt) การตรวจสอบสิทธิ์แบบ Row-Level Security (RLS) ใน Supabase และการจำกัดการเข้าถึงข้อมูลตามหลักการ least privilege`,
  },
  {
    title: "8. Cookies และการติดตาม",
    body: `เราใช้ cookies ที่จำเป็นสำหรับการยืนยันตัวตนและรักษา session การใช้งาน เราไม่ใช้ cookies เพื่อการติดตามพฤติกรรมสำหรับโฆษณา`,
  },
  {
    title: "9. การเปลี่ยนแปลงนโยบาย",
    body: `หากเราเปลี่ยนแปลงนโยบายนี้อย่างมีนัยสำคัญ เราจะแจ้งให้ท่านทราบผ่านอีเมลหรือประกาศบนเว็บไซต์ล่วงหน้าอย่างน้อย 30 วัน`,
  },
  {
    title: "10. ผู้ควบคุมข้อมูลและการติดต่อ",
    body: `ผู้ควบคุมข้อมูลส่วนบุคคล: บริษัท อินไบโอ เลิร์นนิ่ง จำกัด อีเมล: hello@inbio.ac.th สำหรับการร้องเรียนหรือใช้สิทธิ์ตาม PDPA กรุณาติดต่อที่อีเมลข้างต้น เราจะตอบกลับภายใน 30 วัน`,
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8]">
      <Header />
      <main className="flex-grow py-12 sm:py-16 px-5">
        <div className="max-w-[860px] mx-auto">
          {/* Back */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-bio-muted hover:text-bio-green font-semibold mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> กลับหน้าหลัก
          </Link>

          {/* Header */}
          <div className="flex items-start gap-4 mb-10">
            <div className="w-12 h-12 rounded-2xl bg-bio-green-soft grid place-items-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-bio-green" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-bio-ink leading-tight">
                นโยบายความเป็นส่วนตัว
              </h1>
              <p className="text-xs text-bio-muted mt-1">
                อัปเดตล่าสุด: กรกฎาคม 2569 — สอดคล้องกับ PDPA พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล พ.ศ. 2562
              </p>
            </div>
          </div>

          {/* PDPA Badge */}
          <div className="bg-bio-green-soft border border-bio-green/20 rounded-2xl p-5 mb-10 flex items-start gap-3">
            <Lock className="w-5 h-5 text-bio-green shrink-0 mt-0.5" />
            <p className="text-xs text-bio-ink leading-relaxed font-medium">
              inbio ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคลของท่านตามพระราชบัญญัติคุ้มครองข้อมูลส่วนบุคคล
              (PDPA) พ.ศ. 2562 และมาตรฐานสากล
            </p>
          </div>

          {/* Sections */}
          <div className="bg-white border border-bio-line rounded-2xl divide-y divide-bio-line shadow-sm">
            {sections.map((section) => (
              <div key={section.title} className="p-6 sm:p-8">
                <h2 className="text-base font-extrabold text-bio-ink mb-3">
                  {section.title}
                </h2>
                <p className="text-sm text-bio-muted leading-relaxed">{section.body}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          <div className="mt-8 p-6 bg-bio-cream border border-bio-line rounded-2xl text-center space-y-2">
            <p className="text-xs font-bold text-bio-ink">
              ติดต่อผู้ควบคุมข้อมูลส่วนบุคคล (Data Controller)
            </p>
            <p className="text-xs text-bio-muted">
              อีเมล:{" "}
              <a href="mailto:hello@inbio.ac.th" className="font-bold text-bio-green hover:underline">
                hello@inbio.ac.th
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
