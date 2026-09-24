"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { profile } from "@/content/profile";

/** Portrait with an indigo glow ring that tilts slightly toward the cursor. */
export function Portrait() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 18 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 18 });

  return (
    <div className="[perspective:1000px]">
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY }}
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set((e.clientX - r.left) / r.width - 0.5);
          my.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          mx.set(0);
          my.set(0);
        }}
        className="group relative mx-auto aspect-square w-full max-w-[380px]"
      >
        <div
          aria-hidden
          className="absolute -inset-6 rounded-[36px] bg-[radial-gradient(circle,rgba(var(--accent-rgb),0.35),transparent_65%)] opacity-70 blur-2xl transition-opacity group-hover:opacity-100"
        />
        <div className="relative size-full rounded-[28px] bg-[conic-gradient(from_140deg,rgba(var(--accent-rgb),0.9),rgba(var(--accent-rgb),0.15),rgba(var(--accent-rgb),0.7),rgba(var(--accent-rgb),0.15),rgba(var(--accent-rgb),0.9))] p-[2px]">
          <div className="relative size-full overflow-hidden rounded-[26px] bg-surface">
            <Image
              src={profile.portrait.src}
              alt={profile.portrait.alt}
              fill
              sizes="(min-width: 1024px) 380px, 80vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
            />
          </div>
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-line bg-surface px-3.5 py-1.5 font-mono text-[11.5px] whitespace-nowrap text-muted shadow-lg">
          <span className="text-ok">●</span> {profile.location}
        </div>
      </motion.div>
    </div>
  );
}
