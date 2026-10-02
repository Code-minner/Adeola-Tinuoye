"use client";

import { useMemo, useState } from "react";
import { ArrowRight, ArrowDown } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const MONO_FONT = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };

type Article = {
  id: string;
  title: string;
  description: string;
  href: string;
};

const articles: Article[] = [
  {
    id: "kafka-golang",
    title: "The simplest example is kafka + golang",
    description:
      "This article presents a simple way to implement a micro-service architecture using Kafka, Golang and Docker.",
    href: "#",
  },
  {
    id: "grpc-nextjs",
    title: "Wiring gRPC into a Next.js edge runtime",
    description:
      "A walkthrough of streaming typed data from a Go service straight into React server components.",
    href: "#",
  },
  {
    id: "postgres-queues",
    title: "Building reliable queues on plain Postgres",
    description:
      "Why you might not need Kafka or Redis at all, and how SKIP LOCKED gets you most of the way there.",
    href: "#",
  },
  {
    id: "observability-otel",
    title: "Wiring up OpenTelemetry without the boilerplate",
    description:
      "A minimal setup for traces and metrics across a Go + Next.js stack, without pulling in a vendor SDK.",
    href: "#",
  },
  {
    id: "redis-ratelimits",
    title: "Rate limiting at the edge with Redis",
    description:
      "A sliding-window limiter that survives multi-region deploys, and where the naive version falls apart.",
    href: "#",
  },
];

const PAGE_SIZE = 4;

export default function Articles() {
  const pages = useMemo(() => {
    const chunks: Article[][] = [];
    for (let i = 0; i < articles.length; i += PAGE_SIZE) {
      chunks.push(articles.slice(i, i + PAGE_SIZE));
    }
    return chunks;
  }, []);

  const [page, setPage] = useState(0);
  const current = pages[page] ?? [];

  return (
    <section
      id="articles"
      className="page-shell section-pad relative text-white"
      style={MONO_FONT}
    >
      <ScrollReveal>
        <h2 className="text-right text-6xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl">
          Articles
        </h2>
      </ScrollReveal>

      <ScrollReveal delay={80}>
        <div className="mt-8 border-t border-white/15 sm:mt-10" />
      </ScrollReveal>

      <div className="mt-8 grid grid-cols-[auto_1fr] gap-6 sm:mt-10 sm:gap-10">
        <ScrollReveal delay={100} className="flex flex-col items-center gap-3 pt-1">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Go to page ${i + 1}`}
              aria-current={page === i}
              className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
                page === i
                  ? "bg-white text-[#0c0c0b]"
                  : "border border-white/25 text-white/70 hover:border-white/50 hover:text-white"
              }`}
            >
              {i + 1}
            </button>
          ))}

          {pages.length > 1 && (
            <button
              type="button"
              onClick={() => setPage((p) => (p + 1) % pages.length)}
              aria-label="Next page"
              className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-white/25 text-white/70 transition-colors hover:border-white/50 hover:text-white"
            >
              <ArrowDown className="h-4 w-4" />
            </button>
          )}
        </ScrollReveal>

        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          {current.map((article, i) => (
            <ScrollReveal key={article.id} delay={120 + i * 70}>
              <ArticleCard article={article} />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-white/15 p-6 sm:p-8">
      <div>
        <h3 className="text-lg font-semibold leading-snug sm:text-xl">{article.title}</h3>
        <p className="mt-4 text-sm leading-relaxed text-white/70">{article.description}</p>
      </div>

      <a
        href={article.href}
        className="group mt-8 inline-flex w-fit items-center gap-3"
        aria-label={`Read more: ${article.title}`}
      >
        <span className="rounded-full bg-white px-5 py-2 text-sm italic text-[#0c0c0b]">
          Read more
        </span>
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#0c0c0b] transition-transform group-hover:translate-x-0.5">
          <ArrowRight className="h-4 w-4" />
        </span>
      </a>
    </div>
  );
}
