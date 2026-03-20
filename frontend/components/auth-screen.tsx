"use client";

import React, { useState } from "react";
import { AuthStatus } from "@/providers/auth.provider";
import { motion } from "framer-motion";

interface AuthScreenProps {
  status: AuthStatus;
  authError: string | null;
  isRoomsError: boolean;
  isWalletError: boolean;
  login: (input: any) => Promise<void>;
  signup: (input: any) => Promise<void>;
}

export function AuthScreen({
  status,
  authError,
  isRoomsError,
  isWalletError,
  login,
  signup,
}: AuthScreenProps) {
  const [devAuthMode, setDevAuthMode] = useState<"login" | "signup">("login");
  const [devEmail, setDevEmail] = useState("");
  const [devPassword, setDevPassword] = useState("");
  const [devFirstName, setDevFirstName] = useState("");
  const [devReferralCode, setDevReferralCode] = useState("DEVAGENT");
  const [localError, setLocalError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (status === "error" || isRoomsError || isWalletError) {
     return (
      <main className="min-h-screen bg-background p-4 text-foreground">
        <div className="relative mx-auto mt-28 max-w-md rounded-2xl border border-destructive/30 bg-destructive/10 p-6">
          <p className="text-base font-semibold">Could not load home screen</p>
          <p className="mt-2 text-sm text-destructive">
            {authError || (isRoomsError ? "Failed to load rooms" : isWalletError ? "Failed to load wallet" : "Unknown error")}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background p-4 text-foreground">
      <div className="relative mx-auto mt-20 max-w-md rounded-2xl border border-primary/30 bg-muted/90 p-5">
        <p className="text-xs uppercase tracking-[0.18em] text-primary/70">
          Local Dev Mode
        </p>
        <h2 className="mt-2 text-2xl font-bold">
          {devAuthMode === "login" ? "Login" : "Sign Up"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Use email/password to test end-to-end without Telegram bot setup.
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={async (e) => {
            e.preventDefault();
            setLocalError("");
            setIsLoading(true);

            try {
              if (devAuthMode === "login") {
                await login({
                  email: devEmail,
                  password: devPassword,
                });
              } else {
                await signup({
                  email: devEmail,
                  password: devPassword,
                  firstName: devFirstName || undefined,
                  referralCode: devReferralCode || undefined,
                });
              }
            } catch (err) {
              setLocalError(
                devAuthMode === "login"
                  ? "Local login failed. Check credentials."
                  : "Local signup failed. Email may already exist.",
              );
            } finally {
              setIsLoading(false);
            }
          }}
        >
          <input
            value={devEmail}
            onChange={(e) => setDevEmail(e.target.value)}
            type="email"
            required
            placeholder="you@example.com"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
          />
          <input
            value={devPassword}
            onChange={(e) => setDevPassword(e.target.value)}
            type="password"
            required
            minLength={6}
            placeholder="password"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
          />
          {devAuthMode === "signup" ? (
            <>
              <input
                value={devFirstName}
                onChange={(e) => setDevFirstName(e.target.value)}
                type="text"
                placeholder="first name (optional)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
              />
              <input
                value={devReferralCode}
                onChange={(e) =>
                  setDevReferralCode(e.target.value.toUpperCase())
                }
                type="text"
                placeholder="referral code (e.g. DEVAGENT)"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none"
              />
            </>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold tracking-[0.1em] text-primary-foreground disabled:opacity-50"
          >
            {isLoading ? "LOADING..." : devAuthMode === "login" ? "LOGIN" : "SIGN UP"}
          </button>
        </form>

        <button
          className="mt-3 text-xs text-primary underline"
          onClick={() =>
            setDevAuthMode((prev) =>
              prev === "login" ? "signup" : "login",
            )
          }
        >
          {devAuthMode === "login"
            ? "No account? Create one"
            : "Already have an account? Login"}
        </button>

        {localError ? (
          <p className="mt-2 text-xs text-destructive">{localError}</p>
        ) : null}
      </div>
    </main>
  );
}
