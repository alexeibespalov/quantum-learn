"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { resendVerificationEmail } from "@/lib/firebase/auth";
import { Button } from "@/components/ui/Button";

export default function VerifyEmailPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.emailVerified) {
      router.replace("/onboarding");
    }
  }, [user, router]);

  const handleResend = async () => {
    if (!user) return;

    setResending(true);
    setError(null);
    setResent(false);

    try {
      await resendVerificationEmail(user);
      setResent(true);
    } catch (err: unknown) {
      const firebaseError = err as { code?: string };
      if (firebaseError.code === "auth/too-many-requests") {
        setError("Too many requests. Please wait a few minutes and try again.");
      } else {
        setError("Failed to send verification email. Please try again.");
      }
    } finally {
      setResending(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!user) return;

    setChecking(true);
    try {
      await user.reload();
      if (user.emailVerified) {
        router.replace("/onboarding");
      } else {
        setError("Email not yet verified. Please check your inbox and click the verification link.");
      }
    } catch {
      setError("Failed to check verification status. Please try again.");
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Mail className="w-8 h-8 text-primary-600" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
      <p className="text-gray-600 mb-6">
        We&apos;ve sent a verification link to{" "}
        <span className="font-medium text-gray-900">{user?.email}</span>
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {resent && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm flex items-center justify-center gap-2">
          <CheckCircle className="w-4 h-4" />
          Verification email sent!
        </div>
      )}

      <div className="space-y-3">
        <Button
          onClick={handleCheckVerification}
          className="w-full"
          loading={checking}
        >
          I&apos;ve verified my email
        </Button>

        <Button
          variant="outline"
          onClick={handleResend}
          className="w-full"
          loading={resending}
          disabled={resent}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Resend verification email
        </Button>
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Didn&apos;t receive the email? Check your spam folder or{" "}
        <button
          onClick={handleResend}
          className="text-primary-600 hover:text-primary-700"
          disabled={resending}
        >
          request a new one
        </button>
      </p>
    </div>
  );
}
