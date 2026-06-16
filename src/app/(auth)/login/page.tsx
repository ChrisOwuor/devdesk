"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirect: false, // we handle redirect manually
    });

    setLoading(false);

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/app");
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-custom">
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-text-secondary mt-1">
          Sign in to continue to DevDesk
        </p>
      </div>

      {/* ERROR */}
      {error && <div className="mb-4 text-red-500 text-sm">{error}</div>}

      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary">Email</label>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            className="w-full mt-1 px-4 py-3 rounded-lg bg-background border border-border outline-none focus:border-primary"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Password</label>
          <input
            name="password"
            type="password"
            placeholder="••••••••"
            className="w-full mt-1 px-4 py-3 rounded-lg bg-background border border-border outline-none focus:border-primary"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-text py-3 rounded-lg font-medium disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm text-text-secondary mt-6">
        Don’t have an account?{" "}
        <Link href="/register" className="text-primary">
          Sign up
        </Link>
      </p>
    </div>
  );
}
