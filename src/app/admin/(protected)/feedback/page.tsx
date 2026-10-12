import React from "react";
import { getAllFeedbackAdmin } from "@/lib/db/queries/feedback";
import { FeedbackManager } from "@/components/admin/FeedbackManager";

export default async function AdminFeedbackPage() {
  const result = await getAllFeedbackAdmin();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#10243A] tracking-tight">
          Student &amp; Customer Feedback
        </h1>
        <p className="text-sm text-[#64748B] mt-1">
          Review, moderate, approve, or hide feedback submitted by students and clinical trainees.
        </p>
      </div>

      <FeedbackManager
        initialFeedback={result.feedback}
        totalCount={result.total}
      />
    </div>
  );
}
