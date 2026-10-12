import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { storage, ALLOWED_BUCKET_CATEGORIES, NeonBucketCategory } from "@/lib/storage";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB limit
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

export async function POST(req: NextRequest) {
  try {
    // 1. Enforce Authenticated Admin Session
    const session = await getCurrentSession();
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized: Administrator access required." },
        { status: 401 }
      );
    }

    // 2. Parse FormData
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const requestedBucket = formData.get("bucket") as string | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided for upload." },
        { status: 400 }
      );
    }

    // 3. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds 5MB limit. Please compress or optimize the image." },
        { status: 400 }
      );
    }

    // 4. Validate Permitted MIME types
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file format. Only JPEG, PNG, WebP, and SVG images are permitted.",
        },
        { status: 400 }
      );
    }

    // 5. Validate Bucket / Logical Category
    let category: NeonBucketCategory = "site-assets";
    if (
      requestedBucket &&
      ALLOWED_BUCKET_CATEGORIES.includes(requestedBucket as NeonBucketCategory)
    ) {
      category = requestedBucket as NeonBucketCategory;
    }

    // 6. Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 7. Upload to Neon Object Storage
    const result = await storage.uploadFile(buffer, file.name, file.type, category);

    return NextResponse.json({
      success: true,
      url: result.url,
      key: result.key,
      size: result.size,
      contentType: result.contentType,
      bucket: result.bucket,
    });
  } catch (error: any) {
    console.error("Neon Object Storage upload route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to upload image to Neon Object Storage." },
      { status: 500 }
    );
  }
}
