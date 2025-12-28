"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { AWSConfigForm } from "@/components/aws/aws-config-form";
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
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">Failed to load user information</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {/* Profile Section */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Profile</h2>
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

            {/* AWS Integration Section */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Integrations</h2>
              <AWSConfigForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
