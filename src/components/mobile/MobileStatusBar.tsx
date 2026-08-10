import { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"

const WifiIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
    <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="3.5" />
  </svg>
)

const BatteryIcon = () => (
  <svg
    width="15"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="7" width="16" height="10" rx="2" ry="2" />
    <line x1="22" y1="11" x2="22" y2="13" />
    <rect x="4" y="9" width="9" height="6" fill="currentColor" fillOpacity="0.6" stroke="none" />
  </svg>
)

const BluetoothIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 6 18 18 12 24" transform="translate(0 -4)" />
    <polyline points="6 18 18 6 12 0" transform="translate(0 4)" />
  </svg>
)

export default function MobileStatusBar() {
  const t = useTheme()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const hh = time.getHours().toString().padStart(2, "0")
  const mm = time.getMinutes().toString().padStart(2, "0")

  return (
    <div
      style={{
        height: 28,
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "transparent",
        color: t.isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)",
        fontSize: "0.72rem",
        fontWeight: 600,
        fontFamily: "'JetBrains Mono', monospace",
        letterSpacing: "0.02em",
        userSelect: "none",
        zIndex: 10005,
      }}
    >
      {/* Left: Time */}
      <div>
        {hh}:{mm}
      </div>

      {/* Right: Network/Battery/Bluetooth status */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <BluetoothIcon />
        <WifiIcon />
        <BatteryIcon />
      </div>
    </div>
  )
}
