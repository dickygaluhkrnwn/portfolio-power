import { NextRequest, NextResponse } from "next/server";
import { incrementLike } from "@/lib/blog-service";

export async function POST(req: NextRequest) {
  try {
    const { postId } = await req.json();

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 });
    }

    await incrementLike(postId);

    return NextResponse.json({ success: true, message: "Liked successfully" });
  } catch (error: any) {
    console.error("Error liking post:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
