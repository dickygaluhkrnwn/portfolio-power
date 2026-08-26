import { NextRequest, NextResponse } from "next/server";
import { getComments } from "@/lib/blog-service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = searchParams.get("postId");

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    const comments = await getComments(postId);

    return NextResponse.json({ success: true, data: comments });
  } catch (error: any) {
    console.error("Error fetching comments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
