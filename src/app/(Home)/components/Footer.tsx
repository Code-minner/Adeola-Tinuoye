"use client";

import { Mail, Send } from "lucide-react";

const MONO_FONT = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };
const SANS_FONT = { fontFamily: "var(--font-geist-sans, ui-sans-serif, system-ui, sans-serif)" };

// Same brand-icon replacements used in Hero.tsx (lucide-react v1 dropped the
// trademarked ones). Duplicated here rather than imported since Hero doesn't
// export them — worth moving to a shared `icons.tsx` if you end up needing
// them in a third place.
function Github(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
    </svg>
  );
}

function Linkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function Facebook(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function Instagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const socials = [
  { label: "Github", href: "https://github.com/Code-minner", icon: Github },
  { label: "Linkedin", href: "https://linkedin.com/in/opeyemi-boluwatife", icon: Linkedin },
  { label: "E-mail", href: "mailto:boluwatifeopeyemi@gmail.com", icon: Mail },
  { label: "Telegram", href: "https://t.me/Stem04", icon: Send },
  { label: "Facebook", href: "https://www.facebook.com/share/18xFHZ6gAC/", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/codeminner.tech/", icon: Instagram },
];

const navLinks = [
  { label: "Main", href: "/" },
  { label: "About", href: "/#about" },
  { label: "Projects", href: "/#projects" },
  { label: "Playground", href: "/playground" },
  { label: "Articles", href: "/#articles" },
];

export default function Footer() {
  return (
    <section
      id="contacts"
      className="page-shell section-pad relative overflow-hidden rounded-b-[32px] bg-[#0c0c0b] text-white sm:rounded-b-[48px]"
      style={MONO_FONT}
    >
      {/* decorative ring, bleeding off the top-left edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full border border-white/10 sm:-left-32 sm:-top-32"
      />

      <div className="relative flex flex-col gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
        {/* name + subtitle + socials — order-2 on mobile so the contacts
            block (below) can appear above it, order-1 on desktop where it's
            the left column */}
        <div className="order-2 flex flex-col gap-10 lg:order-1">
          <div>
            <h2 className="text-6xl font-bold leading-none tracking-tight sm:text-7xl lg:text-8xl">
              Opeyemi
            </h2>
            <h2 className="ml-10 text-6xl font-bold leading-none tracking-tight sm:ml-16 sm:text-7xl lg:text-8xl">
              Boluwatife
            </h2>
            <p className="mt-5 text-sm text-white/60 sm:text-base">Full-stack developer</p>
          </div>

          <ul className="flex flex-wrap gap-3">
            {socials.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm italic text-white/90 transition-colors hover:border-white/40 hover:text-white"
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* contacts eyebrow + nav + site card — order-1 on mobile (shows
            first), order-2 on desktop (right column) */}
        <div className="order-1 flex w-full flex-col gap-8 lg:order-2 lg:w-[320px] lg:shrink-0">
          <div>
            <p className="text-sm font-semibold text-white sm:text-base">... /Contacts ...</p>
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/70">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/15 p-6 sm:p-7">
            <h3 style={SANS_FONT} className="text-lg font-semibold">
              Site
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-white/70">
              Handcrafted by{" "}
              <span className="text-white underline underline-offset-2">ME</span> /
            </p>
            <p className="text-sm leading-relaxed text-white/70">
              Designed by{" "}
              <a
                href="#"
                className="text-white underline underline-offset-2 hover:text-white/80"
              >
                Taisia
              </a>{" "}
              /
            </p>
            <p className="text-sm leading-relaxed text-white/70">Powered by NextJs</p>
          </div>
        </div>
      </div>
    </section>
  );
}