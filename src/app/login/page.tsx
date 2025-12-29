import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getServerSession } from "@/lib/auth";

export default async function LoginPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-2">
          Sign in to TeckStart
        </h2>
        <p className="text-center text-sm text-gray-600 mb-6">
          Or{' '}
          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
            start your 14-day free trial
          </a>
        </p>
        <LoginForm />
      </div>
    </div>
  );
}