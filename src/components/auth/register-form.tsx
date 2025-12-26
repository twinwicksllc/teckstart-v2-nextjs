"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const isValidEmail = (value: string) => {
    // Basic email regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const passwordIssues = (value: string): string[] => {
    const issues: string[] = [];
    if (value.length < 8) issues.push("At least 8 characters");
    if (!/[A-Za-z]/.test(value)) issues.push("Contains a letter");
    if (!/[0-9]/.test(value)) issues.push("Contains a number");
    return issues;
  };

  const passwordsMatch = password === confirmPassword;
  const emailOk = isValidEmail(email);
  const passIssues = passwordIssues(password);
  const canSubmit = emailOk && passwordsMatch && passIssues.length === 0 && !isLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!emailOk) {
      setError("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    if (passIssues.length > 0) {
      setError(`Password requirements: ${passIssues.join(", ")}.`);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (error) {
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

    const url = `${domain}/oauth2/authorize?identity_provider=Google&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&client_id=${clientId}&scope=email+openid+profile`;
    
    window.location.href = url;
  };

  if (success) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Registration Successful!</CardTitle>
          <CardDescription>
            Your account has been created. Redirecting to login...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            If you are not redirected, <Link href="/login" className="text-primary hover:underline">click here to login</Link>.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create an Account</CardTitle>
        <CardDescription>
          Enter your details to register for TeckStart
        </CardDescription>
      </CardHeader>
      <CardContent>
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
            {!emailOk && email.length > 0 && (
              <p className="text-xs text-red-600">Please enter a valid email address.</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="flex items-center gap-2">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowPassword((v) => !v)}>
                {showPassword ? "Hide" : "Show"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Must be at least 8 characters and include a letter and a number.</p>
            {passIssues.length > 0 && password.length > 0 && (
              <ul className="text-xs text-red-600 list-disc pl-4">
                {passIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="flex items-center gap-2">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowConfirmPassword((v) => !v)}>
                {showConfirmPassword ? "Hide" : "Show"}
              </Button>
            </div>
            {!passwordsMatch && confirmPassword.length > 0 && (
              <p className="text-xs text-red-600">Passwords do not match.</p>
            )}
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
              {error}
            </div>
          )}
          <Button 
            type="submit" 
            className="w-full" 
            disabled={!canSubmit}
          >
            {isLoading ? "Creating account..." : "Register"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
