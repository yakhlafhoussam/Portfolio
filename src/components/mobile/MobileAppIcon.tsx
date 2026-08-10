import React, { useState } from "react"
import { useTheme } from "../../context/ThemeContext"
import folderSvg from "@/assets/icons/folder.svg"
import trashSvg from "@/assets/icons/trash.svg"
import terminalSvg from "@/assets/icons/terminal.svg"
import browserSvg from "@/assets/icons/browser.svg"
import profileSvg from "@/assets/icons/profile.svg"
import pdfSvg from "@/assets/icons/pdf.svg"
import graduationSvg from "@/assets/icons/graduation.svg"
import briefcaseSvg from "@/assets/icons/briefcase.svg"
import gallerySvg from "@/assets/icons/gallery.svg"

export type IconType =
  | "folder"
  | "pdf"
  | "browser"
  | "terminal"
  | "person"
  | "trash"
  | "graduation"
  | "briefcase"
  | "gallery"

type Props = {
  id: string
  label: string
  type: IconType
  onClick: (e: React.MouseEvent | React.TouchEvent) => void
}

const FOLDER_TINT: Record<string, string> = {
  projects: "hue-rotate(0deg)",
  gallery: "hue-rotate(280deg) saturate(1.3)",
}

const ICON_SRC: Record<IconType, string> = {
  folder: folderSvg,
  pdf: pdfSvg,
  browser: browserSvg,
  terminal: terminalSvg,
  person: profileSvg,
  trash: trashSvg,
  graduation: graduationSvg,
  briefcase: briefcaseSvg,
  gallery: gallerySvg,
}

export default function MobileAppIcon({ id, label, type, onClick }: Props) {
  const t = useTheme()
  const [active, setActive] = useState(false)
  const src = ICON_SRC[type]
  const filter = type === "folder" ? (FOLDER_TINT[id] ?? FOLDER_TINT["projects"]) : undefined

  return (
    <div
      onClick={onClick}
      onTouchStart={() => setActive(true)}
      onTouchEnd={() => setActive(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "12px 6px",
        borderRadius: 12,
        width: 80,
        boxSizing: "border-box",
        background: active
          ? t.isDark
            ? "rgba(255, 255, 255, 0.08)"
            : "rgba(0, 0, 0, 0.06)"
          : "transparent",
        transform: active ? "scale(0.93)" : "scale(1)",
        transition: "transform 0.1s ease, background 0.15s ease",
        userSelect: "none",
        cursor: "pointer",
      }}
    >
      {/* Icon Image */}
      <img
        src={src}
        alt={label}
        draggable={false}
        style={{
          width: 52,
          height: 52,
          objectFit: "contain",
          pointerEvents: "none",
          filter,
        }}
      />

      {/* Label */}
      <span
        style={{
          color: t.isDark ? "#ffffff" : "#1c1c1e",
          fontSize: "0.74rem",
          fontWeight: 500,
          textAlign: "center",
          lineHeight: 1.2,
          width: "100%",
          wordBreak: "break-word",
          pointerEvents: "none",
          textShadow: t.isDark
            ? "0 1px 2px rgba(0, 0, 0, 0.8), 0 0 1px rgba(0, 0, 0, 0.9)"
            : "none",
        }}
      >
        {label}
      </span>
    </div>
  )
}
