import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary w-full">
      {/* NAVBAR */}
      <header className="flex items-center justify-between px-6 md:px-10 py-5 border-b border-border">
        <div className="text-lg font-semibold tracking-tight flex items-center justify-center">
          <Image src="logo3.svg" alt="n" width={45} height={15} />{" "}
          <span>Devdesk</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-text-primary hover:text-text-primary"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="bg-primary-custom text-primary-text px-4 py-2 rounded-lg"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="px-6 md:px-10 py-24 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Manage projects, tasks, and teams without the chaos
          </h1>

          <p className="mt-6 text-text-secondary text-lg md:text-xl">
            DevDesk is a modern project management workspace for teams that want
            clarity, speed, and structure — without the clutter of complex
            tools.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-primary text-primary-text px-6 py-3 rounded-lg"
            >
              Start for free
            </Link>

            <Link
              href="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-lg border border-border"
            >
              Explore features
            </Link>
          </div>

          <p className="mt-6 text-sm text-text-secondary">
            No credit card required • Setup in under 2 minutes
          </p>
        </div>
      </section>
    </div>
  );
}
