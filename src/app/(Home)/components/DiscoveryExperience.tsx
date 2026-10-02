"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const MONO = { fontFamily: "var(--font-geist-mono, ui-monospace, monospace)" };
const SERIF = { fontFamily: "ui-serif, Georgia, 'Times New Roman', serif" };

type Stage = 0 | 1 | 2 | 3;

const STAGES: Record<Exclude<Stage, 0>, { lines: string[]; spoken: string; audio: string; note: number }> = {
  1: { lines: ["Hey... you found this."], spoken: "Hey... you found this.", audio: "/audio/discover-01.mp3", note: 392 },
  2: {
    lines: ["Okay, you're curious.", "I like that."],
    spoken: "Okay, you're curious. I like that.",
    audio: "/audio/discover-02.mp3",
    note: 523.25,
  },
  3: {
    lines: ["Thanks for stopping by.", "I hope you found something worth exploring."],
    spoken: "Thanks for stopping by. I hope you found something worth exploring.",
    audio: "/audio/discover-03.mp3",
    note: 659.25,
  },
};

const SECRETS = ["Still clicking. Respect.", "There's nothing else here. Probably.", "Okay. Go on. The projects are right below."];

const LATS = [-60, -40, -20, 0, 20, 40, 60];
const LONS = [0, 30, 60, 90, 120, 150];

type Star = { x: number; y: number; r: number; tw: number; vx: number; vy: number };
type Spark = { x: number; y: number; vx: number; vy: number; life: number; warm: boolean };

function speakFallback(text: string) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.92;
  u.volume = 0.9;
  window.speechSynthesis.speak(u);
}

