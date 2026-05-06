"use client";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { MessageSquare, ThumbsUp, User as UserIcon } from "lucide-react";
import { STATUS_GROUPS } from "@/app/data/status-data";
import { Badge } from "./ui/badge";
import { getCategoryDesign } from "@/app/data/category-data";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import type { Comment, Post, User, Vote } from "@/generated/prisma/client";

export interface FeedbackPost extends Post {
  author: User;
  votes: Vote[];
  comments: (Comment & { user: User })[];
}

interface FeedbackListProps {
  initialPosts: FeedbackPost[];
  userId: number | null;
  categoryFilter?: string | null;
}

export default function FeedbackList({
  initialPosts,
  userId,
  categoryFilter = null,
}: FeedbackListProps) {
  const [posts, setPosts] = useState(initialPosts);
  const visiblePosts = categoryFilter
    ? posts.filter((post) => post.category === categoryFilter)
    : posts;
  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [submittingCommentId, setSubmittingCommentId] = useState<number | null>(
    null,
  );

  const handleVote = async (postId: number) => {
    const currentUserId = userId;

    if (!currentUserId) {
      toast.error("Please sign in to vote on feedback");
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Submitting vote...");

    try {
      const response = await fetch("/api/votes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
        }),
      });

      if (!response.ok) {
        throw new Error("Vote failed");
      }
      const data = await response.json();

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success(data.voted ? "Vote added!" : "Vote removed");

      // Update local state
      setPosts((currentPosts) =>
        currentPosts.map((post) => {
          if (post.id === postId) {
            return {
              ...post,
              votes: data.voted
                ? [...post.votes, { id: Date.now(), userId: currentUserId, postId }]
                : post.votes.filter((v) => v.userId !== currentUserId),
            };
          }

          return post;
        }),
      );

    } catch (error) {
      console.error("Failed to submit vote.", error);
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.error("Failed to submit vote. Please try again");
    }
  };

  const toggleComments = (postId: number) => {
    setOpenComments((current) => ({
      ...current,
      [postId]: !current[postId],
    }));
  };

  const handleCommentSubmit = async (postId: number) => {
    const currentUserId = userId;
    const content = commentInputs[postId]?.trim();

    if (!currentUserId) {
      toast.error("Please sign in to comment on feedback");
      return;
    }

    if (!content) {
      toast.error("Please enter a comment");
      return;
    }

    setSubmittingCommentId(postId);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error("Comment failed");
      }

      const comment = await response.json();

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: [comment, ...post.comments],
              }
            : post,
        ),
      );
      setCommentInputs((current) => ({
        ...current,
        [postId]: "",
      }));
      setOpenComments((current) => ({
        ...current,
        [postId]: true,
      }));
      toast.success("Comment added");
    } catch (error) {
      console.error("Failed to submit comment.", error);
      toast.error("Failed to submit comment. Please try again");
    } finally {
      setSubmittingCommentId(null);
    }
  };

  return (
    <div className="space-y-4">
      {visiblePosts.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No feedback found for this category.
          </CardContent>
        </Card>
      )}
      {visiblePosts.map((post) => (
        <Card
          key={post.id}
          className="hover:shadow-md transition-shadow border"
        >
          <CardHeader>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg">{post.title}</CardTitle>
                <CardDescription className="mt-1 flex flex-wrap items-center gap-1.5">
                  <UserIcon className="h-3 w-3" />
                  {post.author.name}
                  {post.author.role === "admin" && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                      Admin
                    </Badge>
                  )}
                  <span>|</span>
                  <span className="whitespace-nowrap">
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {/* Status Badge */}
                {(() => {
                  const statusGroup =
                    STATUS_GROUPS[post.status as keyof typeof STATUS_GROUPS];
                  if (!statusGroup) return null;
                  const StatusIcon = statusGroup.icon;

                  return (
                    <Badge
                      className={`${statusGroup.countColor} border ${statusGroup.color} flex items-center gap-1`}
                    >
                      <StatusIcon className="h-3 w-3" />
                      {statusGroup.title}
                    </Badge>
                  );
                })()}
                {/* Category Badge */}
                {(() => {
                  const design = getCategoryDesign(post.category);
                  const Icon = design.icon;

                  return (
                    <Badge
                      variant="outline"
                      className={`text-xs ${design.border} ${design.text} flex items-center gap-1`}
                    >
                      <Icon className="h-3 w-3" />
                      {post.category}
                    </Badge>
                  );
                })()}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-3">{post.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVote(post.id)}
                  className="w-full gap-2 sm:w-auto"
                >
                  <ThumbsUp
                    className={`h-4 w-4 ${
                      post.votes.some((v) => v.userId === userId)
                        ? "fill-current"
                        : ""
                    }`}
                  />
                  {post.votes.length} Votes
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleComments(post.id)}
                  className="w-full gap-2 sm:w-auto"
                >
                  <MessageSquare className="h-4 w-4" />
                  {post.comments.length} Comments
                </Button>
              </div>
            </div>
            {openComments[post.id] && (
              <div className="mt-4 space-y-3 border-t pt-4">
                <div className="space-y-2">
                  <Textarea
                    value={commentInputs[post.id] ?? ""}
                    onChange={(event) =>
                      setCommentInputs((current) => ({
                        ...current,
                        [post.id]: event.target.value,
                      }))
                    }
                    placeholder="Add your comment..."
                    className="min-h-20"
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => handleCommentSubmit(post.id)}
                      disabled={submittingCommentId === post.id}
                    >
                      {submittingCommentId === post.id
                        ? "Submitting"
                        : "Submit"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-3">
                  {post.comments.length > 0 ? (
                    post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="rounded-lg border bg-muted/30 p-3"
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                          <span>{comment.user.name}</span>
                          {comment.user.role === "admin" && (
                            <Badge
                              variant="secondary"
                              className="px-1.5 py-0 text-[10px]"
                            >
                              Admin
                            </Badge>
                          )}
                          <span>|</span>
                          <span>
                            {formatDistanceToNow(
                              new Date(comment.created_at),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>
                        </div>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No comments yet.
                    </p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
