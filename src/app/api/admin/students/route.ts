import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { studentFormSchema } from "@/lib/validation";
import { createStudent } from "@/lib/db/mutations/students";
import { getAllStudentsAdmin } from "@/lib/db/queries/students";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const students = await getAllStudentsAdmin();
  return NextResponse.json({ students });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = studentFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validated.data;
    const newStudent = await createStudent({
      name: data.name,
      courseId: data.courseId ? data.courseId : null,
      batch: data.batch,
      description: data.description || null,
      photoUrl: data.photoUrl || null,
      consentStatus: data.consentStatus,
      status: data.status,
    });

    return NextResponse.json({ success: true, student: newStudent }, { status: 201 });
  } catch (error: any) {
    console.error("Create student error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create student record" },
      { status: 500 }
    );
  }
}
