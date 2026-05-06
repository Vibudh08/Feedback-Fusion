import prisma from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const user = await syncCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { postId } = await request.json();

    if (typeof postId !== "number") {
      return NextResponse.json(
        { error: "Post id is required" },
        { status: 400 },
      );
    }

    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: user.id,
          postId,
        },
      },
    });

    if (existingVote) {
      await prisma.vote.delete({
        where: {
          id: existingVote.id,
        },
      });
      return NextResponse.json({ voted: false });
    } else {
      await prisma.vote.create({
        data: {
          userId: user.id,
          postId,
        },
      });
      return NextResponse.json({ voted: true });
    }
  } catch (error) {
    return NextResponse.json(
      { "vote cannot be added or deleted": error },
      { status: 500 },
    );
  }
}
