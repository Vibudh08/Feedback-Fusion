import { GradientHeader } from "@/components/gradient-header";
import { Button } from "@/components/ui/button";
import prisma from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import { Map } from "lucide-react";
import Link from "next/link";
import NewFeedbackButton from "@/components/new-feedback-button";
import FeedbackPageContent from "@/components/feedback-page-content";

export default async function FeedbackPage() {
  const dbUser = await syncCurrentUser();

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

  const categories = await prisma.post.groupBy({
    by: ["category"],
    _count: true,
  });
  return (
    <>
      <div className="space-y-6">
        <GradientHeader
          title="Community Feedback"
          subtitle="Explore, vote, and contribute to the features that matter most. Your voice shapes our product's future."
        >
          <div className="flex gap-4 justify-center pt-4">
            <Button
              asChild
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              <NewFeedbackButton isSignedIn={!!dbUser} />
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-white text-black hover:bg-gray-100"
            >
              <Link href="/roadmap">
                <Map className="h-4 w-4" />
                View Roadmap
              </Link>
            </Button>
          </div>
        </GradientHeader>

        <FeedbackPageContent
          categories={categories}
          posts={posts}
          userId={dbUser?.id ?? null}
        />
      </div>
    </>
  );
}
