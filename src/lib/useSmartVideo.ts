"use client";

import { useLayoutEffect, useRef } from "react";
import { requestPause, requestPlay } from "@/lib/videoPlayback";

/**
 * Plays a video while `active` is true, pauses otherwise.
 * Generation-safe so IntersectionObserver churn never throws
 * "play() request was interrupted by a call to pause()".
 */
export function useSmartVideo(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  active: boolean,
  options?: { randomStartOnce?: boolean; enabled?: boolean },
) {
  const startedRef = useRef(false);
  const enabled = options?.enabled ?? true;
  const randomStartOnce = options?.randomStartOnce ?? true;

  useLayoutEffect(() => {
    if (!enabled) return;

    let cancelled = false;
    let frame = 0;
    let attached: HTMLVideoElement | null = null;

    const sync = () => {
      if (cancelled) return;
      const video = videoRef.current;
      if (!video) {
        frame = requestAnimationFrame(sync);
        return;
      }

      attached = video;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        requestPause(video);
        return;
      }

      if (active) {
        const doRandom = randomStartOnce && !startedRef.current;
        if (doRandom) startedRef.current = true;
        requestPlay(video, { randomStart: doRandom });
      } else {
        requestPause(video);
      }
    };

    sync();

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      if (attached) requestPause(attached);
    };
  }, [active, enabled, randomStartOnce, videoRef]);
}
