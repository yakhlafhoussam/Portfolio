import { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import MobileAppIcon, { type IconType } from "./MobileAppIcon"
import type { AppId } from "../desktop/Desktop"

type IconItem = {
  id: AppId
  label: string
  type: IconType
}

type Props = {
  onOpenApp: (appId: AppId) => void
}

export default function MobileHomeScreen({ onOpenApp }: Props) {
  const t = useTheme()
  const [icons, setIcons] = useState<IconItem[]>([])
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    fetch("/content/desktop.json")
      .then((res) => res.json())
      .then((data) => setIcons(data))
      .catch((err) => console.error("Failed to load desktop icons:", err))
  }, [])

  useEffect(() => {
    const id = setInterval(() => setDate(new Date()), 60000)
    return () => clearInterval(id)
  }, [])

  const weekday = date.toLocaleDateString("en-US", { weekday: "long" })
  const monthDay = date.toLocaleDateString("en-US", { month: "short", day: "numeric" })

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "36px 20px 48px",
        boxSizing: "border-box",
        zIndex: 1,
        overflowY: "auto",
      }}
    >
      {/* Top section: Premium Header and Date */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          marginTop: 20,
          userSelect: "none",
          textAlign: "left",
        }}
      >
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: t.isDark ? "rgba(255, 255, 255, 0.45)" : "rgba(0, 0, 0, 0.45)",
          }}
        >
          {weekday}
        </div>
        <div
          style={{
            fontSize: "2.4rem",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
            color: t.isDark ? "#ffffff" : "#09090b",
            textShadow: t.isDark ? "0 2px 10px rgba(0,0,0,0.3)" : "none",
          }}
        >
          {monthDay}
        </div>
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: 500,
            color: t.isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(0, 0, 0, 0.6)",
            marginTop: 4,
          }}
        >
          Welcome to HYK's Workspace
        </div>
      </div>

      {/* Grid of Launcher Icons */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "16px 8px",
          justifyItems: "center",
          marginTop: "auto",
          marginBottom: 10,
          padding: "24px 0",
        }}
      >
        {icons.map((icon) => (
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
