"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { User } from "@/drizzle.schema";

type AuthUser = Omit<User, "name"> & { name: string };

export default function SettingsPage() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/verify", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setUser({ ...data, name: data.name || "" });
      }
    } catch (err) {
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar user={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">Loading settings...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen">
        <DashboardSidebar user={user} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500">Failed to load user information</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>View and manage your account details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <div className="text-lg text-gray-900">{user.name}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="text-lg text-gray-900">{user.email}</div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <div className="text-lg text-gray-900 capitalize">{user.role}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
