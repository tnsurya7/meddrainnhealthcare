import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { feedbackModerationSchema } from "@/lib/validation";
import {
  updateFeedbackStatus,
  deleteFeedback,
} from "@/lib/db/mutations/feedback";
import { getFeedbackById } from "@/lib/db/queries/feedback";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const item = await getFeedbackById(id);
  if (!item) {
    return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
  }

  return NextResponse.json({ feedback: item });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const validated = feedbackModerationSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validated.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { status } = validated.data;
    const updated = await updateFeedbackStatus(id, status);

    return NextResponse.json({ success: true, feedback: updated });
  } catch (error: any) {
    console.error("Update feedback status error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update feedback status" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    await deleteFeedback(id);
    return NextResponse.json({
      success: true,
      message: "Feedback deleted successfully.",
    });
  } catch (error: any) {
    console.error("Delete feedback error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete feedback" },
      { status: 500 }
    );
  }
}
