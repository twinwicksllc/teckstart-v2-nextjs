"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
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
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
            <span className="bg-white px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button 
          variant="outline" 
          type="button" 
          className="w-full"
          onClick={handleGoogleLogin}
        >
          <span className="mr-2 h-4 w-4 inline-block align-middle">
            <Image
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
              alt="Google logo"
              width={20}
              height={20}
              className="inline-block align-middle"
            />
          </span>
          Sign in with Google
        </Button>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-primary hover:underline">
            Register
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}