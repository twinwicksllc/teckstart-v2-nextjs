import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { db } from "@/lib/db";
import { projects } from "@/drizzle.schema";
import { eq } from "drizzle-orm";
import { Navbar } from "@/components/navbar";

export default async function NewExpensePage() {
  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  // Fetch projects for the dropdown
  const userProjects = await db.select().from(projects).where(eq(projects.userId, user.id));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
          <p className="mt-2 text-gray-600">
            Manually record an expense for your freelance business.
          </p>
        </div>
        <ExpenseForm projects={userProjects} />
      </div>
    </div>
  );
}
