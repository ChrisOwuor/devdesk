"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "../../../../lib/actions/registerAction";

export default function Page() {
  const [state, action, pending] = useActionState(registerAction, null);

  return (
    <div className="bg-surface border border-border rounded-xl p-8 shadow-custom">
      {/* HEADER */}
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-text-secondary mt-1">
          Start managing projects with DevDesk
        </p>
      </div>

      {/* ERROR */}
      {state?.error && (
        <div className="mb-4 text-red-500 text-sm">{state.error}</div>
      )}

      {/* FORM */}
      <form action={action} className="space-y-4">
        <div>
          <label className="text-sm text-text-secondary">Name</label>
          <input
            name="name"
            type="text"
            placeholder="John Doe"
            className="w-full mt-1 px-4 py-3 rounded-lg bg-background border border-border outline-none focus:border-primary"
          />
        </div>

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
          disabled={pending}
          className="w-full bg-primary text-primary-text py-3 rounded-lg font-medium disabled:opacity-60"
        >
          {pending ? "Creating account..." : "Create account"}
        </button>
      </form>

      {/* FOOTER */}
      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-primary">
          Sign in
        </Link>
      </p>
    </div>
  );
}
