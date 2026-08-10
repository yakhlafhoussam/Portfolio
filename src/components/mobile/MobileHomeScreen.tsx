import { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import MobileAppIcon, { type IconType } from "./MobileAppIcon"
import type { AppId } from "../desktop/Desktop"

type IconItem = {
  id: AppId
  label: string
  type: IconType
}

// Hardcoded mobile app list — includes all relevant apps for a phone context
const MOBILE_APPS: IconItem[] = [
  { id: "browser",    label: "Browser",    type: "browser"    },
  { id: "terminal",   label: "Terminal",   type: "terminal"   },
  { id: "profile",    label: "Profile",    type: "person"     },
  { id: "projects",   label: "Files",      type: "folder"     },
  { id: "gallery",    label: "Gallery",    type: "folder"     },
  { id: "resume",     label: "Resume",     type: "pdf"        },
  { id: "experience", label: "Experience", type: "briefcase"  },
  { id: "education",  label: "Education",  type: "graduation" },
  { id: "recycle",    label: "Trash",      type: "trash"      },
]

type Props = {
  onOpenApp: (appId: AppId) => void
}

export default function MobileHomeScreen({ onOpenApp }: Props) {
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
        // Extra bottom padding so last row isn't hidden behind the nav bar
        paddingBottom: 8,
      }}
    >
      {/* ── Premium Date/Time Header ── */}
      <div
        style={{
          padding: "28px 24px 20px",
          userSelect: "none",
        }}
      >
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
