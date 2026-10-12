import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/auth";
import { getAllFeedbackAdmin } from "@/lib/db/queries/feedback";

export async function GET(req: NextRequest) {
  const session = await getCurrentSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || undefined;
  const rating = searchParams.get("rating")
    ? parseInt(searchParams.get("rating")!, 10)
    : undefined;
  const search = searchParams.get("search") || undefined;
  const limit = parseInt(searchParams.get("limit") || "50", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const result = await getAllFeedbackAdmin({
    status,
    rating,
    search,
    limit,
    offset,
  });

  return NextResponse.json(result);
}
