import { currentUser } from "@clerk/nextjs/server";
import { Prisma } from "@/generated/prisma/client";
import prisma from "./prisma";
import { unstable_rethrow } from "next/navigation";

export const syncCurrentUser = async () => {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;

    if (!email) throw new Error("User email not found");

    const userData = {
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      image: clerkUser.imageUrl,
    };

    let dbUser = await prisma.user.findUnique({
      where: {
        clerkUserId: clerkUser.id,
      },
    });

    if (dbUser) {
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: userData,
      });
    } else {
      dbUser = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (dbUser) {
        dbUser = await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            ...userData,
            clerkUserId: clerkUser.id,
          },
        });
        return dbUser;
      }

      const userCount = await prisma.user.count();
      const firstUser = userCount === 0;
      try {
        dbUser = await prisma.user.create({
          data: {
            clerkUserId: clerkUser.id,
            email,
            ...userData,
            role: firstUser ? "admin" : "user",
          },
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002"
        ) {
          const existingUser = await prisma.user.findFirst({
            where: {
              OR: [{ email }, { clerkUserId: clerkUser.id }],
            },
          });

          if (!existingUser) throw error;

          dbUser = await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              ...userData,
              clerkUserId: clerkUser.id,
            },
          });
        } else {
          throw error;
        }
      }
    }

    return dbUser;
  } catch (error) {
    unstable_rethrow(error);
    console.error("Error syncing user from clerk:", error);
    throw error;
  }
};
