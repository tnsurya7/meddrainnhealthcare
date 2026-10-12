import { NextRequest, NextResponse } from "next/server";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

let cachedS3Client: S3Client | null = null;

function getS3Client(): S3Client {
  if (cachedS3Client) return cachedS3Client;

  const accessKey =
    process.env.AWS_ACCESS_KEY_ID || process.env.NEON_STORAGE_ACCESS_KEY_ID || "";
  const secretKey =
    process.env.AWS_SECRET_ACCESS_KEY ||
    process.env.NEON_STORAGE_SECRET_ACCESS_KEY ||
    "";
  const endpoint =
    process.env.AWS_ENDPOINT_URL_S3 || process.env.NEON_STORAGE_ENDPOINT || "";
  const region =
    process.env.AWS_REGION || process.env.NEON_STORAGE_REGION || "us-east-2";

  cachedS3Client = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId: accessKey,
      secretAccessKey: secretKey,
    },
    forcePathStyle: true,
  });

  return cachedS3Client;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;
  if (!path || path.length === 0) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const bucket = process.env.NEON_STORAGE_BUCKET || "assets";
  // If first segment happens to be the bucket name, trim it
  let key = path.join("/");
  if (path[0] === bucket) {
    key = path.slice(1).join("/");
  }

  try {
    const s3 = getS3Client();
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    const res = await s3.send(command);

    const contentType = res.ContentType || "image/jpeg";
    const body = res.Body;

    if (!body) {
      return new NextResponse("Empty response from storage", { status: 404 });
    }

    const byteArray = await body.transformToByteArray();

    return new Response(Buffer.from(byteArray), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error: any) {
    // If not found in primary bucket, try 'gallery' bucket as fallback
    if (bucket !== "gallery") {
      try {
        const s3 = getS3Client();
        const fallbackRes = await s3.send(
          new GetObjectCommand({
            Bucket: "gallery",
            Key: key,
          })
        );
        const contentType = fallbackRes.ContentType || "image/jpeg";
        const byteArray = await fallbackRes.Body?.transformToByteArray();
        if (byteArray) {
          return new Response(Buffer.from(byteArray), {
            status: 200,
            headers: {
              "Content-Type": contentType,
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      } catch {
        // Fall through to 404
      }
    }

    console.error(`Storage object fetch error for key "${key}":`, error?.message);
    return new NextResponse("Object not found in Neon storage", { status: 404 });
  }
}
