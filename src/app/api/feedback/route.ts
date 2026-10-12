import { NextRequest, NextResponse } from "next/server";
import { feedbackFormSchema } from "@/lib/validation";
import { submitFeedback } from "@/lib/db/mutations/feedback";
import { getApprovedFeedback } from "@/lib/db/queries/feedback";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : 20;

    const data = await getApprovedFeedback(limit);
    return NextResponse.json({ feedback: data });
  } catch (error) {
    console.error("Error fetching approved feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch approved feedback." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting based on IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    const rateLimit = checkRateLimit(`feedback_${ip}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 5, // max 5 feedback submissions per hour
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Too many feedback submissions from this network. Please wait before submitting again.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request JSON
    const body = await req.json();

    // 3. Honeypot Anti-Spam Check
    if (body.honeypot) {
      return NextResponse.json({
        success: true,
        message: "Feedback submitted successfully.",
      });
    }

    // 4. Server-Side Zod Validation
    const validationResult = feedbackFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, message, rating } = validationResult.data;

    // 5. Save to Neon PostgreSQL with pending status
    const saved = await submitFeedback({
      name,
      message,
      rating,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for your valuable feedback! It has been submitted and will appear on the website once approved by our team.",
        feedbackId: saved.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      {
        error:
          "Unable to submit feedback at this moment. Please check your connection and try again.",
      },
      { status: 500 }
    );
  }
}
