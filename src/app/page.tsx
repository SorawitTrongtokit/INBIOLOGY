import React from "react";
import { Header } from "@/components/Header";
import { HomeHero } from "@/components/HomeHero";
import { BenefitsSection } from "@/components/BenefitsSection";
import { CoursesSection } from "@/components/CoursesSection";
import { AboutSection } from "@/components/AboutSection";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ArticlesSection } from "@/components/ArticlesSection";
import { CtaSection } from "@/components/CtaSection";
import { Footer } from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen flex flex-col bg-white text-bio-ink" id="top">
      <Header initialUser={user} />
      <main className="flex-grow">
        <HomeHero />
        <BenefitsSection />
        <CoursesSection />
        <AboutSection />
        <ReviewsSection />
        <ArticlesSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
