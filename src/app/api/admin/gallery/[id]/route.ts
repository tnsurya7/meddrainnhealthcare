import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { galleryFormSchema } from "@/lib/validation";
import { updateGalleryImage, deleteGalleryImage } from "@/lib/db/mutations/gallery";
import { getGalleryImageById } from "@/lib/db/queries/gallery";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const image = await getGalleryImageById(id);
  if (!image) {
    return NextResponse.json({ error: "Gallery image not found" }, { status: 404 });
  }

  return NextResponse.json({ image });
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
    const validated = galleryFormSchema.partial().safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const updated = await updateGalleryImage(id, validated.data);
    return NextResponse.json({ success: true, image: updated });
  } catch (error: any) {
    console.error("Update gallery image error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update gallery image" },
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
    await deleteGalleryImage(id);
    return NextResponse.json({ success: true, message: "Gallery image and file deleted." });
  } catch (error: any) {
    console.error("Delete gallery image error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete gallery image" },
      { status: 500 }
    );
  }
}
