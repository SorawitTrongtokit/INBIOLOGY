"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { BenefitsSection } from "@/components/BenefitsSection";
import { CoursesSection } from "@/components/CoursesSection";
import { AboutSection } from "@/components/AboutSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { PreviewModal } from "@/components/PreviewModal";

export default function HomePage() {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white text-bio-ink" id="top">
      <Header />
      <main className="flex-grow">
        <HeroSection onOpenPreview={() => setIsPreviewOpen(true)} />
        <BenefitsSection />
        <CoursesSection />
        <AboutSection />
        <ReviewsSection />
        <ArticlesSection />
        <CtaSection />
      </main>
      <Footer />
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </div>
  );
}
