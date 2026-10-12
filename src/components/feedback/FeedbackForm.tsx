"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackFormSchema, FeedbackFormInput } from "@/lib/validation";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Star, CheckCircle, AlertCircle, RotateCcw, Send } from "lucide-react";

const ratingLabels: Record<number, string> = {
  1: "1 Star — Needs Improvement",
  2: "2 Stars — Fair Experience",
  3: "3 Stars — Good Training",
  4: "4 Stars — Very Good Experience",
  5: "5 Stars — Outstanding & Highly Recommended",
};

interface FeedbackFormProps {
  onSuccess?: () => void;
}

export function FeedbackForm({ onSuccess }: FeedbackFormProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormInput>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: {
      name: "",
      message: "",
      rating: 5,
      honeypot: "",
    },
  });

  const selectedRating = watch("rating") || 5;
  const currentDisplayRating = hoverRating || selectedRating;

  const onSubmit = async (data: FeedbackFormInput) => {
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.error || "Failed to submit feedback. Please check your connection."
        );
      }

      setSuccessMessage(
        json.message ||
          "Thank you for sharing your experience! Your feedback will appear on the website once approved by our moderation team."
      );
      reset({ name: "", message: "", rating: 5, honeypot: "" });
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred while submitting feedback.");
    }
  };

  const handleReset = () => {
    reset({ name: "", message: "", rating: 5, honeypot: "" });
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xl">
      <div className="mb-6">
        <h3 className="text-xl font-black text-[#10243A] tracking-tight">
          Share Your Experience
        </h3>
        <p className="text-sm text-[#64748B] mt-1">
          Have you attended an internship, workshop, or biomedical equipment training session with us? We appreciate your genuine review!
        </p>
      </div>

      {successMessage && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm mb-6 animate-fade-in">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Feedback Submitted Successfully!</p>
            <p className="mt-0.5 text-xs text-emerald-800">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-sm mb-6">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Anti-spam honeypot (hidden from screen readers & users) */}
        <div className="hidden" aria-hidden="true">
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("honeypot")}
          />
        </div>

        {/* Reviewer Name */}
        <FormField
          label="Your Full Name"
          required
          htmlFor="feedback-name"
          error={errors.name?.message}
        >
          <Input
            id="feedback-name"
            placeholder="e.g. S. Kumar / Dr. Ananya"
            {...register("name")}
          />
        </FormField>

        {/* Interactive Star Rating */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">
            Your Rating <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div
              className="flex items-center gap-1.5"
              role="radiogroup"
              aria-label="Star Rating from 1 to 5"
            >
              {[1, 2, 3, 4, 5].map((star) => {
                const isActive = star <= currentDisplayRating;
                return (
                  <button
                    key={star}
                    type="button"
                    role="radio"
                    aria-checked={selectedRating === star}
                    aria-label={`${star} Star${star > 1 ? "s" : ""}`}
                    className="p-1 rounded-lg hover:scale-110 active:scale-95 transition-transform focus:outline-none focus:ring-2 focus:ring-[#155EEF]/30"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(null)}
                    onClick={() => setValue("rating", star, { shouldValidate: true })}
                  >
                    <Star
                      className={`w-7 h-7 transition-colors ${
                        isActive
                          ? "fill-amber-400 text-amber-400 drop-shadow-sm"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <span className="text-xs font-semibold text-[#10243A] bg-amber-50 border border-amber-200/60 px-3 py-1 rounded-full">
              {ratingLabels[currentDisplayRating] || `${currentDisplayRating} Stars`}
            </span>
          </div>
          {errors.rating?.message && (
            <p className="mt-1.5 text-xs text-red-600 font-medium">
              {errors.rating.message}
            </p>
          )}
        </div>

        {/* Feedback Message */}
        <FormField
          label="Your Feedback / Review"
          required
          htmlFor="feedback-message"
          error={errors.message?.message}
        >
          <Textarea
            id="feedback-message"
            rows={4}
            placeholder="Tell us about the hands-on medical equipment handling, trainers, laboratory exposure, or what you learned..."
            {...register("message")}
          />
        </FormField>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            leftIcon={<Send className="w-4 h-4" />}
            isLoading={isSubmitting}
            className="shadow-md shadow-[#155EEF]/20"
          >
            Submit Feedback
          </Button>

          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleReset}
            leftIcon={<RotateCcw className="w-4 h-4" />}
          >
            Reset
          </Button>
        </div>
      </form>
    </div>
  );
}
