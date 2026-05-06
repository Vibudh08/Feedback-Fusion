"use client";

import { SignInButton } from "@clerk/nextjs";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface NewFeedbackButtonProps {
  isSignedIn: boolean;
}

export default function NewFeedbackButton({
  isSignedIn,
}: NewFeedbackButtonProps) {
  if (!isSignedIn) {
    return (
      <SignInButton mode="modal">
        <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
          <PlusIcon className="h-4 w-4" />
          New Feedback
        </Button>
      </SignInButton>
    );
  }

  return (
    <Button
      asChild
      size="lg"
      className="bg-white text-blue-600 hover:bg-gray-100"
    >
      <Link href="/feedback/new">
        <PlusIcon className="h-4 w-4" />
        New Feedback
      </Link>
    </Button>
  );
}
