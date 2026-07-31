import { useEffect, useState } from "react"
import hykLogo from "@/imports/light.jpg"

type Props = { onComplete: () => void }

export default function BootScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<"logo" | "glow" | "subtitle" | "fadeout">("logo")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glow"), 700)
    const t2 = setTimeout(() => setPhase("subtitle"), 1500)
    const t3 = setTimeout(() => setPhase("fadeout"), 3000)
    const t4 = setTimeout(() => onComplete(), 3600)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onComplete])

  const glowing = phase === "glow" || phase === "subtitle" || phase === "fadeout"

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "2.5rem",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: phase === "fadeout" ? "opacity 0.6s ease" : "none",
        zIndex: 9999,
      }}
    >
      <img
        src={hykLogo}
        alt="HYK"
        style={{
          width: "clamp(140px, 18vw, 220px)",
          height: "auto",
          display: "block",
          animation: "hykAppear 0.6s ease forwards",
          filter: glowing
            ? "invert(1) drop-shadow(0 0 30px rgba(74,222,128,0.5)) drop-shadow(0 0 70px rgba(74,222,128,0.2))"
            : "invert(1)",
          transition: "filter 1.2s ease",
        }}
      />

      <p
        style={{
          color: "rgba(255,255,255,0.42)",
          fontSize: "0.8rem",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.06em",
          margin: 0,
          opacity: phase === "subtitle" || phase === "fadeout" ? 1 : 0,
          transform: phase === "subtitle" || phase === "fadeout" ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.7s ease, transform 0.7s ease",
        }}
      >
        Not everything running can be seen in htop.
      </p>
    </div>
  )
}
