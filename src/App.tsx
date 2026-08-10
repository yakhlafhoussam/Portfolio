import { useState, useEffect, useCallback } from "react"
import BootScreen from "./components/boot/BootScreen"
import Desktop from "./components/desktop/Desktop"
import MobileShell from "./components/mobile/MobileShell"
import { ThemeContext, getTheme } from "./context/ThemeContext"
import { storageManager } from "./lib/storage"

type Phase = "boot" | "transitioning" | "desktop"

export default function App() {
  const [phase, setPhase] = useState<Phase>("boot")
  const [isDark, setIsDark] = useState(() => {
    // Read theme from storage if present; default to dark without writing anything.
    return (storageManager.readRaw()?.theme ?? "dark") === "dark"
  })
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768
    }
    return false
  })

  // Sync isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Theme configuration side-effect
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      document.documentElement.style.setProperty(
        "--scrollbar-thumb",
        "rgba(255,255,255,0.12)",
      )
      document.documentElement.style.setProperty(
        "--scrollbar-thumb-hover",
        "rgba(255,255,255,0.22)",
      )
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
      document.documentElement.style.setProperty(
        "--scrollbar-thumb",
        "rgba(0,0,0,0.15)",
      )
      document.documentElement.style.setProperty(
        "--scrollbar-thumb-hover",
        "rgba(0,0,0,0.25)",
      )
    }
  }, [isDark])

  // Called by BootScreen once its exit fade completes.
  // Shell is pre-mounted slightly before the boot screen fully disappears
  // so the crossfade feels seamless — no black flash between layers.
  const handleBootComplete = useCallback(() => {
    setPhase("transitioning")
    setTimeout(() => setPhase("desktop"), 750)
  }, [])

  return (
    <ThemeContext.Provider value={getTheme(isDark)}>
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

        {/* Shell — pre-mounted during transition for seamless crossfade */}
        {(phase === "transitioning" || phase === "desktop") && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              opacity: phase === "desktop" ? 1 : 0,
              transition: "opacity 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {isMobile ? (
              <MobileShell isDark={isDark} setIsDark={setIsDark} />
            ) : (
              <Desktop isDark={isDark} setIsDark={setIsDark} />
            )}
          </div>
        )}
      </div>
    </ThemeContext.Provider>
  )
}

