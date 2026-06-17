"use client";

import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const highlights = [
  "One workspace for every project",
  "Tasks, docs, files, and chat together",
  "Built for focused team handoffs",
];

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      setLoading(false);
      setError("Enter your email and password to continue.");
      return;
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push("/app");
  }

  return (
    <main className="mx-auto flex min-h-[calc(100dvh-32px)] w-[min(1180px,calc(100vw-32px))] flex-col sm:min-h-[calc(100dvh-48px)]">
      <header className="mb-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-custom/10 text-primary-custom shadow-custom">
            <Sparkles className="h-5 w-5" />
          </span>
          <span className="text-xl font-semibold text-text-primary">
            DevDesk
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
          >
            Sign up
          </Link>
          <Link
            href="/register"
            className="hidden rounded-xl border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary shadow-custom transition hover:bg-surface-hover sm:inline-flex"
          >
            Start free
          </Link>
        </div>
      </header>

      <section className="grid flex-1 items-center gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="order-2 lg:order-1">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-sm font-medium text-text-secondary shadow-custom">
            <CheckCircle2 className="h-4 w-4 text-success" />
            Welcome back to your project command center
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-text-primary sm:text-5xl lg:text-6xl">
            Pick up your team&apos;s work right where you left off
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-text-secondary">
            Sign in to manage projects, track tasks, open docs, and keep your
            workspace moving without the clutter.
          </p>

          <div className="mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
            {highlights.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-sm font-medium text-text-primary shadow-custom"
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 rounded-3xl border border-border bg-surface p-3 shadow-custom lg:order-2 lg:max-h-[calc(100dvh-112px)] lg:overflow-y-auto">
          <div className="rounded-2xl border border-border bg-background p-4 sm:p-5">
            <div className="mb-4 text-center">
              <p className="text-sm font-medium text-text-secondary">
                Continue to DevDesk
              </p>
              <h2 className="mt-2 text-3xl font-semibold text-text-primary">
                Welcome back
              </h2>
              <p className="mt-2 text-sm leading-6 text-text-secondary">
                Sign in to open your workspace.
              </p>
            </div>

            {error && (
              <div className="mb-4 flex items-start gap-3 rounded-xl border border-error/25 bg-error/10 px-4 py-3 text-sm text-error">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="text-sm font-medium text-text-secondary">
                  Email
                </label>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(error)}
                    className={`w-full rounded-xl border bg-surface py-3 pl-11 pr-4 text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:bg-background ${
                      error
                        ? "border-error focus:border-error"
                        : "border-border focus:border-primary"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-secondary">
                  Password
                </label>
                <div className="relative mt-2">
                  <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-icon" />
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    aria-invalid={Boolean(error)}
                    className={`w-full rounded-xl border bg-surface py-3 pl-11 pr-4 text-text-primary outline-none transition placeholder:text-text-secondary/70 focus:bg-background ${
                      error
                        ? "border-error focus:border-error"
                        : "border-border focus:border-primary"
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 font-semibold text-primary-text transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-primary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
