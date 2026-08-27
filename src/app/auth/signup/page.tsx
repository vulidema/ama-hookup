"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout, Toast } from "@/components/layouts";
import { Button, Input } from "@/components/ui";

export default function SignupPage() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "error" | "success" } | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setToast({ message: "Passwords do not match", type: "error" });
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions");
      setToast({ message: "Please agree to terms and conditions", type: "error" });
      return;
    }

    setLoading(true);

    try {
      await signUp(email, password);
      setToast({ message: "Account created! Redirecting...", type: "success" });
      setTimeout(() => router.push("/app/onboarding"), 1500);
    } catch (err: any) {
      const message = err.message || "Failed to sign up";
      setError(message);
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError("");
    setLoading(true);

    try {
      await signInWithGoogle();
      router.push("/app/onboarding");
    } catch (err: any) {
      const message = err.message || "Failed to sign up with Google";
      setError(message);
      setToast({ message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join AMA Hookup to meet locals"
    >
      <form onSubmit={handleSignUp} className="space-y-4">
        <Input
          type="email"
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          required
        />

        <Input
          type="password"
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          required
          minLength={8}
        />

        <Input
          type="password"
          label="Confirm Password"
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={loading}
          required
        />

        <div className="flex items-start gap-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mt-1 rounded"
            required
          />
          <label htmlFor="terms" className="text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-primary-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-primary-500 hover:underline">
              Privacy Policy
            </a>
          </label>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm">
            {error}
          </div>
        )}

        <Button type="submit" fullWidth size="lg" isLoading={loading}>
          Create Account
        </Button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-gray-500 text-sm">or</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      <Button
        type="button"
        variant="secondary"
        fullWidth
        size="lg"
        disabled={loading}
        onClick={handleGoogleSignUp}
      >
        🔗 Sign up with Google
      </Button>

      <p className="text-center text-gray-600 text-sm mt-6">
        Already have an account?{" "}
        <a href="/auth/login" className="text-primary-500 hover:underline font-medium">
          Sign in
        </a>
      </p>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </AuthLayout>
  );
}