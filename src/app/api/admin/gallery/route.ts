import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { galleryFormSchema } from "@/lib/validation";
import { createGalleryImage } from "@/lib/db/mutations/gallery";
import { getAllGalleryImagesAdmin } from "@/lib/db/queries/gallery";

export async function GET() {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const images = await getAllGalleryImagesAdmin();
  return NextResponse.json({ images });
}

export async function POST(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validated = galleryFormSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newImage = await createGalleryImage(validated.data);
    return NextResponse.json({ success: true, image: newImage }, { status: 201 });
  } catch (error: any) {
    console.error("Create gallery image error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to add gallery image" },
      { status: 500 }
    );
  }
}
