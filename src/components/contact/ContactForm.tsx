"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { enquiryFormSchema, EnquiryFormInput } from "@/lib/validation";
import { FormField } from "../ui/FormField";
import { Input } from "../ui/Input";
import { Textarea } from "../ui/Textarea";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { CheckCircle2, AlertCircle, Send, User, Mail, Phone } from "lucide-react";

interface ContactFormProps {
  initialCourse?: string;
  coursesList?: { title: string }[];
}

export function ContactForm({
  initialCourse = "",
  coursesList = [],
}: ContactFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryFormInput>({
    resolver: zodResolver(enquiryFormSchema) as any,
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      courseOfInterest: initialCourse,
      subject: initialCourse ? `Enquiry: ${initialCourse}` : "",
      message: "",
      consent: true as any,
      honeypot: "",
    },
  });

  const onSubmit = async (data: EnquiryFormInput) => {
    setServerError(null);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to submit enquiry.");
      }

      setIsSuccess(true);
      reset();
    } catch (err: any) {
      setServerError(
        err.message || "An unexpected error occurred. Please try again."
      );
    }
  };

  if (isSuccess) {
    return (
      <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-8 sm:p-10 text-center space-y-4 animate-in fade-in duration-300">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-emerald-950">
          Enquiry Submitted Successfully!
        </h3>
        <p className="text-sm sm:text-base text-emerald-800 max-w-md mx-auto leading-relaxed">
          Thank you for reaching out to Biomed Institute. Your request has been recorded
          in our admissions portal and our team will get back to you shortly.
        </p>
        <div className="pt-4">
          <Button
            variant="teal"
            size="md"
            onClick={() => setIsSuccess(false)}
          >
            Submit Another Enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#E2E8F0] shadow-sm"
      noValidate
    >
      {serverError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p>{serverError}</p>
        </div>
      )}

      {/* Hidden honeypot field for bot trap */}
      <div className="hidden" aria-hidden="true">
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          {...register("honeypot")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Name */}
        <FormField
          label="Your Full Name"
          required
          htmlFor="name"
          error={errors.name?.message}
        >
          <Input
            id="name"
            placeholder="e.g. Rahul Sharma"
            leftIcon={<User className="w-4 h-4" />}
            {...register("name")}
          />
        </FormField>

        {/* Email */}
        <FormField
          label="Email Address"
          required
          htmlFor="email"
          error={errors.email?.message}
        >
          <Input
            id="email"
            type="email"
            placeholder="e.g. rahul@example.com"
            leftIcon={<Mail className="w-4 h-4" />}
            {...register("email")}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Phone */}
        <FormField
          label="Phone / WhatsApp Number"
          required
          htmlFor="phone"
          error={errors.phone?.message}
        >
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. +91 9876543210"
            leftIcon={<Phone className="w-4 h-4" />}
            {...register("phone")}
          />
        </FormField>

        {/* Course of Interest */}
        <FormField
          label="Program of Interest"
          htmlFor="courseOfInterest"
          error={errors.courseOfInterest?.message}
        >
          <Select id="courseOfInterest" {...register("courseOfInterest")}>
            <option value="">Select a course or program (optional)</option>
            {coursesList.map((c, i) => (
              <option key={i} value={c.title}>
                {c.title}
              </option>
            ))}
            <option value="General Academic Internship">
              General Academic Internship
            </option>
            <option value="College Workshop / Guest Lecture">
              College Workshop / Guest Lecture
            </option>
            <option value="Other Biomedical Inquiries">
              Other Biomedical Inquiries
            </option>
          </Select>
        </FormField>
      </div>

      {/* Subject */}
      <FormField
        label="Subject / Topic"
        htmlFor="subject"
        error={errors.subject?.message}
      >
        <Input
          id="subject"
          placeholder="e.g. Batch timings, syllabus details, or fee query"
          {...register("subject")}
        />
      </FormField>

      {/* Message */}
      <FormField
        label="Message / Query"
        required
        htmlFor="message"
        error={errors.message?.message}
      >
        <Textarea
          id="message"
          rows={4}
          placeholder="Please describe your background, educational queries, or college requirement..."
          {...register("message")}
        />
      </FormField>

      {/* Consent Checkbox */}
      <div className="pt-2">
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-4 h-4 mt-1 rounded border-slate-300 text-[#155EEF] focus:ring-[#155EEF]"
            {...register("consent")}
          />
          <span className="text-xs text-[#64748B] leading-relaxed">
            I consent to Biomed Institute contacting me regarding course details,
            batch schedules, and academic information. My information will not be shared with third parties.
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-xs text-red-600 font-medium">
            {errors.consent.message}
          </p>
        )}
      </div>

      <div className="pt-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full justify-center shadow-md shadow-[#155EEF]/20"
          isLoading={isSubmitting}
          rightIcon={<Send className="w-4 h-4" />}
        >
          Submit Admission Enquiry
        </Button>
      </div>
    </form>
  );
}
