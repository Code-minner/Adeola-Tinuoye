/**
 * Lightweight video warm-up — starts a background fetch so the first
 * visible frame arrives sooner when the real <video> mounts.
 */

const warmed = new Set<string>();

export function warmVideo(url: string, mode: "metadata" | "auto" = "auto") {
  if (typeof document === "undefined" || !url || warmed.has(url)) return;
  warmed.add(url);

  // Prefer link preload when the browser supports it for video.
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = url;
  link.setAttribute("fetchpriority", mode === "auto" ? "high" : "low");
  document.head.appendChild(link);

  // Also poke a detached media element so Safari/Chrome start buffering.
  const probe = document.createElement("video");
  probe.muted = true;
  probe.playsInline = true;
  probe.preload = mode;
  probe.src = url;
  probe.load();
}

export function warmVideos(urls: string[], mode: "metadata" | "auto" = "auto") {
  for (const url of urls) warmVideo(url, mode);
}
