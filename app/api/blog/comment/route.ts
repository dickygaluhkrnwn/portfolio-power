import { NextRequest, NextResponse } from "next/server";
import { addComment } from "@/lib/blog-service";

export async function POST(req: NextRequest) {
  try {
    const { postId, authorName, content } = await req.json();

    if (!postId || !content) {
      return NextResponse.json({ error: "Post ID and content are required" }, { status: 400 });
    }

    await addComment(postId, authorName, content);

    return NextResponse.json({ success: true, message: "Comment added successfully" });
  } catch (error: any) {
    console.error("Error adding comment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
