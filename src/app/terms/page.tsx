import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { FileText, ShieldCheck, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "ข้อกำหนดการใช้งาน | inbio",
  description: "ข้อกำหนดและเงื่อนไขการใช้งานบริการ inbio แพลตฟอร์มเรียนชีววิทยาออนไลน์",
};

const sections = [
  {
    title: "1. ข้อมูลทั่วไปและขอบเขตการใช้บริการ",
    body: `บริการ inbio ("บริการ") ดำเนินงานโดย บริษัท อินไบโอ เลิร์นนิ่ง จำกัด ("บริษัท") เว็บไซต์และแอปพลิเคชันภายใต้โดเมน inbio.ac.th ให้บริการคอร์สเรียนวิชาชีววิทยาสำหรับนักเรียนระดับมัธยมศึกษาตอนปลายในประเทศไทย การเข้าใช้งานบริการถือว่าท่านยอมรับข้อกำหนดเหล่านี้ทั้งหมด`,
  },
  {
    title: "2. เงื่อนไขการสมัครสมาชิก",
    body: `ผู้ใช้บริการต้องมีอายุไม่ต่ำกว่า 13 ปี หรือหากอายุต่ำกว่า 18 ปีต้องได้รับความยินยอมจากผู้ปกครอง ท่านต้องให้ข้อมูลที่ถูกต้อง เป็นความจริง และเป็นปัจจุบันในการสมัครสมาชิก ท่านต้องรักษาความลับของชื่อผู้ใช้และรหัสผ่าน และแจ้งบริษัทหากพบการใช้งานบัญชีโดยไม่ได้รับอนุญาต`,
  },
  {
    title: "3. สิทธิ์การเข้าถึงเนื้อหา",
    body: `เมื่อชำระค่าบริการสำหรับคอร์สใดๆ ท่านได้รับสิทธิ์เข้าถึงเนื้อหาของคอร์สนั้นเป็นการส่วนตัว ไม่สามารถโอน แชร์ หรืออนุญาตให้บุคคลอื่นใช้บัญชีของท่านได้ สิทธิ์การเข้าถึงอาจมีกำหนดระยะเวลาตามที่ระบุในแต่ละคอร์ส บริษัทขอสงวนสิทธิ์ในการปรับเปลี่ยนหรือระงับการให้บริการโดยแจ้งล่วงหน้าเมื่อเป็นไปได้`,
  },
  {
    title: "4. ทรัพย์สินทางปัญญา",
    body: `เนื้อหาทั้งหมดบนแพลตฟอร์ม ได้แก่ คลิปวิดีโอ เอกสาร PDF ภาพประกอบ ข้อสอบ และข้อความ เป็นทรัพย์สินของบริษัทหรือผู้สอน ห้ามทำซ้ำ ดาวน์โหลด บันทึกหน้าจอ หรือเผยแพร่เนื้อหาโดยไม่ได้รับอนุญาตเป็นลายลักษณ์อักษร`,
  },
  {
    title: "5. พฤติกรรมที่ยอมรับได้",
    body: `ท่านตกลงที่จะไม่ใช้บริการในทางที่ผิดกฎหมาย รบกวนระบบ หรือกระทำการที่เป็นอันตรายต่อผู้ใช้รายอื่น บริษัทขอสงวนสิทธิ์ในการระงับบัญชีของผู้ที่ฝ่าฝืนข้อกำหนด`,
  },
  {
    title: "6. การจำกัดความรับผิด",
    body: `บริษัทไม่รับผิดชอบต่อความเสียหายทางอ้อม หรือการสูญเสียโอกาสที่เกิดขึ้นจากการใช้บริการ บริษัทพยายามอย่างเต็มที่เพื่อให้บริการพร้อมใช้งาน แต่ไม่รับประกันความต่อเนื่องของบริการ 100%`,
  },
  {
    title: "7. การปรับปรุงข้อกำหนด",
    body: `บริษัทอาจปรับปรุงข้อกำหนดเหล่านี้เป็นครั้งคราว โดยจะแจ้งให้ท่านทราบผ่านทางอีเมลหรือหน้าเว็บไซต์ การใช้บริการต่อเนื่องหลังจากการแจ้งดังกล่าวถือเป็นการยอมรับข้อกำหนดที่ปรับปรุงแล้ว`,
  },
  {
    title: "8. กฎหมายที่บังคับใช้",
    body: `ข้อกำหนดเหล่านี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทใดๆ ให้อยู่ในเขตอำนาจของศาลไทย`,
  },
];

export default function TermsPage() {
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
              <FileText className="w-6 h-6 text-bio-green" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-bio-ink leading-tight">
                ข้อกำหนดการใช้งาน
              </h1>
              <p className="text-xs text-bio-muted mt-1">
                อัปเดตล่าสุด: กรกฎาคม 2569 — มีผลบังคับใช้ทันที
              </p>
            </div>
          </div>

          {/* Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-10 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 leading-relaxed font-medium">
              กรุณาอ่านข้อกำหนดการใช้งานนี้อย่างละเอียดก่อนใช้บริการ
              การสมัครสมาชิกหรือการใช้บริการ inbio ถือว่าท่านได้อ่านและยอมรับข้อกำหนดเหล่านี้แล้ว
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
          <div className="mt-8 p-6 bg-bio-green-soft border border-bio-green/20 rounded-2xl text-center">
            <p className="text-xs text-bio-ink font-medium">
              หากมีข้อสงสัยเกี่ยวกับข้อกำหนดเหล่านี้ กรุณาติดต่อเราได้ที่{" "}
              <a
                href="mailto:hello@inbio.ac.th"
                className="font-bold text-bio-green hover:underline"
              >
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
