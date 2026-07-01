"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin() {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid email or password.");
      setLoading(false);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="min-h-full flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-title font-semibold text-text-primary">
            Dashboard
          </h1>
          <p className="mt-2 text-callout text-text-muted">
            Sign in to continue
          </p>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="
              h-12 w-full rounded-input border px-4
              text-body text-text-primary placeholder:text-text-muted
              bg-fill-primary border-border
              focus:outline-none focus:border-accent focus:bg-accent-50
              transition-colors duration-fast
            "
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="
              h-12 w-full rounded-input border px-4
              text-body text-text-primary placeholder:text-text-muted
              bg-fill-primary border-border
              focus:outline-none focus:border-accent focus:bg-accent-50
              transition-colors duration-fast
            "
          />

          {error && (
            <p
              className="text-caption text-center"
              style={{ color: "var(--error)" }}
            >
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading || !email || !password}
            className="
              h-12 w-full rounded-btn
              bg-accent text-white text-body font-medium
              disabled:opacity-40
              active:scale-[0.97] transition-transform duration-instant
              mt-1
            "
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
