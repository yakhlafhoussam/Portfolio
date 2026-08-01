import React from "react"
import { AppId } from "./Desktop"
import {
  FolderIcon,
  PdfIcon,
  BrowserIcon,
  TerminalIcon,
  PersonIcon,
  TrashIcon,
  GraduationIcon,
  BriefcaseIcon,
} from "./DesktopIcon"

type WindowState = {
  id: string
  appId: AppId
  title: string
  minimized: boolean
  zIndex: number
}

type Props = {
  windows: WindowState[]
  activeWindowId: string | null
  onItemClick: (id: string) => void
}

const ICON_MAP: Record<AppId, React.ReactNode> = {
  projects: <FolderIcon color="#4a9eff" />,
  experience: <BriefcaseIcon />,
  education: <GraduationIcon />,
  gallery: <FolderIcon color="#f472b6" />,
  resume: <PdfIcon />,
  browser: <BrowserIcon />,
  terminal: <TerminalIcon />,
  profile: <PersonIcon />,
  recycle: <TrashIcon />,
  editor: <PdfIcon />, // fallback/editor icon
}

export default function Dock({ windows, activeWindowId, onItemClick }: Props) {
  if (windows.length === 0) return null

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        left: "50%",
        transform: "translateX(-50%)",
        height: 60,
        backgroundColor: "rgba(18, 18, 20, 0.65)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 18,
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "0 14px",
        boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.35)",
        zIndex: 9999,
        transition: "width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
      }}
    >
      {windows.map(w => {
        const isActive = w.id === activeWindowId
        const isMinimized = w.minimized
        const icon = ICON_MAP[w.appId] ?? <FolderIcon />

        return (
          <div
            key={w.id}
            onClick={() => onItemClick(w.id)}
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              width: 44,
              height: 44,
              borderRadius: 10,
              backgroundColor: isActive ? "rgba(255, 255, 255, 0.07)" : "transparent",
              opacity: isMinimized ? 0.6 : 1,
              transition: "transform 0.15s ease, background-color 0.15s ease, opacity 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.1)"
              if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255, 255, 255, 0.04)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)"
              if (!isActive) e.currentTarget.style.backgroundColor = "transparent"
            }}
            title={w.title}
          >
            {/* Centered Icon Scaled for Dock */}
            <div
              style={{
                transform: "scale(0.85)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {icon}
            </div>

            {/* GNOME-style Running/Active Indicator Dot */}
            <div
              style={{
                position: "absolute",
                bottom: 2,
                width: isActive ? 6 : 4,
                height: 4,
                borderRadius: 2,
                backgroundColor: isActive ? "#3b82f6" : "rgba(255, 255, 255, 0.4)",
                transition: "background-color 0.15s, width 0.15s",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
