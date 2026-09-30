import Link from "next/link";

export const metadata = {
  title: "Playground | Portfolio",
  description: "Developer playground — coming soon.",
};

export default function PlaygroundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0c0c0b] text-white">
      <div className="page-shell flex flex-col items-start gap-6 py-20">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 transition-colors hover:border-white/40 hover:text-white"
        >
          ← Home
        </Link>
        <p
          className="text-xs uppercase tracking-[0.22em] text-white/45"
          style={{ fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" }}
        >
          Dev / Playground
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Empty for now</h1>
        <p className="max-w-md text-sm leading-relaxed text-white/55">
          This space is reserved. The product rows now live under the works gallery on the home page.
        </p>
      </div>
    </main>
  );
}
