import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { studentFormSchema } from "@/lib/validation";
import { updateStudent, deleteStudent } from "@/lib/db/mutations/students";
import { getStudentById } from "@/lib/db/queries/students";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const student = await getStudentById(id);
  if (!student) {
    return NextResponse.json({ error: "Student not found" }, { status: 404 });
  }

  return NextResponse.json({ student });
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
    const validated = studentFormSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = validated.data;
    const updatePayload: any = { ...data };
    if (data.courseId === "") updatePayload.courseId = null;

    const updated = await updateStudent(id, updatePayload);
    return NextResponse.json({ success: true, student: updated });
  } catch (error: any) {
    console.error("Update student error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update student record" },
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
    await deleteStudent(id);
    return NextResponse.json({ success: true, message: "Student record deleted." });
  } catch (error: any) {
    console.error("Delete student error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete student record" },
      { status: 500 }
    );
  }
}
