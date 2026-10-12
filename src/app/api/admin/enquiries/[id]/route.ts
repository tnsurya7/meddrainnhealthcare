import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { enquiryUpdateSchema } from "@/lib/validation";
import { updateEnquiryStatus, deleteEnquiry } from "@/lib/db/mutations/enquiries";
import { getEnquiryById } from "@/lib/db/queries/enquiries";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const enquiry = await getEnquiryById(id);
  if (!enquiry) {
    return NextResponse.json({ error: "Enquiry not found" }, { status: 404 });
  }

  return NextResponse.json({ enquiry });
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
    const validated = enquiryUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { status, adminNotes } = validated.data;
    const updated = await updateEnquiryStatus(id, status, adminNotes);

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error: any) {
    console.error("Update enquiry error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update enquiry" },
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
    await deleteEnquiry(id);
    return NextResponse.json({ success: true, message: "Enquiry deleted." });
  } catch (error: any) {
    console.error("Delete enquiry error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete enquiry" },
      { status: 500 }
    );
  }
}
