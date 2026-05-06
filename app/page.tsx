import { GradientHeader } from "@/components/gradient-header";
import NewFeedbackButton from "@/components/new-feedback-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { syncCurrentUser } from "@/lib/sync-user";
import {
  BarChart,
  Map,
  MessageSquare,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const dbUser =await syncCurrentUser();
  const commentNum =  (await prisma.comment.findMany()).length;
  const votesNum =  (await prisma.vote.findMany()).length;
  const feedbackNum =  (await prisma.post.findMany()).length;
  console.log("comment", commentNum)
  console.log("vote", votesNum)
  console.log("feedback", feedbackNum);

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <GradientHeader
        title="Shape the future of our product"
        subtitle="Feedback Fusion is where your ideas come to life. Suggest features, vote on what matters most, and follow our public roadmap."
      >
        <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center sm:gap-4">
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
              <Map className=" h-4 w-4" />
              View Roadmap
            </Link>
          </Button>
        </div>
      </GradientHeader>
      {/* Feature Section */}
      <section>
        <h2 className="mb-8 text-center text-2xl font-bond sm:text-3xl">
          How It Works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <MessageSquare className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>Submit Ideas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Share your suggestion and feature requesrs with the community
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <BarChart className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>Vote & Prioritize</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Upvote ideas you love to help us understand what matters most.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Users className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>Track Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Follow our public roadmap to see what we&#39;re working on next.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Zap className=" h-8 w-8 text-primary mb-2" />
              <CardTitle>See Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Watch as your feedback transforms into real features and
                improvements.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Stats Section */}
      <section className="text-center">
        <div className="grid grid-cols-3 gap-3 sm:inline-grid sm:gap-8">
          <div>
            <div className="text-xl font-bold sm:text-3xl">{commentNum}</div>
            <div className="text-xs text-muted-foreground sm:text-base">
              Suggestions
            </div>
          </div>
          <div>
            <div className="text-xl font-bold sm:text-3xl">{votesNum}</div>
            <div className="text-xs text-muted-foreground sm:text-base">
              Votes Cast
            </div>
          </div>
          <div>
            <div className="text-xl font-bold sm:text-3xl">{feedbackNum}</div>
            <div className="text-xs text-muted-foreground sm:text-base">
              Features Shipped
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
