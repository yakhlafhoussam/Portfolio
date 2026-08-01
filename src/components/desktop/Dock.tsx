import { AppId } from "./Desktop"

// ─── Papirus icon imports ───────────────────────────────────────────────────
import folderSvg     from "@/assets/icons/folder.svg"
import trashSvg      from "@/assets/icons/trash.svg"
import terminalSvg   from "@/assets/icons/terminal.svg"
import browserSvg    from "@/assets/icons/browser.svg"
import profileSvg    from "@/assets/icons/profile.svg"
import pdfSvg        from "@/assets/icons/pdf.svg"
import graduationSvg from "@/assets/icons/graduation.svg"
import briefcaseSvg  from "@/assets/icons/briefcase.svg"

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

// Map every AppId to a Papirus icon src + optional CSS filter
const DOCK_ICON: Record<AppId, { src: string; filter?: string }> = {
  projects:   { src: folderSvg },
  experience: { src: briefcaseSvg },
  education:  { src: graduationSvg },
  gallery:    { src: folderSvg, filter: "hue-rotate(280deg) saturate(1.3)" },
  resume:     { src: pdfSvg },
  browser:    { src: browserSvg },
  terminal:   { src: terminalSvg },
  profile:    { src: profileSvg },
  recycle:    { src: trashSvg },
  editor:     { src: pdfSvg },
}

export default function Dock({ windows, activeWindowId, onItemClick }: Props) {
  if (windows.length === 0) return null

  return (
    <div
      style={{
        position:        "fixed",
        bottom:          12,
        left:            "50%",
        transform:       "translateX(-50%)",
        height:          64,
        backgroundColor: "rgba(18, 18, 20, 0.65)",
        backdropFilter:  "blur(20px)",
        border:          "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius:    18,
        display:         "flex",
        alignItems:      "center",
        gap:             6,
        padding:         "0 12px",
        boxShadow:       "0 8px 32px rgba(0,0,0,0.4)",
        zIndex:          9999,
      }}
    >
      {windows.map(w => {
        const isActive    = w.id === activeWindowId
        const isMinimized = w.minimized
        const { src, filter } = DOCK_ICON[w.appId] ?? { src: folderSvg }

        return (
          <div
            key={w.id}
            onClick={() => onItemClick(w.id)}
            title={w.title}
            style={{
              position:       "relative",
              display:        "flex",
              flexDirection:  "column",
              alignItems:     "center",
              justifyContent: "center",
              cursor:         "pointer",
              width:          48,
              height:         48,
              borderRadius:   10,
              backgroundColor: isActive ? "rgba(255,255,255,0.08)" : "transparent",
              opacity:         isMinimized ? 0.55 : 1,
              transition:      "transform 0.15s ease, opacity 0.15s ease",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.12) translateY(-2px)"
              if (!isActive) e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1) translateY(0)"
              if (!isActive) e.currentTarget.style.backgroundColor = "transparent"
            }}
          >
            <img
              src={src}
              alt={w.title}
              draggable={false}
              style={{
                width:         36,
                height:        36,
                objectFit:     "contain",
                pointerEvents: "none",
                filter,
              }}
            />

            {/* GNOME-style running indicator dot */}
            <div
              style={{
                position:        "absolute",
                bottom:          1,
                width:           isActive ? 6 : 4,
                height:          4,
                borderRadius:    2,
                backgroundColor: isActive ? "#3b82f6" : "rgba(255,255,255,0.35)",
                transition:      "width 0.15s, background-color 0.15s",
              }}
            />
          </div>
        )
      })}
    </div>
  )
}
