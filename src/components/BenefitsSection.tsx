import React from "react";
import { BENEFITS_DATA } from "@/data/mockData";
import {
  BookOpen,
  FileCheck2,
  Video,
  MessageSquare,
  TrendingUp,
} from "lucide-react";

export const BenefitsSection: React.FC = () => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "book":
        return <BookOpen className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      case "file-text":
        return <FileCheck2 className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      case "video":
        return <Video className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      case "message":
        return <MessageSquare className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      case "trending":
        return <TrendingUp className="w-7 h-7 text-bio-green stroke-[1.8]" />;
      default:
        return <BookOpen className="w-7 h-7 text-bio-green stroke-[1.8]" />;
    }
  };

  return (
    <section className="-mt-[66px] relative z-10">
      <div className="max-w-[1180px] px-3.5 sm:px-5 mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 bg-white border border-[#ebefeb] rounded-[22px] shadow-bio overflow-hidden">
          {BENEFITS_DATA.map((benefit, index) => (
            <article
              key={benefit.id}
              className={`flex flex-col items-center text-center p-5 sm:p-7 border-r border-[#edf0ed] last:border-r-0 ${
                index === 4 ? "col-span-2 md:col-span-1" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-xl bg-bio-green-soft flex items-center justify-center mb-2.5">
                {getIcon(benefit.icon)}
              </div>
              <h3 className="text-sm font-bold mt-1 mb-0.5 text-bio-ink">
                {benefit.title}
              </h3>
              <p className="text-[11px] text-bio-muted m-0">{benefit.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
