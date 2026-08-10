import { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import MobileAppIcon, { type IconType } from "./MobileAppIcon"
import type { AppId } from "../desktop/Desktop"

type IconItem = {
  id: AppId
  label: string
  type: IconType
}

// Hardcoded mobile app list — excluding Terminal and Trash as requested
const MOBILE_APPS: IconItem[] = [
  { id: "browser",    label: "Browser",    type: "browser"    },
  { id: "profile",    label: "Profile",    type: "person"     },
  { id: "projects",   label: "Files",      type: "folder"     },
  { id: "gallery",    label: "Gallery",    type: "gallery"    },
  { id: "resume",     label: "Resume",     type: "pdf"        },
  { id: "experience", label: "Experience", type: "briefcase"  },
  { id: "education",  label: "Education",  type: "graduation" },
]

type Props = {
  onOpenApp: (appId: AppId) => void
  isDark: boolean
  onToggleTheme: () => void
}

export default function MobileHomeScreen({ onOpenApp, isDark, onToggleTheme }: Props) {
  const t = useTheme()
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
  const monthDay = date.toLocaleDateString("en-US", { month: "long", day: "numeric" })

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        boxSizing: "border-box",
        zIndex: 1,
        overflowY: "auto",
        paddingBottom: 8,
      }}
    >
      {/* ── Premium Date/Time Header & Theme Toggle ── */}
      <div
        style={{
          padding: "28px 24px 20px",
          userSelect: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: t.isDark ? "rgba(255,255,255,0.45)" : "rgba(0,0,0,0.4)",
              marginBottom: 4,
            }}
          >
            {weekday}
          </div>
          <div
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              color: t.isDark ? "#ffffff" : "#09090b",
              textShadow: t.isDark ? "0 2px 12px rgba(0,0,0,0.4)" : "none",
            }}
          >
            {monthDay}
          </div>
          <div
            style={{
              fontSize: "0.82rem",
              fontWeight: 500,
              color: t.isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)",
              marginTop: 6,
            }}
          >
            Welcome to HYK's Workspace
          </div>
        </div>

        {/* Circular Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          style={{
            background: t.isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            border: "none",
            borderRadius: "50%",
            width: 42,
            height: 42,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: t.text,
            cursor: "pointer",
            transition: "all 0.2s ease",
            marginTop: 4,
          }}
        >
          {isDark ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
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
      </div>

      {/* ── App Launcher Grid ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "4px 0px",
          justifyItems: "center",
          alignItems: "start",
          padding: "0 4px 16px",
        }}
      >
        {MOBILE_APPS.map((icon) => (
          <MobileAppIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            type={icon.type}
            onClick={() => onOpenApp(icon.id)}
          />
        ))}
      </div>
    </div>
  )
}
