import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { courseFormSchema } from "@/lib/validation";
import { createCourse } from "@/lib/db/mutations/courses";
import { getAllCoursesAdmin } from "@/lib/db/queries/courses";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const courses = await getAllCoursesAdmin();
  return NextResponse.json({ courses });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = courseFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newCourse = await createCourse(validated.data);
    return NextResponse.json({ success: true, course: newCourse }, { status: 201 });
  } catch (error: any) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create course" },
      { status: 500 }
    );
  }
}
