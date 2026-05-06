import prisma from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await syncCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId, content } = await request.json();

    if (typeof postId !== "number") {
      return NextResponse.json(
        { error: "Post id is required" },
        { status: 400 },
      );
    }

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json(
        { error: "Comment is required" },
        { status: 400 },
      );
    }

    const comment = await prisma.comment.create({
      data: {
        postId,
        userId: user.id,
        content: content.trim(),
      },
      include: {
        user: true,
      },
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error(error, "Error creating comment");
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
