import { NextRequest, NextResponse } from "next/server";
import { enquiryFormSchema } from "@/lib/validation";
import { submitEnquiry } from "@/lib/db/mutations/enquiries";
import { checkRateLimit } from "@/lib/security/rate-limit";

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting based on IP or Forwarded header
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      "anonymous-client";

    const rateLimit = checkRateLimit(`contact_${ip}`, {
      windowMs: 60 * 60 * 1000, // 1 hour
      maxRequests: 10,
    });

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error:
            "Too many enquiries submitted from this network. Please wait a short while or call us directly.",
        },
        { status: 429 }
      );
    }

    // 2. Parse request JSON
    const body = await req.json();

    // 3. Honeypot Anti-Spam Check (bots fill hidden field)
    if (body.honeypot) {
      // Silently discard bot submission
      return NextResponse.json({
        success: true,
        message: "Enquiry received successfully.",
      });
    }

    // 4. Server-Side Zod Validation
    const validationResult = enquiryFormSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validData = validationResult.data;

    // 5. Save genuinely to Neon PostgreSQL
    const savedEnquiry = await submitEnquiry({
      name: validData.name,
      email: validData.email,
      phone: validData.phone,
      courseOfInterest: validData.courseOfInterest || null,
      subject: validData.subject || null,
      message: validData.message,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your enquiry has been received and saved.",
        enquiryId: savedEnquiry?.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error processing contact enquiry:", error);
    return NextResponse.json(
      {
        error:
          "Unable to submit enquiry at this moment. Please check your connection or contact us via phone.",
      },
      { status: 500 }
    );
  }
}
