/**
 * Safe video helpers — avoids:
 * - "play() request was interrupted by a call to pause()"
 * - "video-only background media was paused to save power"
 */

export function seekToRandomStart(video: HTMLVideoElement) {
  if (!Number.isFinite(video.duration) || video.duration <= 0.5) return;
  try {
    video.currentTime = Math.random() * Math.max(video.duration - 0.25, 0);
  } catch {
    // Ignore seek errors before metadata is complete.
  }
}

type PlaybackState = {
  wanted: boolean;
  generation: number;
  playRequest: Promise<void> | null;
};

const states = new WeakMap<HTMLVideoElement, PlaybackState>();

function getState(video: HTMLVideoElement): PlaybackState {
  let state = states.get(video);
  if (!state) {
    state = { wanted: false, generation: 0, playRequest: null };
    states.set(video, state);
  }
  return state;
}

function canAttemptPlay() {
  if (typeof document === "undefined") return false;
  // Chrome pauses muted video as "background media" when the tab is hidden.
  return document.visibilityState === "visible";
}

/** Request playback. Safe to call repeatedly; handles AbortError / power-save. */
export function requestPlay(video: HTMLVideoElement, options?: { randomStart?: boolean }) {
  const state = getState(video);
  state.wanted = true;
  const generation = ++state.generation;

  const begin = () => {
    if (!state.wanted || generation !== state.generation) return;
    if (!canAttemptPlay()) return;
    if (!video.isConnected) return;

    if (options?.randomStart) seekToRandomStart(video);

    // Ensure muted + playsInline so autoplay policies stay happy.
    video.muted = true;
    video.playsInline = true;

    const request = video.play();
    state.playRequest = request;
    void request
      .catch(() => {
        // AbortError / NotAllowedError / power-save pause — expected, ignore.
      })
      .finally(() => {
        if (state.playRequest === request) state.playRequest = null;
      });
  };

  if (video.readyState >= 2) begin();
  else {
    const onReady = () => {
      video.removeEventListener("loadeddata", onReady);
      video.removeEventListener("canplay", onReady);
      begin();
    };
    video.addEventListener("loadeddata", onReady, { once: true });
    video.addEventListener("canplay", onReady, { once: true });
  }
}

/** Pause only after any in-flight play() settles, so the race never surfaces. */
export function requestPause(video: HTMLVideoElement) {
  const state = getState(video);
  state.wanted = false;
  state.generation += 1;

  const finish = () => {
    if (state.wanted) return;
    if (!video.paused) video.pause();
  };

  if (state.playRequest) {
    void state.playRequest.finally(finish);
  } else {
    finish();
  }
}
