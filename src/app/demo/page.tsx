import { redirect } from "next/navigation";

export default function DemoPage() {
  // Redirect to dashboard for now - you can replace this with actual demo content
  redirect("/login");
}
