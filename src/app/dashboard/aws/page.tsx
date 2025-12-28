import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth";
import { AWSConfigForm } from "@/components/aws/aws-config-form";

export default async function AWSConfigPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold mb-6">AWS Integration</h1>
        <AWSConfigForm />
      </div>
    </div>
  );
}
