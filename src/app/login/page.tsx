import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">
            Sign in to TeckStart
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              start your 14-day free trial
            </a>
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}