import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { siteSettingsFormSchema } from "@/lib/validation";
import { updateSiteSettings } from "@/lib/db/mutations/site-settings";
import { getSiteSettings } from "@/lib/db/queries/site-settings";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const settings = await getSiteSettings();
  return NextResponse.json({ settings });
}

export async function PATCH(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = siteSettingsFormSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateSiteSettings(validated.data);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error: any) {
    console.error("Update site settings error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update site settings" },
      { status: 500 }
    );
  }
}
