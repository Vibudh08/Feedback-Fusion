import { STATUS_ORDER } from "@/app/data/status-data";
import prisma from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: number }> },
) {
  try {
    const User = await syncCurrentUser();
    
    if (!User || User.role != "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }
    const {id} = await params
    const {status} = await request.json();

    if(!STATUS_ORDER.includes(status)){
        return NextResponse.json({ error: "Invalid Status" }, { status: 403 });
    }

    const statusUpdate = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        status,
      },
      include: {
        author: true,
        votes: true,
      },
    });
    return NextResponse.json(statusUpdate)

  } catch (error) {
    console.error("Error updating post", error)
    return NextResponse.json({ error: "Error updating post" }, { status: 500 });
  }
}
