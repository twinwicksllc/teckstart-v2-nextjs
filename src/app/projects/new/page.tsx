import { getServerSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/projects/project-form";

export default async function NewProjectPage() {
  const user = await getServerSession();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-2 text-gray-600">
            Set up a new project to track your freelance work and expenses.
          </p>
        </div>
        <ProjectForm />
      </div>
    </div>
  );
}
