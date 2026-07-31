import { useState, useEffect } from "react"

export default function TopBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = time.getHours().toString().padStart(2, "0")
  const mm = time.getMinutes().toString().padStart(2, "0")
  const dateStr = time.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 30,
        background: "rgba(20,21,24,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9000,
        userSelect: "none",
      }}
    >
      {/* Status dot left */}
      <div
        style={{
          position: "absolute",
          left: 16,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#4ade80",
            boxShadow: "0 0 6px rgba(74,222,128,0.6)",
          }}
        />
        <span
          style={{
            color: "rgba(255,255,255,0.35)",
            fontSize: "0.7rem",
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
          }}
        >
          hyk@localhost
        </span>
      </div>

      {/* Center: date + time */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.75rem",
            fontWeight: 400,
          }}
        >
          {dateStr}
        </span>
        <span style={{ color: "rgba(255,255,255,0.12)", fontSize: "0.7rem" }}>·</span>
        <span
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: "0.8rem",
            fontWeight: 500,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
          }}
        >
          {hh}:{mm}
        </span>
      </div>
    </div>
  )
}