export default function DiscoveryExperience() {
  const [stage, setStage] = useState<Stage>(0);
  const [muted, setMuted] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [pulse, setPulse] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [touch, setTouch] = useState(false);
  const [idle, setIdle] = useState(false);

  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const hubRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);
  const stageRef = useRef<Stage>(0);
  const reducedRef = useRef(false);
  const secretRef = useRef(0);
  const ptr = useRef({ x: -9999, y: -9999, active: false });
  const sparks = useRef<Spark[]>([]);
  const burstRef = useRef<() => void>(() => {});

  useEffect(() => void (mutedRef.current = muted), [muted]);
  useEffect(() => void (stageRef.current = stage), [stage]);
  useEffect(() => void (reducedRef.current = reducedMotion), [reducedMotion]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    setTouch(window.matchMedia("(hover: none)").matches);
  }, []);

  // after a few quiet seconds between stages, nudge them to continue
  useEffect(() => {
    setIdle(false);
    if (stage === 0 || stage === 3) return;
    const id = window.setTimeout(() => setIdle(true), 4500);
    return () => window.clearTimeout(id);
  }, [stage, pulse]);

  // ---------- audio ----------
  const stopAudio = useCallback(() => {
    const a = audioRef.current;
    if (a) {
      a.pause();
      a.removeAttribute("src");
      a.load();
    }
    if (typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel();
  }, []);

  /** Soft glass chime layered under the voice. Created inside the click gesture. */
  const chime = useCallback((freq: number) => {
    if (mutedRef.current) return;
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = (ctxRef.current ??= new AC());
      if (ctx.state === "suspended") void ctx.resume();
      const t = ctx.currentTime;
      [1, 2, 3.01].forEach((m, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.value = freq * m;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.07 / (i + 1), t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + 1.9);
      });
    } catch {
      /* audio is a bonus, never fatal */
    }
  }, []);

  const playVoice = useCallback(
    (next: Exclude<Stage, 0>) => {
      if (mutedRef.current) return;
      stopAudio();
      const entry = STAGES[next];
      const audio = audioRef.current;
      if (!audio) return speakFallback(entry.spoken);
      let settled = false;
      const fallback = () => {
        if (settled || mutedRef.current) return;
        settled = true;
        speakFallback(entry.spoken);
      };
      audio.src = entry.audio;
      audio.volume = 0.9;
      const onError = () => fallback();
      audio.addEventListener("error", onError, { once: true });
      void audio.play().then(
        () => {
          settled = true;
          audio.removeEventListener("error", onError);
        },
        () => fallback(),
      );
    },
    [stopAudio],
  );

  // ---------- progression ----------
  const flash = useCallback(
    (ms: number) => {
      setReacting(true);
      setPulse((p) => p + 1);
      burstRef.current();
      window.setTimeout(() => setReacting(false), reducedMotion ? 200 : ms);
    },
    [reducedMotion],
  );

  const advance = useCallback(() => {
    const cur = stageRef.current;
    if (cur < 3) {
      const next = (cur + 1) as Exclude<Stage, 0>;
      setLines(STAGES[next].lines);
      setStage(next);
      playVoice(next);
      chime(STAGES[next].note);
      flash(1100);
    } else {
      const s = SECRETS[secretRef.current++ % SECRETS.length];
      setLines([s]);
      chime(880);
      flash(600);
    }
  }, [playVoice, chime, flash]);

  const onActivate = (e: React.MouseEvent | React.KeyboardEvent) => {
    if ((e.target as HTMLElement).closest("[data-discovery-ignore]")) return;
    advance();
  };

  // ---------- pointer: lantern + hub drift ----------
  const onPointerMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    ptr.current = { x, y, active: true };
    e.currentTarget.style.setProperty("--mx", `${x}px`);
    e.currentTarget.style.setProperty("--my", `${y}px`);
    if (reducedMotion || !hubRef.current) return;
    const nx = (x - r.width / 2) / (r.width / 2);
    const ny = (y - r.height / 2) / (r.height / 2);
    hubRef.current.style.setProperty("--hub-x", `${(nx * 34).toFixed(1)}px`);
    hubRef.current.style.setProperty("--hub-y", `${(ny * 24).toFixed(1)}px`);
    hubRef.current.style.setProperty("--tilt-x", `${(-ny * 20).toFixed(1)}deg`);
    hubRef.current.style.setProperty("--tilt-y", `${(nx * 26).toFixed(1)}deg`);
  };

  const onPointerLeave = () => {
    ptr.current.active = false;
    const h = hubRef.current;
    if (!h) return;
    ["--hub-x", "--hub-y"].forEach((k) => h.style.setProperty(k, "0px"));
    ["--tilt-x", "--tilt-y"].forEach((k) => h.style.setProperty(k, "0deg"));
  };

  // ---------- canvas: stars, web, sparks ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    const section = sectionRef.current;
    if (!canvas || !section) return;
    const g = canvas.getContext("2d");
    if (!g) return;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let stars: Star[] = [];
    let raf = 0;
    let lit = 0; // smoothed 0..1 "how awake is the room"
    let running = false;

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      w = section.clientWidth;
      h = section.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, Math.max(28, (w * h) / 16000)));
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 0.6 + Math.random() * 1.4,
        tw: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
      }));
    };

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    burstRef.current = () => {
      const cx = w / 2;
      const cy = h / 2 - 20;
      const count = reducedRef.current ? 0 : 90;
      for (let i = 0; i < count; i++) {
        const a = Math.random() * Math.PI * 2;
        const v = 1.5 + Math.random() * 5.5;
        sparks.current.push({ x: cx, y: cy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1, warm: Math.random() > 0.35 });
      }
    };

    const frame = (t: number) => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      g.clearRect(0, 0, w, h);
      const st = stageRef.current;
      const target = st === 0 ? 0 : st === 1 ? 0.45 : st === 2 ? 0.8 : 1;
      lit += (target - lit) * 0.04;
      const real = ptr.current;
      // no pointer (phones, or cursor left): the lantern wanders by itself
      const p = real.active
        ? real
        : { x: w / 2 + Math.sin(t / 1700) * w * 0.28, y: h / 2 + Math.cos(t / 1300) * h * 0.22, active: true };
      if (!real.active) {
        section.style.setProperty("--mx", `${p.x.toFixed(0)}px`);
        section.style.setProperty("--my", `${p.y.toFixed(0)}px`);
      }
      const reach = 170 + lit * 260; // lantern radius grows as the room wakes up

      for (const s of stars) {
        if (!reducedRef.current) {
          s.x += s.vx;
          s.y += s.vy;
          if (s.x < 0) s.x = w;
          if (s.x > w) s.x = 0;
          if (s.y < 0) s.y = h;
          if (s.y > h) s.y = 0;
        }
      }

      // web between nearby stars, only once the room is awake enough
      if (lit > 0.5) {
        const maxD = 120;
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const a = stars[i];
            const b = stars[j];
            const d = Math.hypot(a.x - b.x, a.y - b.y);
            if (d > maxD) continue;
            const mx = (a.x + b.x) / 2;
            const my = (a.y + b.y) / 2;
            const near = p.active ? Math.max(0, 1 - Math.hypot(mx - p.x, my - p.y) / (reach * 1.3)) : 0;
            const alpha = (1 - d / maxD) * (0.05 + near * 0.35) * (lit - 0.4);
            if (alpha < 0.01) continue;
            g.strokeStyle = `rgba(190,225,255,${alpha.toFixed(3)})`;
            g.lineWidth = 0.6;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }
      }

      for (const s of stars) {
        const prox = p.active ? Math.max(0, 1 - Math.hypot(s.x - p.x, s.y - p.y) / reach) : 0;
        const twinkle = 0.65 + 0.35 * Math.sin(t / 700 + s.tw);
        const a = (prox * 0.95 + lit * 0.22) * twinkle;
        if (a < 0.01) continue;
        g.fillStyle = `rgba(215,235,255,${Math.min(1, a).toFixed(3)})`;
        g.beginPath();
        g.arc(s.x, s.y, s.r * (1 + prox * 0.6), 0, Math.PI * 2);
        g.fill();
        // the stars lean toward the cursor once the room is awake
        if (st >= 2 && p.active && prox > 0.2 && !reducedRef.current) {
          s.x += (p.x - s.x) * 0.0016 * prox;
          s.y += (p.y - s.y) * 0.0016 * prox;
        }
      }

      const list = sparks.current;
      for (let i = list.length - 1; i >= 0; i--) {
        const s = list[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.965;
        s.vy *= 0.965;
        s.life -= 0.014;
        if (s.life <= 0) {
          list.splice(i, 1);
          continue;
        }
        g.fillStyle = s.warm ? `rgba(255,196,128,${s.life.toFixed(3)})` : `rgba(200,230,255,${s.life.toFixed(3)})`;
        g.beginPath();
        g.arc(s.x, s.y, 1 + s.life * 1.6, 0, Math.PI * 2);
        g.fill();
      }
    };

    size();
    const ro = new ResizeObserver(size);
    ro.observe(section);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) start();
        else stop();
      },
      { threshold: 0.05 },
    );
    io.observe(section);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  useEffect(() => () => stopAudio(), [stopAudio]);

  return (
    <section
      id="discover"
      ref={sectionRef}
      className={`disc stage-${stage}`}
      style={MONO}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate(e);
        }
      }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      role="button"
      tabIndex={0}
      aria-label={stage === 0 ? "Explore discovery" : "Continue discovery"}
    >
      <style>{CSS}</style>
      <audio ref={audioRef} preload="none" playsInline />

            <canvas ref={canvasRef} className="disc-canvas" aria-hidden />
      <div className="disc-lantern" aria-hidden />

      <div ref={hubRef} className="disc-hub">
        <div className={`disc-orb ${reacting ? "is-reacting" : ""}`} aria-hidden>
          <span key={pulse} className="disc-shock" />
          <span className={`disc-invite ${stage === 0 || (idle && stage < 3) ? "on" : ""}`} />
          <div className="disc-halo" />
          <div className="disc-sphere">
            <div className="disc-spin">
              {LATS.map((l) => (
                <span key={`a${l}`} className="disc-ring" style={{ transform: `rotateX(${l}deg)` }} />
              ))}
              {LONS.map((l) => (
                <span key={`o${l}`} className="disc-ring" style={{ transform: `rotateY(${l}deg)` }} />
              ))}
            </div>
            <span className="disc-glass" />
          </div>
          <span className="disc-orbit disc-orbit-a" />
          <span className="disc-orbit disc-orbit-b" />
          <span className="disc-orbit disc-orbit-c" />
        </div>

        <div className="disc-text">
        <p className={`disc-hint ${stage === 0 ? "on" : ""}`}>{touch ? "It's dark in here. Tap the light." : "It's dark in here. Move around, then click the light."}</p>

        <div className="disc-message" aria-live="polite" style={SERIF}>
          {lines.map((line, li) => (
            <p key={`${stage}-${pulse}-${li}`} className="disc-line">
              {Array.from(line).map((ch, ci) => (
                <span
                  key={ci}
                  className="disc-ch"
                  style={{ animationDelay: `${(li * 0.9 + ci * 0.035).toFixed(3)}s` }}
                >
                  {ch === " " ? "\u00A0" : ch}
                </span>
              ))}
            </p>
          ))}
        </div>

        <p className={`disc-again ${idle && stage > 0 && stage < 3 ? "on" : ""}`}>{touch ? "Tap again" : "Click again"}</p>

        <a
          href="#projects"
          data-discovery-ignore
          className={`disc-cta ${stage === 3 ? "on" : ""}`}
          tabIndex={stage === 3 ? 0 : -1}
          onClick={(e) => e.stopPropagation()}
        >
          Keep exploring
          <span aria-hidden> ↓</span>
        </a>
        </div>
      </div>

      <button
        type="button"
        data-discovery-ignore
        className="disc-mute"
        aria-label={muted ? "Unmute voice" : "Mute voice"}
        aria-pressed={muted}
        onClick={(e) => {
          e.stopPropagation();
          setMuted((m) => {
            const next = !m;
            if (next) stopAudio();
            return next;
          });
        }}
      >
        {muted ? <MuteIcon /> : <SoundIcon />}
      </button>
    </section>
  );
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="M15.5 8.5a4 4 0 0 1 0 7" />
      <path d="M18 6a7 7 0 0 1 0 12" />
    </svg>
  );
}

