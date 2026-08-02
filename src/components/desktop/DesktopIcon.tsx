import React from "react"

// ─── Papirus icon imports ───────────────────────────────────────────────────
import folderSvg     from "@/assets/icons/folder.svg"
import trashSvg      from "@/assets/icons/trash.svg"
import terminalSvg   from "@/assets/icons/terminal.svg"
import browserSvg    from "@/assets/icons/browser.svg"
import profileSvg    from "@/assets/icons/profile.svg"
import pdfSvg        from "@/assets/icons/pdf.svg"
import graduationSvg from "@/assets/icons/graduation.svg"
import briefcaseSvg  from "@/assets/icons/briefcase.svg"

// ─── Types ──────────────────────────────────────────────────────────────────
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
  isDark: boolean
}

// ─── Icon colour tints for folder variants ──────────────────────────────────
const FOLDER_TINT: Record<string, string> = {
  projects: "hue-rotate(0deg)",         // default blue
  gallery:  "hue-rotate(280deg) saturate(1.3)", // pink/magenta
}

// ─── SVG icon map ────────────────────────────────────────────────────────────
const ICON_SRC: Record<IconType, string> = {
  folder:     folderSvg,
  pdf:        pdfSvg,
  browser:    browserSvg,
  terminal:   terminalSvg,
  person:     profileSvg,
  trash:      trashSvg,
  graduation: graduationSvg,
  briefcase:  briefcaseSvg,
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function DesktopIcon({ id, label, type, selected, onClick, onDoubleClick, isDark }: Props) {
  const src    = ICON_SRC[type]
  const filter = type === "folder" ? (FOLDER_TINT[id] ?? FOLDER_TINT["projects"]) : undefined
  const isTrash = type === "trash"  // reserved for future Trash-specific logic

  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        gap:            4,
        padding:        "8px 6px",
        borderRadius:   8,
        cursor:         "default",
        width:          76,
        background:     selected ? "rgba(59, 130, 246, 0.2)" : "transparent",
        border:         selected ? "1px solid rgba(59, 130, 246, 0.45)" : "1px solid transparent",
        transition:     "background 0.12s ease, border-color 0.12s ease",
        userSelect:     "none",
      }}
      onMouseEnter={e => {
        if (!selected) e.currentTarget.style.background = isDark
          ? "rgba(255, 255, 255, 0.07)"
          : "rgba(0, 0, 0, 0.06)"
      }}
      onMouseLeave={e => {
        if (!selected) e.currentTarget.style.background = "transparent"
      }}
    >
      {/* Icon image */}
      <img
        src={src}
        alt={label}
        draggable={false}
        style={{
          width:          44,
          height:         44,
          objectFit:      "contain",
          pointerEvents:  "none",
          filter,
        }}
      />

      {/* Label */}
      <span
        style={{
          color:              isDark
                                ? (selected ? "#ffffff" : "rgba(255, 255, 255, 0.95)")
                                : (selected ? "#000000" : "#1c1c1e"),
          fontSize:           "0.72rem",
          fontWeight:         selected ? 600 : 500,
          textAlign:          "center",
          lineHeight:         1.3,
          maxWidth:           72,
          wordBreak:          "break-word",
          pointerEvents:      "none",
          // Dark Mode: multi-directional outline shadow & thin text-stroke; Light Mode: clean text
          textShadow:         isDark ? "0 0 3px rgba(0, 0, 0, 0.95), 0 0 1px rgba(0, 0, 0, 0.95)" : "none",
          WebkitTextStroke:   isDark ? "0.15px rgba(0, 0, 0, 0.6)" : "none",
        }}
      >
        {label}
      </span>

    </div>
  )
}
