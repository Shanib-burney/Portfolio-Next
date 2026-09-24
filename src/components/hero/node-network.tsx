"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Becomes true once the editor "runs": edges brighten and request pulses start. */
  alive: boolean;
  reduce: boolean;
  /** Element whose pointer movement drives the parallax. */
  hostRef: React.RefObject<HTMLElement | null>;
};

type Node = { bx: number; by: number; z: number; r: number; ph: number };

/** Unlabeled system graph behind the hero: nodes, edges and request pulses. Pure canvas. */
export function NodeNetwork({ alive, reduce, hostRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const aliveTarget = useRef(alive ? 1 : 0);

  useEffect(() => {
    aliveTarget.current = alive ? 1 : 0;
  }, [alive]);

  useEffect(() => {
    const cv = canvasRef.current;
    const host = hostRef.current;
    if (!cv || !host) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let W = 0;
    let H = 0;
    let nodes: Node[] = [];
    let edges: [number, number][] = [];
    let pulses: { e: [number, number]; p: number; v: number }[] = [];
    let mx = 0,
      my = 0,
      tmx = 0,
      tmy = 0,
      lit = aliveTarget.current,
      raf = 0,
      visible = true;

    const center = () => (W > 980 ? [W * 0.72, H * 0.5] : [W * 0.5, H * 0.74]) as [number, number];

    function build() {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = cv!.clientWidth;
      H = cv!.clientHeight;
      cv!.width = W * dpr;
      cv!.height = H * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const wide = W > 980;
      const [cx, cy] = center();
      const rx = wide ? W * 0.3 : W * 0.48;
      const ry = wide ? H * 0.42 : H * 0.24;
      let seed = 7;
      const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
      nodes = Array.from({ length: wide ? 18 : 12 }, () => {
        const a = rnd() * Math.PI * 2;
        const r = Math.sqrt(rnd());
        return { bx: cx + Math.cos(a) * rx * r, by: cy + Math.sin(a) * ry * r, z: 0.4 + rnd() * 0.9, r: 1.6 + rnd() * 2.2, ph: rnd() * 6.28 };
      });
      edges = [];
      nodes.forEach((n, i) => {
        nodes
          .map((m, j) => [j, (m.bx - n.bx) ** 2 + (m.by - n.by) ** 2] as const)
          .filter(([j]) => j !== i)
          .sort((a, b) => a[1] - b[1])
          .slice(0, 2)
          .forEach(([j]) => {
            if (!edges.some(([a, b]) => a === j && b === i)) edges.push([i, j]);
          });
      });
      pulses = [];
    }

    function frame(t: number) {
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent-rgb").trim() || "99, 102, 241";
      const scrollP = Math.max(0, Math.min(1, window.scrollY / (host!.offsetHeight * 0.8)));
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;
      lit += (aliveTarget.current - lit) * 0.04;
      const fade = 1 - scrollP * 0.85;
      const spread = 1 + scrollP * 0.9;
      const [cx, cy] = center();

      const P = nodes.map((n) => {
        const float = reduce ? 0 : Math.sin(t / 1600 + n.ph) * 5;
        return [cx + (n.bx - cx) * spread + mx * 18 * n.z, cy + (n.by - cy) * spread + my * 14 * n.z + float] as [number, number];
      });

      ctx!.clearRect(0, 0, W, H);
      ctx!.lineWidth = 1;
      ctx!.strokeStyle = `rgba(${accent}, ${(0.08 + lit * 0.14) * fade})`;
      for (const [a, b] of edges) {
        ctx!.beginPath();
        ctx!.moveTo(...P[a]!);
        ctx!.lineTo(...P[b]!);
        ctx!.stroke();
      }

      if (!reduce && lit > 0.3 && pulses.length < 10 && Math.random() < 0.06) {
        const e = edges[(Math.random() * edges.length) | 0]!;
        pulses.push({ e: Math.random() < 0.5 ? e : [e[1], e[0]], p: 0, v: 0.008 + Math.random() * 0.012 });
      }
      pulses = pulses.filter((pl) => (pl.p += pl.v) < 1);
      for (const pl of pulses) {
        const A = P[pl.e[0]]!;
        const B = P[pl.e[1]]!;
        const x = A[0] + (B[0] - A[0]) * pl.p;
        const y = A[1] + (B[1] - A[1]) * pl.p;
        const g = ctx!.createRadialGradient(x, y, 0, x, y, 10);
        g.addColorStop(0, `rgba(${accent}, ${0.9 * fade})`);
        g.addColorStop(1, `rgba(${accent}, 0)`);
        ctx!.fillStyle = g;
        ctx!.beginPath();
        ctx!.arc(x, y, 10, 0, 6.28);
        ctx!.fill();
      }

      nodes.forEach((n, i) => {
        const [x, y] = P[i]!;
        const tw = reduce ? 1 : 0.75 + Math.sin(t / 900 + n.ph) * 0.25;
        ctx!.fillStyle = `rgba(${accent}, ${(0.25 + lit * 0.55) * tw * fade})`;
        ctx!.beginPath();
        ctx!.arc(x, y, n.r * (0.8 + n.z * 0.3), 0, 6.28);
        ctx!.fill();
      });

      if (!reduce && visible) raf = requestAnimationFrame(frame);
    }

    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width - 0.5;
      tmy = (e.clientY - r.top) / r.height - 0.5;
    };
    const onResize = () => {
      build();
      if (reduce) frame(0);
    };
    const io = new IntersectionObserver(([entry]) => {
      const was = visible;
      visible = Boolean(entry?.isIntersecting);
      if (visible && !was && !reduce) raf = requestAnimationFrame(frame);
    });

    build();
    if (reduce) {
      lit = 1;
      frame(0);
    } else {
      raf = requestAnimationFrame(frame);
      host.addEventListener("pointermove", onMove);
    }
    window.addEventListener("resize", onResize);
    io.observe(cv);

    return () => {
      cancelAnimationFrame(raf);
      host.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      io.disconnect();
    };
  }, [hostRef, reduce]);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full" />;
}