function MuteIcon() {
  return (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M11 5 6 9H3v6h3l5 4V5Z" />
      <path d="m16 10 5 5M21 10l-5 5" />
    </svg>
  );
}

const CSS = `
.disc{--mx:50%;--my:50%;--ink:#06070b;--star:#cfe6ff;--fil:#ffc88a;--fil2:#ff9d4d;
  --orb:min(42vw,170px);--h:clamp(600px,80svh,760px);position:relative;overflow:hidden;min-height:var(--h);background:transparent;cursor:pointer;color:var(--star);outline:none;isolation:isolate}
.disc:focus-visible{box-shadow:inset 0 0 0 2px rgba(207,230,255,.5)}
.disc-canvas{position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none}
.disc-lantern{position:absolute;inset:0;z-index:2;pointer-events:none;
  background:radial-gradient(260px circle at var(--mx) var(--my),rgba(207,230,255,.10),transparent 70%);mix-blend-mode:screen}
.disc-hub{--hub-x:0px;--hub-y:0px;--tilt-x:0deg;--tilt-y:0deg;position:relative;z-index:3;min-height:var(--h);display:flex;flex-direction:column;
  align-items:center;justify-content:center;padding:2rem 1.5rem;transform:translate3d(var(--hub-x),var(--hub-y),0);transition:transform .5s cubic-bezier(.2,.8,.2,1)}

/* ---- orb ---- */
.disc-orb{--lit:.12;position:relative;width:var(--orb);aspect-ratio:1;perspective:900px;transition:transform 1.2s cubic-bezier(.2,.8,.2,1);
  transform:rotateX(var(--tilt-x)) rotateY(var(--tilt-y))}
.stage-1 .disc-orb{--lit:.5}.stage-2 .disc-orb{--lit:.8;transform:rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale(1.12)}
.stage-3 .disc-orb{--lit:1;transform:rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale(1.3)}
.disc-orb.is-reacting{animation:disc-jolt .9s cubic-bezier(.2,.8,.2,1)}
.disc-halo{position:absolute;inset:-70%;border-radius:50%;background:radial-gradient(circle,rgba(255,176,100,calc(var(--lit)*.55)),rgba(255,140,60,calc(var(--lit)*.12)) 40%,transparent 68%);
  transition:background 1s;animation:disc-breathe 4.5s ease-in-out infinite}
.disc-sphere{position:absolute;inset:0;transform-style:preserve-3d;border-radius:50%}
.disc-spin{position:absolute;inset:0;transform-style:preserve-3d;animation:disc-spin 22s linear infinite}
.stage-2 .disc-spin{animation-duration:12s}.stage-3 .disc-spin{animation-duration:7s}
.disc-ring{position:absolute;inset:0;border-radius:50%;border:1px solid rgba(255,214,170,calc(.12 + var(--lit)*.6));transition:border-color 1s;
  box-shadow:0 0 calc(var(--lit)*10px) rgba(255,170,90,calc(var(--lit)*.5))}
  box-shadow:0 0 calc(10px + var(--lit)*40px) calc(var(--lit)*10px) rgba(255,170,90,.8);opacity:calc(.25 + var(--lit)*.75);transition:opacity 1s}
.disc-glass{position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.22),transparent 38%);pointer-events:none}
.disc-orbit{position:absolute;inset:-18%;border-radius:50%;border:1px dashed rgba(207,230,255,.0);transition:border-color 1.2s}
.disc-orbit::after{content:"";position:absolute;top:-3px;left:50%;width:6px;height:6px;margin-left:-3px;border-radius:50%;background:var(--star);box-shadow:0 0 12px var(--star)}
.disc-orbit-a{animation:disc-orb 9s linear infinite}
.disc-orbit-b{inset:-34%;animation:disc-orb 15s linear infinite reverse;transform:rotateX(68deg)}
.disc-orbit-c{inset:-52%;animation:disc-orb 24s linear infinite;transform:rotateY(64deg)}
.disc-orbit::after{opacity:0;transition:opacity 1s}
.stage-2 .disc-orbit-a::after,.stage-2 .disc-orbit-b::after,.stage-3 .disc-orbit::after{opacity:1}
.stage-2 .disc-orbit,.stage-3 .disc-orbit{border-color:rgba(207,230,255,.14)}
.disc-shock{position:absolute;left:50%;top:50%;width:100%;aspect-ratio:1;margin:-50% 0 0 -50%;border-radius:50%;border:2px solid rgba(255,214,170,.9);
  opacity:0;animation:disc-shock 1.3s cubic-bezier(.1,.7,.2,1)}
.disc-shock:first-child{animation-play-state:running}

/* ---- text ---- */
.disc-text{position:absolute;left:50%;top:calc(50% + var(--orb)*.7 + 1.5rem);width:min(32rem,calc(100vw - 3rem));transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;text-align:center}
.disc-hint{margin-top:0;font-size:13px;letter-spacing:.04em;color:rgba(207,230,255,.75);opacity:0;transition:opacity .8s;animation:disc-hint 3.2s ease-in-out infinite}
.disc-hint.on{opacity:1}
.disc:not(.stage-0) .disc-hint{display:none}
.disc-message{margin-top:0;min-height:4rem;max-width:30rem;text-align:center}
.disc-line{font-size:clamp(1.25rem,3.4vw,1.75rem);line-height:1.35;font-style:italic;color:#fff4e6;text-shadow:0 0 24px rgba(255,170,90,.35)}
.disc-ch{display:inline-block;opacity:0;filter:blur(6px);transform:translateY(8px);animation:disc-ch .55s cubic-bezier(.2,.8,.2,1) forwards}
.disc-invite{position:absolute;left:50%;top:50%;width:100%;aspect-ratio:1;margin:-50% 0 0 -50%;border-radius:50%;border:1px solid rgba(255,214,170,.75);opacity:0;pointer-events:none}
.disc-invite.on{animation:disc-invite 2.4s ease-out infinite}
.disc-again{margin-top:1rem;font-size:12px;letter-spacing:.06em;color:rgba(207,230,255,.55);opacity:0;transition:opacity .8s}
.disc-again.on{opacity:1}
.disc-cta{margin-top:1.75rem;font-size:12px;letter-spacing:.12em;color:rgba(207,230,255,.7);padding:.7rem 1.2rem;border:1px solid rgba(207,230,255,.25);border-radius:999px;
  opacity:0;transform:translateY(8px);pointer-events:none;transition:opacity .9s 2.6s,transform .9s 2.6s,color .2s,border-color .2s,background .2s}
.disc-cta.on{opacity:1;transform:none;pointer-events:auto}
.disc-cta:hover,.disc-cta:focus-visible{color:#fff;border-color:var(--fil);background:rgba(255,170,90,.12);outline:none}
.disc-mute{position:absolute;right:1.5rem;bottom:1.5rem;z-index:5;width:36px;height:36px;display:flex;align-items:center;justify-content:center;border-radius:50%;
  border:1px solid rgba(207,230,255,.18);color:rgba(207,230,255,.55);background:transparent;cursor:pointer;transition:color .2s,border-color .2s}
.disc-mute:hover,.disc-mute:focus-visible{color:#fff;border-color:rgba(207,230,255,.5);outline:none}

@keyframes disc-spin{to{transform:rotateY(360deg) rotateX(18deg)}}
@keyframes disc-orb{to{transform:rotate(360deg)}}
@keyframes disc-breathe{50%{opacity:.7;transform:scale(1.06)}}
@keyframes disc-hint{50%{opacity:.5}}
@keyframes disc-invite{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
@keyframes disc-ch{to{opacity:1;filter:blur(0);transform:none}}
@keyframes disc-shock{0%{opacity:.9;transform:scale(.4)}100%{opacity:0;transform:scale(7)}}
@keyframes disc-jolt{0%{filter:brightness(1)}15%{filter:brightness(2.6) saturate(1.3);transform:rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale(.9)}100%{filter:brightness(1)}}

@media (max-width:640px){
  .disc{--orb:min(46vw,150px);--h:clamp(560px,78svh,680px)}
  .stage-2 .disc-orb{transform:rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale(1.06)}
  .stage-3 .disc-orb{transform:rotateX(var(--tilt-x)) rotateY(var(--tilt-y)) scale(1.15)}
  .disc-text{top:calc(50% + var(--orb)*.62 + 1.25rem)}
  .disc-mute{right:1rem;bottom:1rem}
}
@media (prefers-reduced-motion:reduce){
  .disc-spin,.disc-orbit,.disc-halo,.disc-hint{animation:none}
  .disc-ch{animation-duration:.01s;animation-delay:0s!important;filter:none;transform:none}
  .disc-orb.is-reacting{animation:none}.disc-shock{animation:none}
  .disc-invite.on{animation:none;opacity:.5;transform:scale(1.4)}
  .disc-hub,.disc-orb{transition:none}
}
`;