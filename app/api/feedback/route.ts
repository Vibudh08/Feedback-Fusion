import prisma from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const dbUser = await syncCurrentUser();
    console.log(dbUser)
    if (!dbUser)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { title, description, category } = body;
    const post = await prisma.post.create({
      data: {
        title,
        description,
        category,
        authorId: dbUser.id,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.error(error, "Error creating post");
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: true,
        votes: true,
        comments: {
          include: {
            user: true,
          },
          orderBy: {
            created_at: "desc",
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error, "Error fetching post");
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
