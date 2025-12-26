import { redirect } from "next/navigation";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getServerSession } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession();
  
  if (!session) {
    console.log("No session found in DashboardPage, redirecting to login");
    redirect("/login?error=no_session");
  }

  return <DashboardContent user={session} />;
}