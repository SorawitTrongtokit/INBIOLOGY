"use client";

import React, { useState } from "react";
import { HeroSection } from "./HeroSection";
import { PreviewModal } from "./PreviewModal";

export const HomeHero = () => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <>
      <HeroSection onOpenPreview={() => setIsPreviewOpen(true)} />
      <PreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
      />
    </>
  );
};
