import { useState, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import type { AppId } from "./Desktop"
import folderSvg from "@/assets/icons/folder.svg"
import trashSvg from "@/assets/icons/trash.svg"
import terminalSvg from "@/assets/icons/terminal.svg"
import browserSvg from "@/assets/icons/browser.svg"
import profileSvg from "@/assets/icons/profile.svg"
import pdfSvg from "@/assets/icons/pdf.svg"
import graduationSvg from "@/assets/icons/graduation.svg"
import briefcaseSvg from "@/assets/icons/briefcase.svg"

const ICON_MAP: Record<AppId, string> = {
  projects: folderSvg,
  experience: briefcaseSvg,
  education: graduationSvg,
  gallery: folderSvg,
  resume: pdfSvg,
  browser: browserSvg,
  terminal: terminalSvg,
  profile: profileSvg,
  recycle: trashSvg,
  editor: pdfSvg,
}

const WifiIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3" />
  </svg>
)

const VolumeIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill="currentColor" fillOpacity="0.28" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
)

const BatteryIcon = () => (
  <svg
    width="18"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
    <line x1="22" y1="11" x2="22" y2="13" />
    <rect x="4" y="9" width="9" height="6" fill="currentColor" fillOpacity="0.26" stroke="none" />
  </svg>
)

const BluetoothIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.4"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 6 18 18 12 24" transform="translate(0 -4)" />
    <polyline points="6 18 18 6 12 0" transform="translate(0 4)" />
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
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        width: 36,
        height: 36,
        borderRadius: 12,
        border: "none",
        background: "transparent",
        transition: "background 0.2s ease",
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
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
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
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
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
    </button>
  )
}

type RunningApp = {
  id: string
  appId: AppId
  title: string
  minimized: boolean
}

type TopBarProps = {
  isDark: boolean
  onToggleTheme: () => void
  runningApps: RunningApp[]
  activeWindowId: string | null
  onAppClick: (id: string) => void
}

export default function TopBar({
  isDark,
  onToggleTheme,
  runningApps,
  activeWindowId,
  onAppClick,
}: TopBarProps) {
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
        top: 16,
        left: 24,
        right: 24,
        minHeight: 52,
        background: t.isDark ? "rgba(18,18,20,0.94)" : "rgba(250,250,252,0.96)",
        backdropFilter: "blur(26px)",
        border: t.isDark
          ? "1px solid rgba(255,255,255,0.08)"
          : "1px solid rgba(0,0,0,0.1)",
        borderRadius: 24,
        boxShadow: t.isDark
          ? "0 40px 120px rgba(0,0,0,0.18)"
          : "0 30px 90px rgba(15,15,15,0.08)",
        display: "grid",
        gridTemplateColumns: "minmax(220px, 1fr) auto minmax(220px, 1fr)",
        alignItems: "center",
        gap: 14,
        padding: "10px 20px",
        zIndex: 10001,
        userSelect: "none",
        transition: t.transition,
      }}
    >
      {/* Left: running applications */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          minWidth: 0,
          overflow: "hidden",
        }}
      >
        {runningApps.map((app) => {
          const active = app.id === activeWindowId
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => onAppClick(app.id)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 16,
                border: "none",
                background: active
                  ? t.isDark
                    ? "rgba(96, 165, 250, 0.18)"
                    : "rgba(59, 130, 246, 0.11)"
                  : "transparent",
                color: active
                  ? t.isDark
                    ? "#e0f2fe"
                    : "#1d4ed8"
                  : t.isDark
                    ? "rgba(255,255,255,0.8)"
                    : "rgba(17,24,39,0.85)",
                cursor: "pointer",
                minWidth: 0,
                transition: "background 0.2s ease, color 0.2s ease, transform 0.2s ease",
                boxShadow: active
                  ? t.isDark
                    ? "0 0 0 1px rgba(96,165,250,0.14)"
                    : "0 0 0 1px rgba(59,130,246,0.12)"
                  : "none",
              }}
              onMouseEnter={(e) => {
                if (!active) e.currentTarget.style.background = t.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)"
                e.currentTarget.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={(e) => {
                if (!active) e.currentTarget.style.background = "transparent"
                e.currentTarget.style.transform = "translateY(0)"
              }}
            >
              <img
                src={ICON_MAP[app.appId]}
                alt={app.title}
                draggable={false}
                style={{
                  width: 18,
                  height: 18,
                  objectFit: "contain",
                  filter: active ? "none" : t.isDark ? "brightness(0.88)" : "brightness(0.8)",
                }}
              />
              <span
                style={{
                  fontSize: "0.78rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: 120,
                }}
              >
                {app.title}
              </span>
            </button>
          )
        })}
      </div>

      {/* Center: Live clock + Date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          padding: "6px 14px",
          background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
          borderRadius: 999,
          border: t.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          boxShadow: t.isDark ? "inset 0 0 0 1px rgba(255,255,255,0.02)" : "inset 0 0 0 1px rgba(0,0,0,0.02)",
          justifySelf: "center",
        }}
      >
        <span
          style={{
            color: t.isDark ? "rgba(255,255,255,0.92)" : "rgba(17,24,39,0.92)",
            fontSize: "0.82rem",
            fontWeight: 600,
            fontFamily: "'JetBrains Mono', monospace",
            letterSpacing: "0.04em",
            transition: t.transition,
          }}
        >
          {hh}:{mm}
        </span>
        <span
          style={{
            color: t.isDark ? "rgba(255,255,255,0.28)" : "rgba(17,24,39,0.35)",
            fontSize: "0.82rem",
            transition: t.transition,
          }}
        >
          |
        </span>
        <span
          style={{
            color: t.isDark ? "rgba(255,255,255,0.66)" : "rgba(17,24,39,0.66)",
            fontSize: "0.78rem",
            fontWeight: 500,
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
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 14,
          color: t.isDark ? "rgba(255,255,255,0.78)" : "rgba(17,24,39,0.85)",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 12px",
            borderRadius: 14,
            background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
            border: t.isDark ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <WifiIcon />
          <VolumeIcon />
          <BatteryIcon />
          <BluetoothIcon />
        </div>
        <ThemeToggleIcon isDark={isDark} onToggle={onToggleTheme} />
      </div>
    </div>
  )
}
