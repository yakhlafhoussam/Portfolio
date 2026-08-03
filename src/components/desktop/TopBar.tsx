import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"

const WifiIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.8 }}
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
  </svg>
)

const VolumeIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.8 }}
  >
    <polygon
      points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"
      fill="currentColor"
      fillOpacity="0.3"
    />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)

const BatteryIcon = () => (
  <svg
    width="20"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    style={{ opacity: 0.8 }}
  >
    <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
    <line x1="22" y1="11" x2="22" y2="13" />
    <rect x="4" y="9" width="9" height="6" fill="currentColor" stroke="none" />
  </svg>
)

const ThemeToggleIcon = ({
  isDark,
  onToggle,
}: {
  isDark: boolean
  onToggle: () => void
}) => {
  const t = useTheme()
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        padding: 4,
        borderRadius: 4,
        transition: "background 0.2s",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = t.isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.06)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      title="Toggle Theme"
    >
      {isDark ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.8 }}
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.8 }}
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </div>
  )
}

type TopBarProps = {
  isDark: boolean
  onToggleTheme: () => void
}

export default function TopBar({ isDark, onToggleTheme }: TopBarProps) {
  const t = useTheme()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = time.getHours().toString().padStart(2, "0")
  const mm = time.getMinutes().toString().padStart(2, "0")
  const dateStr = time.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  })

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 30,
        background: t.isDark ? "rgba(18,18,20,0.92)" : "rgba(240,240,243,0.92)",
        backdropFilter: "blur(12px)",
        borderBottom: t.isDark
          ? "1px solid rgba(255,255,255,0.06)"
          : "1px solid rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        zIndex: 9000,
        userSelect: "none",
        transition: t.transition,
      }}
    >
      {/* Left: HYK Typography — clean and minimal GNOME-style */}
      <div
        style={{
          position: "absolute",
          left: 14,
          display: "flex",
          alignItems: "center",
          cursor: "default",
          userSelect: "none",
        }}
      >
        <span
          style={{
            color: t.isDark
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(0, 0, 0, 0.95)",
            fontSize: "0.82rem",
            fontWeight: 800,
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.22em",
            userSelect: "none",
            cursor: "default",
            transition: t.transition,
          }}
        >
          HYK
        </span>
      </div>

      {/* Center: Live clock + Date (exactly centered) */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <span
          style={{
            color: t.isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
            fontSize: "0.78rem",
            fontWeight: 500,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
            transition: t.transition,
          }}
        >
          {hh}:{mm}
        </span>
        <span
          style={{
            color: t.isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.16)",
            fontSize: "0.75rem",
            transition: t.transition,
          }}
        >
          |
        </span>
        <span
          style={{
            color: t.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
            fontSize: "0.75rem",
            fontWeight: 400,
            fontFamily: "'Inter', sans-serif",
            transition: t.transition,
          }}
        >
          {dateStr}
        </span>
      </div>

      {/* Right: Static system icons + Theme Toggle */}
      <div
        style={{
          position: "absolute",
          right: 14,
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: t.isDark ? "rgba(255,255,255,0.72)" : "rgba(0,0,0,0.72)",
          transition: t.transition,
        }}
      >
        <WifiIcon />
        <VolumeIcon />
        <BatteryIcon />
        <ThemeToggleIcon isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </div>
  )
}
