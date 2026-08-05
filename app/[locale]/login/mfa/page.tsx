"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, KeyRound } from "lucide-react";
import { toast } from "sonner";

export default function LoginMfaPage() {
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) || "en";

  const [tempToken, setTempToken] = useState<string>("");
  const [code, setCode] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    // Expect ?tempToken=... OR fallback to sessionStorage
    const url = new URL(window.location.href);
    const t = url.searchParams.get("tempToken");
    if (t) {
      setTempToken(t);
      return;
    }

    const stored = window.sessionStorage.getItem("fwms_mfa_tempToken");
    if (stored) setTempToken(stored);
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!tempToken) {
        setError("MFA session missing. Please sign in again.");
        return;
      }

      if (!code || code.trim().length < 4) {
        setError("Enter your 6-digit OTP code.");
        return;
      }

      const res = await fetch("/api/auth/mfa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tempToken,
          method: "totp",
          code: code.trim(),
        }),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error ?? "Invalid MFA code");
      }

      toast.success("MFA verified");
      // Backend sets __session cookie, so we can redirect immediately.
      router.push(`/${locale}/dashboard`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "MFA verification failed";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="hidden lg:block space-y-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl">
                <Shield className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">FWMS</h1>
                <p className="text-gray-600">Secure sign in</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Enter the one-time code from your authenticator app.
            </div>
          </div>

          <div className="bg-blue-50 p-6 rounded-xl">
            <h3 className="font-medium text-blue-900 mb-2">
              OTP protects privileged access
            </h3>
            <p className="text-blue-800 text-sm">
              Multi-factor authentication is required for selected roles.
            </p>
          </div>
        </div>

        <div className="w-full max-w-md mx-auto space-y-6">
          <Card className="border-0 shadow-xl">
            <CardHeader className="space-y-2">
              <CardTitle className="text-2xl">Verify OTP</CardTitle>
              <CardDescription>
                We sent a one-time code to your authenticator app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleVerify} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="otp">One-time code</Label>
                  <div className="relative">
                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="otp"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      placeholder="123456"
                      className="pl-9"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Verifying..." : "Verify"}
                </Button>

                <div className="text-center text-sm text-gray-600">
                  OTP didn’t work? Sign in again.
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

