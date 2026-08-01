/**
 * BootScreen.tsx
 *
 * HYK brand introduction — the first impression before the desktop.
 *
 * Design philosophy:
 *   The user should not think "nice loading animation."
 *   The user should think "what exactly is HYK?" — without the
 *   interface explicitly asking that question.
 *
 * Animation constants live in BootScreen.css so they can be
 * retuned without touching component logic.
 *
 * To replace the sentence, edit BOOT_MESSAGE below.
 */

import { useEffect } from "react"
import "./BootScreen.css"

// ─── Easily replaceable message ────────────────────────────────────────────
const BOOT_MESSAGE = "What you discover depends on how deep you look."

// ─── Timing constants ───────────────────────────────────────────────────────
// The boot screen CSS handles its own exit fade via animation-delay.
// We unmount the component after the full animation completes so the
// desktop can take full control of the viewport.
const TOTAL_DURATION_MS = 4600 // exit-delay (3.6s) + exit-duration (0.8s) + 200ms buffer

// ─── Props ─────────────────────────────────────────────────────────────────
type Props = {
  /** Called once the boot crossfade is complete — switch to desktop. */
  onComplete: () => void
}

// ─── Component ─────────────────────────────────────────────────────────────
export default function BootScreen({ onComplete }: Props) {
  useEffect(() => {
    // Respect reduced-motion preference: skip immediately
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const delay = prefersReduced ? 600 : TOTAL_DURATION_MS
    const timer = setTimeout(onComplete, delay)
    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <div className="boot-root" aria-hidden="true">
      {/* HYK — color nearly black, revealed by glow not by light */}
      <h1 className="boot-word">HYK</h1>

      {/* Subtle sentence — low contrast, disappears with the screen */}
      <p className="boot-message">{BOOT_MESSAGE}</p>
    </div>
  )
}
