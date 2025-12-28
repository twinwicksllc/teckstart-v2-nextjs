"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    // Call the API to log out
    fetch("/api/auth/logout", { method: "POST" })
      .finally(() => {
        // Redirect to login page after logout
        router.replace("/login");
      });
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Logging you out...</p>
      </div>
    </div>
  );
}
