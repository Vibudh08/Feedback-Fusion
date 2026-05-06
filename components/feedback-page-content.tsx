"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategoryDesign } from "@/app/data/category-data";
import FeedbackList, { type FeedbackPost } from "@/components/feedback-list";

interface CategoryCount {
  category: string;
  _count: number;
}

interface FeedbackPageContentProps {
  categories: CategoryCount[];
  posts: FeedbackPost[];
  userId: number | null;
}

export default function FeedbackPageContent({
  categories,
  posts,
  userId,
}: FeedbackPageContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleCategory = (category: string) => {
    setSelectedCategory((current) => (current === category ? null : category));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Browse feedback by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.map((cat) => {
                const design = getCategoryDesign(cat.category);
                const Icon = design.icon;
                const isSelected = selectedCategory === cat.category;

                return (
                  <button
                    key={cat.category}
                    type="button"
                    onClick={() => toggleCategory(cat.category)}
                    className={`group flex w-full items-center justify-between rounded-lg p-3 text-left transition-colors ${
                      isSelected
                        ? "bg-muted text-foreground"
                        : "hover:bg-muted/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${design.light} ${design.border} border`}
                      >
                        <Icon className={`h-4 w-4 ${design.text}`} />
                      </div>
                      <span className="font-medium text-sm">
                        {cat.category}
                      </span>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${design.light} ${design.text}`}
                    >
                      {cat._count}
                    </Badge>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="lg:col-span-3">
        <FeedbackList
          initialPosts={posts}
          userId={userId}
          categoryFilter={selectedCategory}
        />
      </div>
    </div>
  );
}
