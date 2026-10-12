import React from "react";
import { Metadata } from "next";
import { getApprovedFeedback } from "@/lib/db/queries/feedback";
import { getSiteSettings } from "@/lib/db/queries/site-settings";
import { FeedbackForm } from "@/components/feedback/FeedbackForm";
import { Star, MessageSquareQuote, ShieldCheck, Sparkles } from "lucide-react";

import { getAbsoluteUrl } from "@/lib/seo/site-url";

export const metadata: Metadata = {
  title: "Student & Customer Feedback | Meddrainn Healthcare",
  description:
    "Read genuine reviews and feedback from students and professionals who completed biomedical equipment training, internships, and workshops at Meddrainn Healthcare.",
  alternates: {
    canonical: getAbsoluteUrl("/feedback"),
  },
  openGraph: {
    title: "Student & Customer Feedback | Meddrainn Healthcare",
    description:
      "Read genuine reviews and training experiences from students, interns, and biomedical trainees at Meddrainn Healthcare.",
    url: getAbsoluteUrl("/feedback"),
  },
};

export const revalidate = 60;

export default async function FeedbackPage() {
  const [approvedFeedback, settings] = await Promise.all([
    getApprovedFeedback(50),
    getSiteSettings(),
  ]);

  const avgRating =
    approvedFeedback.length > 0
      ? (
          approvedFeedback.reduce((sum, item) => sum + item.rating, 0) /
          approvedFeedback.length
        ).toFixed(1)
      : "5.0";

  return (
    <div className="min-h-screen bg-[#F5F8FC] py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#155EEF]/10 border border-[#155EEF]/20 text-[#155EEF] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Real Student Experiences</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#10243A] tracking-tight">
            Student &amp; Customer Feedback
          </h1>

          <p className="text-base sm:text-lg text-[#64748B] leading-relaxed text-center !text-center mx-auto">
            Read authentic reviews from biomedical engineering students, hospital interns, and healthcare professionals who developed hands-on technical skills at Meddrainn Healthcare.
          </p>

          {/* Aggregate Rating Banner */}
          {approvedFeedback.length > 0 && (
            <div className="inline-flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-[#E2E8F0] shadow-sm">
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm font-black text-[#10243A]">
                {avgRating} / 5.0
              </span>
              <span className="text-xs text-[#64748B]">
                ({approvedFeedback.length} verified review{approvedFeedback.length > 1 ? "s" : ""})
              </span>
            </div>
          )}
        </div>

        {/* Two-Column Layout: Form + Reviews Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <FeedbackForm />
          </div>

          {/* Reviews Display Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#10243A]">
                Recent Verified Reviews ({approvedFeedback.length})
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-[#0D9488] font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Moderated &amp; Verified</span>
              </div>
            </div>

            {approvedFeedback.length > 0 ? (
              <div className="grid grid-cols-1 gap-5">
                {approvedFeedback.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#155EEF] to-[#0D9488] text-white flex items-center justify-center font-black text-sm uppercase shadow-sm">
                          {item.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="font-bold text-[#10243A] text-sm sm:text-base">
                            {item.name}
                          </h3>
                          <p className="text-[11px] text-[#64748B]">
                            {new Date(item.createdAt).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= item.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="relative pl-6 pt-1">
                      <MessageSquareQuote className="w-4 h-4 text-slate-300 absolute left-0 top-1" />
                      <p className="text-sm text-[#172B4D] leading-relaxed italic">
                        &quot;{item.message}&quot;
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl border border-[#E2E8F0] text-center space-y-3">
                <Star className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="font-bold text-[#10243A]">No Reviews Displayed Yet</h3>
                <p className="text-sm text-[#64748B] max-w-sm mx-auto">
                  Be the first to share your training feedback using the review form on this page!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
