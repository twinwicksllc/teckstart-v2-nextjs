import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { getServerSession } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth-token");

  if (!token) {
    console.log("DashboardPage: No auth-token cookie found");
    redirect("/login?error=missing_cookie");
  }

  const session = await getServerSession();
  
  if (!session) {
    console.log("DashboardPage: Session verification failed");
    redirect("/login?error=invalid_session");
  }

  return <DashboardContent user={session} />;
}