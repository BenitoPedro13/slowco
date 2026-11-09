// Procedural wireframe globe on a 2D canvas (docs/tasks/TASK-M4-globe.md). Generic meridians and
// parallels, orthographic projection: NOT the client's globe artwork (stand-in, 08 #23).
// Animates only while visible, the tab is shown, motion is allowed and the user has not paused.

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "./use-reduced-motion";

const TURN_MS = 40_000;
const TILT = 0.38;

function draw(ctx: CanvasRenderingContext2D, size: number, angle: number, line: string, accent: string) {
  const r = size / 2 - 2;
  const c = size / 2;
  ctx.clearRect(0, 0, size, size);
  if (r <= 0) return; // not laid out yet (width 0): nothing to draw
  ctx.lineWidth = 1;
  ctx.strokeStyle = line;
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.stroke();

  const project = (lat: number, lon: number) => {
    const x = Math.cos(lat) * Math.sin(lon + angle);
    const y = Math.sin(lat);
    const z = Math.cos(lat) * Math.cos(lon + angle);
    // tilt around the x axis
    const y2 = y * Math.cos(TILT) - z * Math.sin(TILT);
    const z2 = y * Math.sin(TILT) + z * Math.cos(TILT);
    return { x: c + x * r, y: c - y2 * r, front: z2 >= 0 };
  };

  const path = (points: { x: number; y: number; front: boolean }[], color: string) => {
    ctx.strokeStyle = color;
    ctx.beginPath();
    let pen = false;
    for (const p of points) {
      if (!p.front) {
        pen = false;
        continue;
      }
      if (pen) ctx.lineTo(p.x, p.y);
      else ctx.moveTo(p.x, p.y);
      pen = true;
    }
    ctx.stroke();
  };

  const steps = 96;
  for (let m = 0; m < 12; m++) {
    const lon = (m / 12) * Math.PI * 2;
    path(
      Array.from({ length: steps + 1 }, (_, i) => project(-Math.PI / 2 + (i / steps) * Math.PI, lon)),
      line,
    );
  }
  for (let p = -3; p <= 3; p++) {
    const lat = (p / 4) * (Math.PI / 2);
    path(
      Array.from({ length: steps + 1 }, (_, i) => project(lat, (i / steps) * Math.PI * 2)),
      p === 0 ? accent : line,
    );
  }
}

export function useGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    let size = 0;
    let angle = 0.6;
    let frame = 0;
    let last = 0;
    let visible = true;

    const colors = () => {
      const s = getComputedStyle(canvas);
      return [s.getPropertyValue("--content").trim(), s.getPropertyValue("--accent").trim()] as const;
    };
    const resize = () => {
      const css = canvas.clientWidth;
      if (css <= 0) return; // ResizeObserver calls again once it has a size
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.height = Math.round(css * dpr);
      size = css;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const [line, accent] = colors();
      draw(ctx, size, angle, line, accent);
    };
    const running = () => !reduced && !paused && visible && !document.hidden;
    const tick = (t: number) => {
      frame = 0;
      if (!running() || size <= 0) return;
      if (last) angle += ((t - last) / TURN_MS) * Math.PI * 2;
      last = t;
      const [line, accent] = colors();
      draw(ctx, size, angle, line, accent);
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      last = 0;
      if (!frame && running()) frame = requestAnimationFrame(tick);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      start();
    });
    io.observe(canvas);
    // theme switches change the colours: redraw on the attribute change
    const mo = new MutationObserver(resize);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", start);
    start();
    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("visibilitychange", start);
    };
  }, [reduced, paused]);

  return { canvasRef, reduced, paused, toggle: () => setPaused((p) => !p) };
}
