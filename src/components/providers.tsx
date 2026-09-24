"use client";

import { MotionConfig } from "framer-motion";

/** Framer Motion respects the visitor's reduced-motion setting everywhere. */
export function Providers({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
