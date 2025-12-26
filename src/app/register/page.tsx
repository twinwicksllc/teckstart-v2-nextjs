import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">TeckStart</h1>
          <p className="text-slate-600 mt-2">Freelance Expense & Project Tracker</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
