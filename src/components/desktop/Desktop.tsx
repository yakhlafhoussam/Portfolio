import { useRef, useState, useCallback, useEffect } from "react"
import TopBar from "./TopBar"
import DesktopIcon, { IconType } from "./DesktopIcon"
import WindowFrame from "../windows/WindowFrame"
import Terminal from "../../apps/Terminal"
import FileExplorer from "../../apps/FileExplorer"
import Browser from "../../apps/Browser"
import Profile from "../../apps/Profile"
import Resume from "../../apps/Resume"
import Gallery from "../../apps/Gallery"
import TextEditor from "../../apps/TextEditor"
import Trash from "../../apps/Trash"
import Dock from "./Dock"
import defaultWallpaper from "@/assets/wallpapers/wallpaper.jpg"

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
  | "editor"

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
  params?: Record<string, unknown>
}

const DEFAULT_SIZES: Record<AppId, { width: number; height: number }> = {
  projects:   { width: 840, height: 550 },
  experience: { width: 840, height: 550 },
  education:  { width: 840, height: 550 },
  gallery:    { width: 900, height: 600 },
  resume:     { width: 700, height: 780 },
  browser:    { width: 820, height: 580 },
  terminal:   { width: 720, height: 460 },
  profile:    { width: 800, height: 580 },
  recycle:    { width: 520, height: 400 },
  editor:     { width: 740, height: 520 },
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
  recycle:    "Trash",
  editor:     "Text Editor",
}



let idCounter = 0

export default function Desktop() {
  const [icons, setIcons] = useState<{ id: AppId; label: string; type: IconType }[]>([])
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null)
  const zRef = useRef(100)

  useEffect(() => {
    fetch("/content/desktop.json")
      .then(res => res.json())
      .then(data => setIcons(data))
      .catch(err => console.error("Failed to load desktop icons:", err))
  }, [])

  const bringToFront = useCallback((id: string) => {
    const z = ++zRef.current
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, zIndex: z } : w)))
    setActiveWindowId(id)
  }, [])

  const openWindow = useCallback(
    (appId: AppId, params?: Record<string, unknown>) => {

      // If opening an editor, focus existing instance for same file
      if (appId === "editor" && params) {
        const existing = windows.find(
          w => w.appId === "editor" && w.params?.title === params.title,
        )
        if (existing) {
          if (existing.minimized) {
            setWindows(ws => ws.map(w => (w.id === existing.id ? { ...w, minimized: false } : w)))
          }
          bringToFront(existing.id)
          return
        }
      }

      // If opening gallery with a specific image and gallery is already open
      if (appId === "gallery" && params) {
        const existing = windows.find(w => w.appId === "gallery")
        if (existing) {
          setWindows(ws =>
            ws.map(w => (w.id === existing.id ? { ...w, minimized: false, params } : w)),
          )
          bringToFront(existing.id)
          return
        }
      }

      // Generic: focus existing window for any other app
      if (appId !== "editor") {
        const existing = windows.find(w => w.appId === appId)
        if (existing) {
          if (existing.minimized) {
            setWindows(ws => ws.map(w => (w.id === existing.id ? { ...w, minimized: false } : w)))
          }
          bringToFront(existing.id)
          return
        }
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
          title: appId === "editor" ? ((params?.title as string) || TITLES[appId]) : TITLES[appId],
          x: cx,
          y: cy,
          width: size.width,
          height: size.height,
          minimized: false,
          maximized: false,
          zIndex: z,
          params,
        },
      ])
      setActiveWindowId(id)
    },
    [windows, bringToFront],
  )

  const closeWindow = useCallback((id: string) => {
    setWindows(ws => ws.filter(w => w.id !== id))
    setActiveWindowId(curr => (curr === id ? null : curr))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, minimized: true } : w)))
    setActiveWindowId(curr => (curr === id ? null : curr))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, maximized: !w.maximized } : w)))
  }, [])

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows(ws => ws.map(w => (w.id === id ? { ...w, x, y } : w)))
  }, [])

  const handleDockItemClick = useCallback(
    (windowId: string) => {
      const win = windows.find(w => w.id === windowId)
      if (!win) return

      if (win.minimized) {
        setWindows(ws => ws.map(w => (w.id === windowId ? { ...w, minimized: false } : w)))
        bringToFront(windowId)
      } else if (activeWindowId === windowId) {
        minimizeWindow(windowId)
      } else {
        bringToFront(windowId)
      }
    },
    [windows, activeWindowId, bringToFront, minimizeWindow],
  )

  const renderApp = (w: WindowState) => {
    switch (w.appId) {
      case "projects":   return <FileExplorer section="projects" openWindow={openWindow} />
      case "experience": return <FileExplorer section="experience" openWindow={openWindow} />
      case "education":  return <FileExplorer section="education" openWindow={openWindow} />
      case "gallery":    return <Gallery initialImageSrc={w.params?.imageSrc as string | undefined} />
      case "resume":     return <Resume />
      case "browser":    return <Browser />
      case "terminal":   return <Terminal />
      case "profile":    return <Profile />
      case "recycle":    return <Trash />
      case "editor":     return <TextEditor content={w.params?.content as string | undefined} title={w.params?.title as string | undefined} />
      default:           return null
    }
  }

  return (
    <div
      onClick={() => setSelectedIconId(null)}
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url(${defaultWallpaper})`,
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* TopBar — stop click propagation to avoid deselecting icons */}
      <div onClick={e => e.stopPropagation()}>
        <TopBar />
      </div>

      {/* Desktop icons — flex column wrap for responsive grid */}
      <div
        style={{
          position: "absolute",
          top: 42,
          left: 12,
          bottom: 76, // Leave space for the dock
          display: "flex",
          flexDirection: "column",
          flexWrap: "wrap",
          alignContent: "flex-start",
          gap: 6,
          maxHeight: "calc(100vh - 120px)",
        }}
      >
        {icons.map(icon => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            type={icon.type}
            selected={selectedIconId === icon.id}
            onClick={e => {
              e.stopPropagation()
              setSelectedIconId(icon.id)
            }}
            onDoubleClick={() => {
              openWindow(icon.id)
              setSelectedIconId(null)
            }}
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
          isFocused={w.id === activeWindowId}
          onClose={() => closeWindow(w.id)}
          onMinimize={() => minimizeWindow(w.id)}
          onMaximize={() => maximizeWindow(w.id)}
          onMove={(x, y) => moveWindow(w.id, x, y)}
          onFocus={() => bringToFront(w.id)}
        >
          {renderApp(w)}
        </WindowFrame>
      ))}

      {/* Bottom Center Dock */}
      <Dock
        windows={windows}
        activeWindowId={activeWindowId}
        onItemClick={handleDockItemClick}
      />
    </div>
  )
}
