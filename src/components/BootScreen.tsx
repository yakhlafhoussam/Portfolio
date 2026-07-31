import { useEffect, useState } from "react"
import hykLogo from "@/imports/logo.jpg"

type Props = { onComplete: () => void }

export default function BootScreen({ onComplete }: Props) {
  const [phase, setPhase] = useState<"logo" | "glow" | "subtitle" | "fadeout">("logo")

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("glow"), 400)
    const t2 = setTimeout(() => setPhase("subtitle"), 1200)
    const t3 = setTimeout(() => setPhase("fadeout"), 2500)
    const t4 = setTimeout(() => onComplete(), 3100)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [onComplete])

  const glowing = phase === "glow" || phase === "subtitle" || phase === "fadeout"

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "#000000",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3rem",
        opacity: phase === "fadeout" ? 0 : 1,
        transition: phase === "fadeout" ? "opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
        zIndex: 9999,
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "clamp(160px, 20vw, 240px)",
          height: "clamp(160px, 20vw, 240px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "hykAppear 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        }}
      >
        {/* Soft, premium, hardware-like green glow behind */}
        <div
          style={{
            position: "absolute",
            inset: "-20%", // extend slightly beyond image boundaries
            background: "radial-gradient(circle, rgba(74, 222, 128, 0.42) 0%, rgba(74, 222, 128, 0.12) 35%, rgba(74, 222, 128, 0) 70%)",
            opacity: glowing ? 1 : 0,
            transition: "opacity 1.6s cubic-bezier(0.25, 1, 0.5, 1)",
            pointerEvents: "none",
          }}
        />

        {/* 
          Logo image:
          Inverted to become black text on a white background,
          then set to mix-blend-mode: multiply.
          White blends away completely, and the black text remains black,
          blocking the green glow behind it.
        */}
        <img
          src={hykLogo}
          alt="HYK"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "invert(1) brightness(0.04)",
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />
      </div>

      <p
        style={{
          color: "rgba(255,255,255,0.38)",
          fontSize: "0.78rem",
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.08em",
          margin: 0,
          opacity: phase === "subtitle" || phase === "fadeout" ? 1 : 0,
          transform: phase === "subtitle" || phase === "fadeout" ? "translateY(0)" : "translateY(8px)",
          transition: "opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1)",
        }}
      >
        Not everything running can be seen in htop.
      </p>
    </div>
  )
}
