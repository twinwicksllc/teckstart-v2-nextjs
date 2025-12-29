"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      if (errorParam === "no_session") {
        setError("Your session could not be verified. Please try logging in again.");
      } else if (errorParam === "missing_cookie") {
        setError("Your browser is not sending the authentication cookie. Please check your browser settings or try a different browser.");
      } else if (errorParam === "invalid_session") {
        setError("Your session has expired or is invalid. Please log in again.");
      } else if (errorParam === "token_exchange_failed") {
        setError("Failed to exchange authentication code. Please try again.");
      } else if (errorParam === "user_info_failed") {
        setError("Failed to retrieve user information. Please try again.");
      } else {
        setError(`Authentication error: ${errorParam}`);
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN;
    const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_AUTH_CALLBACK_URL || `${window.location.origin}/api/auth/callback`;
    
    if (!domain || domain === "undefined") {
      setError("Auth configuration is missing. Please check environment variables.");
      console.error("Missing NEXT_PUBLIC_COGNITO_DOMAIN");
      return;
    }

    // Ensure domain has protocol
    const baseUrl = domain.startsWith("http") ? domain : `https://${domain}`;
    // Include aws.cognito.signin.user.admin so the access token can be used with GetUser
    const scope = "email openid profile aws.cognito.signin.user.admin";
    const url = `${baseUrl}/oauth2/authorize?identity_provider=Google&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&client_id=${clientId}&scope=${encodeURIComponent(scope)}`;
    
    console.log("Redirecting to Google login:", url);
    window.location.href = url;
  };

  return (
    <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-gray-900 mb-2">Login</h3>
        <p className="text-sm text-gray-600">
          Enter your credentials to access your account
        </p>
      </div>
      <div className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          type="button" 
          className="w-full flex items-center justify-center gap-2"
          onClick={handleGoogleLogin}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9.003 18c2.43 0 4.467-.806 5.956-2.18L12.05 13.56c-.806.54-1.836.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.96v2.332C2.44 15.983 5.485 18 9.003 18z" fill="#34A853"/>
            <path d="M3.964 10.712c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.96H.957C.347 6.175 0 7.55 0 9.002c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9.003 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.464.891 11.426 0 9.003 0 5.485 0 2.44 2.017.96 4.958L3.967 7.29c.708-2.127 2.692-3.71 5.036-3.71z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </Button>
      </div>
      <div className="flex justify-center mt-6">
        <p className="text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-indigo-600 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}