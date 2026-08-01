import React from "react"

export type IconType =
  | "folder"
  | "pdf"
  | "browser"
  | "terminal"
  | "person"
  | "trash"
  | "graduation"
  | "briefcase"

type Props = {
  id: string
  label: string
  type: IconType
  selected: boolean
  onClick: (e: React.MouseEvent) => void
  onDoubleClick: () => void
}

export function FolderIcon({ color = "#4a9eff" }: { color?: string }) {
  return (
    <svg width="44" height="38" viewBox="0 0 44 38" fill="none">
      <path
        d="M2 8C2 5.8 3.8 4 6 4H17L20 8H38C40.2 8 42 9.8 42 12V32C42 34.2 40.2 36 38 36H6C3.8 36 2 34.2 2 32V8Z"
        fill={color}
        fillOpacity="0.85"
      />
      <path
        d="M2 12H42V32C42 34.2 40.2 36 38 36H6C3.8 36 2 34.2 2 32V12Z"
        fill={color}
      />
    </svg>
  )
}

export function PdfIcon() {
  return (
    <svg width="38" height="46" viewBox="0 0 38 46" fill="none">
      <rect x="2" y="2" width="34" height="42" rx="3" fill="#2a2a2e" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
      <path d="M22 2L36 16H24C22.9 16 22 15.1 22 14V2Z" fill="#e53e3e" fillOpacity="0.8" />
      <rect x="7" y="20" width="14" height="1.5" rx="0.75" fill="rgba(255,255,255,0.25)" />
      <rect x="7" y="24" width="20" height="1.5" rx="0.75" fill="rgba(255,255,255,0.2)" />
      <rect x="7" y="28" width="18" height="1.5" rx="0.75" fill="rgba(255,255,255,0.2)" />
      <rect x="7" y="32" width="12" height="1.5" rx="0.75" fill="rgba(255,255,255,0.15)" />
      <text x="19" y="13" textAnchor="middle" fontSize="7" fontWeight="700" fill="#e53e3e" fontFamily="Inter,sans-serif">PDF</text>
    </svg>
  )
}

export function BrowserIcon() {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
      <circle cx="21" cy="21" r="19" fill="#1e3a5f" stroke="#4a9eff" strokeWidth="1.5" strokeOpacity="0.6" />
      <ellipse cx="21" cy="21" rx="8" ry="19" stroke="#4a9eff" strokeWidth="1" strokeOpacity="0.4" fill="none" />
      <line x1="2" y1="21" x2="40" y2="21" stroke="#4a9eff" strokeWidth="1" strokeOpacity="0.4" />
      <line x1="5" y1="13" x2="37" y2="13" stroke="#4a9eff" strokeWidth="0.8" strokeOpacity="0.3" />
      <line x1="5" y1="29" x2="37" y2="29" stroke="#4a9eff" strokeWidth="0.8" strokeOpacity="0.3" />
    </svg>
  )
}

export function TerminalIcon() {
  return (
    <svg width="42" height="38" viewBox="0 0 42 38" fill="none">
      <rect x="1" y="1" width="40" height="36" rx="5" fill="#1a1a1a" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="1" y="1" width="40" height="8" rx="5" fill="#2d2d30" />
      <circle cx="8" cy="5" r="2" fill="#ff5f57" />
      <circle cx="15" cy="5" r="2" fill="#ffbd2e" />
      <circle cx="22" cy="5" r="2" fill="#28c840" />
      <text x="8" y="22" fontSize="9" fontFamily="'JetBrains Mono',monospace" fill="#4ade80" fontWeight="400">
        &gt; _
      </text>
      <rect x="8" y="27" width="18" height="1.2" rx="0.6" fill="rgba(74,222,128,0.25)" />
    </svg>
  )
}

