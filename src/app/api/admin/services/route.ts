import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { serviceFormSchema } from "@/lib/validation";
import { createService } from "@/lib/db/mutations/services";
import { getAllServicesAdmin } from "@/lib/db/queries/services";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const services = await getAllServicesAdmin();
  return NextResponse.json({ services });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = serviceFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newService = await createService(validated.data);
    return NextResponse.json({ success: true, service: newService }, { status: 201 });
  } catch (error: any) {
    console.error("Create service error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create service" },
      { status: 500 }
    );
  }
}
