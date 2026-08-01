/**
 * App.tsx
 *
 * Root of the HYK Portfolio application.
 * Manages the boot → desktop transition.
 */

import { useState, useCallback } from "react"
import BootScreen from "./components/boot/BootScreen"
import Desktop from "./components/desktop/Desktop"

type Phase = "boot" | "transitioning" | "desktop"

export default function App() {
  const [phase, setPhase] = useState<Phase>("boot")

  // Called by BootScreen once its exit fade completes.
  // Desktop is pre-mounted slightly before the boot screen fully disappears
  // so the crossfade feels seamless — no black flash between layers.
  const handleBootComplete = useCallback(() => {
    setPhase("transitioning")
    setTimeout(() => setPhase("desktop"), 750)
  }, [])

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Boot screen — unmounted after crossfade completes */}
      {(phase === "boot" || phase === "transitioning") && (
        <BootScreen onComplete={handleBootComplete} />
      )}

      {/* Desktop — pre-mounted during transition for seamless crossfade */}
      {(phase === "transitioning" || phase === "desktop") && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            opacity: phase === "desktop" ? 1 : 0,
            transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Desktop />
        </div>
      )}
    </div>
  )
}
