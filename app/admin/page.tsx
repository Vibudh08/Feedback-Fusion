import AdminFeedbackTable from "@/components/admin-feedback-table";
import { GradientHeader } from "@/components/gradient-header";
import prisma from "@/lib/prisma";

export default async function AdminPage() {

  const posts = await prisma.post.findMany({
    include: {
      author: true,
      votes: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });
  return (
    <div className="container mx-auto">
      <GradientHeader
        title="Admin Dashboard"
        subtitle="Manage feedbacks and update their status"
      />
      <AdminFeedbackTable posts={posts} />
    </div>
  );
}
