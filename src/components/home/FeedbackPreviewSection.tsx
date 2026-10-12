import React from "react";
import Link from "next/link";
import { Feedback } from "@/lib/db/schema";
import { Button } from "@/components/ui/Button";
import { Star, MessageSquareQuote, ArrowRight, Sparkles } from "lucide-react";

interface FeedbackPreviewSectionProps {
  feedback: Feedback[];
}

export function FeedbackPreviewSection({ feedback }: FeedbackPreviewSectionProps) {
  if (!feedback || feedback.length === 0) return null;

  return (
    <section className="py-20 bg-white border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Student &amp; Trainee Reviews</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#10243A] tracking-tight">
              What Our Trainees Say
            </h2>
            <p className="text-base text-[#64748B]">
              Real feedback from students and clinical participants who experienced our hands-on biomedical equipment training programs.
            </p>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <Link href="/feedback">
              <Button
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                className="shadow-sm"
              >
                View All Reviews
              </Button>
            </Link>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {feedback.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="bg-[#F5F8FC] p-6 rounded-3xl border border-[#E2E8F0] flex flex-col justify-between hover:border-[#155EEF]/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="space-y-4">
                {/* Rating stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-4 h-4 ${
                          s <= item.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {item.rating}.0
                  </span>
                </div>

                {/* Message quote */}
                <div className="relative pl-5 pt-1">
                  <MessageSquareQuote className="w-4 h-4 text-slate-400 absolute left-0 top-1" />
                  <p className="text-sm text-[#172B4D] leading-relaxed italic line-clamp-4">
                    &quot;{item.message}&quot;
                  </p>
                </div>
              </div>

              {/* Reviewer Name */}
              <div className="pt-6 mt-6 border-t border-[#E2E8F0] flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#155EEF] to-[#0D9488] text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#10243A] text-sm">{item.name}</h4>
                  <p className="text-[11px] text-[#64748B]">Biomedical Trainee</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