export function PersonIcon() {
  return (
    <svg width="40" height="42" viewBox="0 0 40 42" fill="none">
      <rect x="1" y="1" width="38" height="40" rx="6" fill="#1e2530" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <circle cx="20" cy="15" r="7" fill="#4a9eff" fillOpacity="0.7" />
      <path d="M4 38C4 28 36 28 36 38" fill="#4a9eff" fillOpacity="0.35" />
    </svg>
  )
}

export function TrashIcon() {
  return (
    <svg width="38" height="44" viewBox="0 0 38 44" fill="none">
      <rect x="4" y="10" width="30" height="32" rx="3" fill="#2a2a2e" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="2" y="6" width="34" height="5" rx="2" fill="#363638" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <rect x="13" y="2" width="12" height="5" rx="2" fill="#363638" stroke="rgba(255,255,255,0.08)" strokeWidth="0.8" />
      <line x1="13" y1="18" x2="13" y2="36" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="18" x2="19" y2="36" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="25" y1="18" x2="25" y2="36" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

export function GraduationIcon() {
  return (
    <svg width="40" height="42" viewBox="0 0 40 42" fill="none">
      <rect x="1" y="1" width="38" height="40" rx="6" fill="#2d251e" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <path d="M20 9L32 15L20 21L8 15L20 9Z" fill="#fbbf24" fillOpacity="0.75" />
      <path d="M12 17.5V25C12 28.5 20 30 20 30C20 30 28 28.5 28 25V17.5" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M30 16.5V22.5" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export function BriefcaseIcon() {
  return (
    <svg width="40" height="42" viewBox="0 0 40 42" fill="none">
      <rect x="1" y="1" width="38" height="40" rx="6" fill="#251e30" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
      <rect x="8" y="15" width="24" height="18" rx="2" fill="#a78bfa" fillOpacity="0.6" stroke="#a78bfa" strokeWidth="1.5" />
      <path d="M14 15V11C14 9.9 14.9 9 16 9H24C25.1 9 26 9.9 26 11V15" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="8" y1="21" x2="32" y2="21" stroke="#a78bfa" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  )
}

const ICON_COLORS: Record<string, string> = {
  projects: "#4a9eff",
  experience: "#a78bfa",
  education: "#fbbf24",
  gallery: "#f472b6",
}

export default function DesktopIcon({ id, label, type, selected, onClick, onDoubleClick }: Props) {
  const renderIcon = () => {
    switch (type) {
      case "folder":
        return <FolderIcon color={ICON_COLORS[id] ?? "#4a9eff"} />
      case "pdf":
        return <PdfIcon />
      case "browser":
        return <BrowserIcon />
      case "terminal":
        return <TerminalIcon />
      case "person":
        return <PersonIcon />
      case "trash":
        return <TrashIcon />
      case "graduation":
        return <GraduationIcon />
      case "briefcase":
        return <BriefcaseIcon />
    }
  }

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "8px 6px",
        borderRadius: 8,
        cursor: "default",
        width: 76,
        background: selected ? "rgba(59, 130, 246, 0.2)" : "transparent",
        border: selected ? "1px solid rgba(59, 130, 246, 0.45)" : "1px solid transparent",
        transition: "background 0.12s ease, border-color 0.12s ease",
        userSelect: "none",
      }}
      onMouseEnter={e => {
        if (!selected) e.currentTarget.style.background = "rgba(255,255,255,0.07)"
      }}
      onMouseLeave={e => {
        if (!selected) e.currentTarget.style.background = "transparent"
      }}
    >
      <div style={{ pointerEvents: "none" }}>{renderIcon()}</div>
      <span
        style={{
          color: selected ? "#fff" : "rgba(255,255,255,0.85)",
          fontSize: "0.72rem",
          fontWeight: selected ? 500 : 400,
          textAlign: "center",
          textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          lineHeight: 1.3,
          maxWidth: 72,
          wordBreak: "break-word",
          pointerEvents: "none",
        }}
      >
        {label}
      </span>
    </div>
  )
}
