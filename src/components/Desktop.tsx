import { useRef, useState, useCallback } from "react"
import TopBar from "./TopBar"
import DesktopIcon from "./DesktopIcon"
import WindowFrame from "./WindowFrame"
import Terminal from "../apps/Terminal"
import FileExplorer from "../apps/FileExplorer"
import Browser from "../apps/Browser"
import Profile from "../apps/Profile"
import Resume from "../apps/Resume"
import Gallery from "../apps/Gallery"

export type AppId =
  | "projects"
  | "experience"
  | "education"
  | "gallery"
  | "resume"
  | "browser"
  | "terminal"
  | "profile"
  | "recycle"

type WindowState = {
  id: string
  appId: AppId
  title: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  maximized: boolean
  zIndex: number
}

const DEFAULT_SIZES: Record<AppId, { width: number; height: number }> = {
  projects:   { width: 820, height: 540 },
  experience: { width: 820, height: 540 },
  education:  { width: 820, height: 540 },
  gallery:    { width: 900, height: 600 },
  resume:     { width: 680, height: 720 },
  browser:    { width: 800, height: 560 },
  terminal:   { width: 720, height: 460 },
  profile:    { width: 800, height: 580 },
  recycle:    { width: 400, height: 300 },
}

const TITLES: Record<AppId, string> = {
  projects:   "Projects — File Explorer",
  experience: "Experience — File Explorer",
  education:  "Education — File Explorer",
  gallery:    "Gallery",
  resume:     "Resume.pdf — Document Viewer",
  browser:    "Browser",
  terminal:   "Terminal",
  profile:    "Profile & Settings",
  recycle:    "Recycle Bin",
}

const ICONS = [
  { id: "projects"   as AppId, label: "Projects",     type: "folder" as const },
  { id: "experience" as AppId, label: "Experience",   type: "folder" as const },
  { id: "education"  as AppId, label: "Education",    type: "folder" as const },
  { id: "gallery"    as AppId, label: "Gallery",      type: "folder" as const },
  { id: "resume"     as AppId, label: "Resume.pdf",   type: "pdf"    as const },
  { id: "browser"    as AppId, label: "Browser",      type: "browser" as const },
  { id: "terminal"   as AppId, label: "Terminal",     type: "terminal" as const },
  { id: "profile"    as AppId, label: "Profile",      type: "person" as const },
  { id: "recycle"    as AppId, label: "Recycle Bin",  type: "trash"  as const },
]

let idCounter = 0

export default function Desktop() {
  const [windows, setWindows] = useState<WindowState[]>([])
  const zRef = useRef(100)

  const bringToFront = useCallback((id: string) => {
    const z = ++zRef.current
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, zIndex: z } : w)))
  }, [])

  const openWindow = useCallback(
    (appId: AppId) => {
      if (appId === "recycle") return

      const existing = windows.find(w => w.appId === appId)
      if (existing) {
        if (existing.minimized) {
          setWindows(ws => ws.map(w => (w.id === existing.id ? { ...w, minimized: false } : w)))
        }
        bringToFront(existing.id)
        return
      }

      const size = DEFAULT_SIZES[appId]
      const id = `win-${++idCounter}`
      const z = ++zRef.current
      const offset = (idCounter % 5) * 28
      const vw = window.innerWidth
      const vh = window.innerHeight
      const cx = Math.max(90, (vw - size.width) / 2 + offset)
      const cy = Math.max(40, (vh - size.height) / 2 + offset)

      setWindows(ws => [
        ...ws,
        {
          id,
          appId,
          title: TITLES[appId],
          x: cx,
          y: cy,
          width: size.width,
          height: size.height,
          minimized: false,
          maximized: false,
          zIndex: z,
        },
      ])
    },
    [windows, bringToFront]
  )

  const closeWindow = useCallback((id: string) => {
    setWindows(ws => ws.filter(w => w.id !== id))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, minimized: true } : w)))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, maximized: !w.maximized } : w)))
  }, [])

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, x, y } : w)))
  }, [])

  const renderApp = (appId: AppId) => {
    switch (appId) {
      case "projects":   return <FileExplorer section="projects" />
      case "experience": return <FileExplorer section="experience" />
      case "education":  return <FileExplorer section="education" />
      case "gallery":    return <Gallery />
      case "resume":     return <Resume />
      case "browser":    return <Browser />
      case "terminal":   return <Terminal />
      case "profile":    return <Profile />
      default:           return null
    }
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        /* Wallpaper placeholder — replace with:
           backgroundImage: "url('/wallpaper.jpg')",
           backgroundSize: "cover",
           backgroundPosition: "center",
        */
        background: "#1a1b1e",
        fontFamily: "'Inter', sans-serif",
        animation: "desktopFadeIn 0.8s ease",
      }}
    >
      <TopBar />

      {/* Desktop icons column */}
      <div
        style={{
          position: "absolute",
          top: 42,
          left: 12,
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {ICONS.map(icon => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            type={icon.type}
            onOpen={id => openWindow(id as AppId)}
          />
        ))}
      </div>

      {/* Open windows */}
      {windows.map(w => (
        <WindowFrame
          key={w.id}
          title={w.title}
          x={w.x}
          y={w.y}
          width={w.width}
          height={w.height}
          zIndex={w.zIndex}
          minimized={w.minimized}
          maximized={w.maximized}
          onClose={() => closeWindow(w.id)}
          onMinimize={() => minimizeWindow(w.id)}
          onMaximize={() => maximizeWindow(w.id)}
          onMove={(x, y) => moveWindow(w.id, x, y)}
          onFocus={() => bringToFront(w.id)}
        >
          {renderApp(w.appId)}
        </WindowFrame>
      ))}
    </div>
  )
}
