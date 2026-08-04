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
import { ThemeContext, getTheme } from "../../context/ThemeContext"
import { storageManager } from "../../lib/storage"
import { initVisitor } from "../../services/visitor"
import lightWallpaper from "@/assets/wallpapers/light.png"
import darkWallpaper from "@/assets/wallpapers/dark.png"

export type AppId = "projects" | "experience" | "education" | "gallery" | "resume" | "browser" | "terminal" | "profile" | "recycle" | "editor"

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
  projects: { width: 840, height: 550 },
  experience: { width: 840, height: 550 },
  education: { width: 840, height: 550 },
  gallery: { width: 900, height: 600 },
  resume: { width: 700, height: 780 },
  browser: { width: 960, height: 580 },
  terminal: { width: 720, height: 460 },
  profile: { width: 800, height: 580 },
  recycle: { width: 520, height: 400 },
  editor: { width: 740, height: 520 },
}

const TITLES: Record<AppId, string> = {
  projects: "Projects — File Explorer",
  experience: "Experience — File Explorer",
  education: "Education — File Explorer",
  gallery: "Gallery",
  resume: "Resume.pdf — Document Viewer",
  browser: "Browser",
  terminal: "Terminal",
  profile: "Profile & Settings",
  recycle: "Trash",
  editor: "Text Editor",
}

let idCounter = 0

export default function Desktop() {
  // Initialize storage state and register visitor on first visit
  useEffect(() => {
    storageManager.initialize()
    initVisitor()
  }, [])

  const [isDark, setIsDark] = useState(() => {
    storageManager.initialize()
    return storageManager.read().theme === "dark"
  })
  const [icons, setIcons] = useState<{
    id: AppId
    label: string
    type: IconType
  }[]>([])
  const [windows, setWindows] = useState<WindowState[]>([])
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null)
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null)
  const [blockDesktopInput, setBlockDesktopInput] = useState(false)
  const [wallpaperGlitch, setWallpaperGlitch] = useState(false)
  const [iconsFlicker, setIconsFlicker] = useState(false)
  const [flashScreen, setFlashScreen] = useState(false)
  const [logoFlash, setLogoFlash] = useState(false)
  const [breachMessage, setBreachMessage] = useState(false)
  const [screenBlack, setScreenBlack] = useState(false)
  const [gpuDistortion, setGpuDistortion] = useState(false)
  const [desktopInstable, setDesktopInstable] = useState(false)
  const [browserTransform, setBrowserTransform] = useState<{
    width: number
    height: number
    x: number
    y: number
    scale: number
  } | null>(null)
  const [focusedWindow, setFocusedWindow] = useState<"browser" | "terminal" | null>(null)
  const zRef = useRef(100)
  const breachTimers = useRef<number[]>([])
  const browserCloseRequestRef = useRef<() => boolean>(() => true)

  useEffect(() => {
    fetch("/content/desktop.json")
      .then((res) => res.json())
      .then((data) => setIcons(data))
      .catch((err) => console.error("Failed to load desktop icons:", err))
  }, [])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark")
      document.documentElement.classList.remove("light")
      document.documentElement.style.setProperty(
        "--scrollbar-thumb",
        "rgba(255,255,255,0.12)",
      )
      document.documentElement.style.setProperty(
        "--scrollbar-thumb-hover",
        "rgba(255,255,255,0.22)",
      )
    } else {
      document.documentElement.classList.add("light")
      document.documentElement.classList.remove("dark")
      document.documentElement.style.setProperty(
        "--scrollbar-thumb",
        "rgba(0,0,0,0.15)",
      )
      document.documentElement.style.setProperty(
        "--scrollbar-thumb-hover",
        "rgba(0,0,0,0.25)",
      )
    }
  }, [isDark])

  const bringToFront = useCallback(
    (id: string, options?: { force?: boolean }) => {
      if (blockDesktopInput && !options?.force) return
      const z = ++zRef.current
      setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, zIndex: z } : w)))
      setActiveWindowId(id)
    },
    [blockDesktopInput],
  )

  const openWindow = useCallback(
    (
      appId: AppId,
      params?: Record<string, unknown>,
      options?: { force?: boolean },
    ) => {
      if (blockDesktopInput && !options?.force) {
        window.dispatchEvent(new CustomEvent("hyk-breach-escape"))
        return
      }
      // If opening an editor, focus existing instance for same file
      if (appId === "editor" && params) {
        const existing = windows.find(
          (w) => w.appId === "editor" && w.params?.title === params.title,
        )
        if (existing) {
          if (existing.minimized) {
            setWindows((ws) =>
              ws.map((w) =>
                w.id === existing.id ? { ...w, minimized: false } : w,
              ),
            )
          }
          bringToFront(existing.id)
          return
        }
      }

      // If opening gallery with a specific image and gallery is already open
      if (appId === "gallery" && params) {
        const existing = windows.find((w) => w.appId === "gallery")
        if (existing) {
          setWindows((ws) =>
            ws.map((w) =>
              w.id === existing.id ? { ...w, minimized: false, params } : w,
            ),
          )
          bringToFront(existing.id)
          return
        }
      }

      // Generic: focus existing window for any other app
      if (appId !== "editor") {
        const existing = windows.find((w) => w.appId === appId)
        if (existing) {
          if (existing.minimized) {
            setWindows((ws) =>
              ws.map((w) =>
                w.id === existing.id ? { ...w, minimized: false } : w,
              ),
            )
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

      setWindows((ws) => [
        ...ws,
        {
          id,
          appId,
          title:
            appId === "editor"
              ? params?.title as string || TITLES[appId]
              : TITLES[appId],
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

  useEffect(() => {
    const handleCountdown = (event: Event) => {
      const detail = (event as CustomEvent).detail as { active: boolean }
      setBlockDesktopInput(detail.active)
    }

    const handlePhase = (event: Event) => {
      const phase = (event as CustomEvent).detail.phase as string
      switch (phase) {
        case "freeze":
          setBlockDesktopInput(true)
          break
        case "open-terminal":
          openWindow(
            "terminal",
            {
              autoCommands: [
                "connecting...",
                "bypassing firewall...",
                "reading portfolio...",
                "locating visitor...",
                "decrypting...",
                "access granted",
              ],
            },
            { force: true },
          )
          break
        case "close-terminal":
          // Persist terminals for the investigation board — do not destroy them
          break
        case "gpu-distortion":

          setGpuDistortion(true)
          breachTimers.current.push(
            window.setTimeout(() => setGpuDistortion(false), 1500),
          )
          break
        case "browser-resize":
          // Resize browser window to 70% of normal size
          setWindows((ws) =>
            ws.map((w) => {
              if (w.appId === "browser") {
                return {
                  ...w,
                  width: w.width * 0.7,
                  height: w.height * 0.7,
                  x: w.x + w.width * 0.15,
                  y: w.y + w.height * 0.15,
                }
              }
              return w
            }),
          )
          break
        case "desktop-instability":
          setDesktopInstable(true)
          breachTimers.current.push(
            window.setTimeout(() => setDesktopInstable(false), 1000),
          )
          break
        case "browser-move":
          // Move browser window chaotically
          setWindows((ws) =>
            ws.map((w) => {
              if (w.appId === "browser") {
                return {
                  ...w,
                  x: w.x + (Math.random() > 0.5 ? 24 : -24),
                  y: w.y + (Math.random() > 0.5 ? 16 : -16),
                }
              }
              return w
            }),
          )
          break
        case "focus-terminal":
          // Switch focus from browser to terminal
          setWindows((ws) =>
            ws.map((w) => {
              if (w.appId === "terminal" && !windows.find(x => x.appId === "terminal")) {
                return w
              }
              return w
            }),
          )
          const terminalWindow = windows.find((w) => w.appId === "terminal")
          if (terminalWindow) {
            bringToFront(terminalWindow.id, { force: true })
            setFocusedWindow("terminal")
          }
          breachTimers.current.push(
            window.setTimeout(() => setFocusedWindow(null), 300),
          )
          break
        case "focus-browser":
          // Switch focus back to browser
          const browserWindow = windows.find((w) => w.appId === "browser")
          if (browserWindow) {
            bringToFront(browserWindow.id, { force: true })
            setFocusedWindow("browser")
          }
          breachTimers.current.push(
            window.setTimeout(() => setFocusedWindow(null), 300),
          )
          break
        case "wallpaper-glitch":
          setWallpaperGlitch(true)
          breachTimers.current.push(
            window.setTimeout(() => setWallpaperGlitch(false), 600),
          )
          break
        case "icon-flicker":
          setIconsFlicker(true)
          breachTimers.current.push(
            window.setTimeout(() => setIconsFlicker(false), 600),
          )
          break
        case "flash-screen":
          setFlashScreen(true)
          breachTimers.current.push(
            window.setTimeout(() => setFlashScreen(false), 220),
          )
          break
        case "logo-flash":
          setLogoFlash(true)
          breachTimers.current.push(
            window.setTimeout(() => setLogoFlash(false), 220),
          )
          break
        case "breach-message":
          setBreachMessage(true)
          breachTimers.current.push(
            window.setTimeout(() => setBreachMessage(false), 900),
          )
          break
        case "screen-black":
          setScreenBlack(true)
          break
        case "reload":
          window.location.reload()
          break
        case "finished":
          setBlockDesktopInput(false)
          setScreenBlack(false)
          break
      }
    }

    window.addEventListener("hyk-breach-countdown", handleCountdown)
    window.addEventListener("hyk-breach-phase", handlePhase)
    window.addEventListener("hyk-demo-terminal", (e: Event) => {
      const d = (e as CustomEvent).detail as { name?: string; lines: string[]; rhythm?: any }
      openWindow(
        "terminal",
        { demoLines: d.lines, hostname: d.name ?? "bash" },
        { force: true },
      )
    })
    window.addEventListener("hyk-demo-terminal-append", (e: Event) => {
      const d = (e as CustomEvent).detail as { name?: string; lines: string[]; rhythm?: any }
      // Find existing terminal and append lines by opening a terminal with append flag
      openWindow(
        "terminal",
        { demoLines: d.lines, append: true, hostname: d.name ?? "bash" },
        { force: true },
      )
    })
    window.addEventListener("hyk-demo-popup", (e: Event) => {
      const d = (e as CustomEvent).detail as { title: string; body: string[]; duration?: number }
      // Render as breach message overlay temporarily
      setBreachMessage(true)
      breachTimers.current.push(
        window.setTimeout(() => setBreachMessage(false), d.duration ?? 1800),
      )
    })

    return () => {
      window.removeEventListener("hyk-breach-countdown", handleCountdown)
      window.removeEventListener("hyk-breach-phase", handlePhase)
      window.removeEventListener("hyk-demo-terminal", () => {})
      window.removeEventListener("hyk-demo-terminal-append", () => {})
      window.removeEventListener("hyk-demo-popup", () => {})
      breachTimers.current.forEach((id) => window.clearTimeout(id))
      breachTimers.current = []
    }
  }, [openWindow])

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id))
    setActiveWindowId((curr) => (curr === id ? null : curr))
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    )
    setActiveWindowId((curr) => (curr === id ? null : curr))
  }, [])

  const maximizeWindow = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    )
  }, [])

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    setWindows((ws) => ws.map((w) => (w.id === id ? { ...w, x, y } : w)))
  }, [])

  const handleDockItemClick = useCallback(
    (windowId: string) => {
      if (blockDesktopInput) {
        window.dispatchEvent(new CustomEvent("hyk-breach-escape"))
        return
      }

      const win = windows.find((w) => w.id === windowId)
      if (!win) return

      if (win.minimized) {
        setWindows((ws) =>
          ws.map((w) => (w.id === windowId ? { ...w, minimized: false } : w)),
        )
        bringToFront(windowId)
      } else if (activeWindowId === windowId) {
        minimizeWindow(windowId)
      } else {
        bringToFront(windowId)
      }
    },
    [windows, activeWindowId, bringToFront, minimizeWindow, blockDesktopInput],
  )

  const renderApp = (w: WindowState) => {
    switch (w.appId) {
      case "projects":
        return <FileExplorer section="projects" openWindow={openWindow} />
      case "experience":
        return <FileExplorer section="experience" openWindow={openWindow} />
      case "education":
        return <FileExplorer section="education" openWindow={openWindow} />
      case "gallery":
        return (
          <Gallery initialImageSrc={w.params?.imageSrc as string | undefined} />
        )
      case "resume":
        return <Resume />
      case "browser":
        return (
          <Browser
            registerCloseRequest={(callback) => {
              browserCloseRequestRef.current = callback
            }}
          />
        )
      case "terminal":
        return (
          <Terminal
            autoCommands={w.params?.autoCommands as string[] | undefined}
            demoLines={w.params?.demoLines as string[] | undefined}
            demoAppend={w.params?.append as boolean | undefined}
            hostname={w.params?.hostname as string | undefined}
          />
        )
      case "profile":
        return <Profile />
      case "recycle":
        return <Trash />
      case "editor":
        return (
          <TextEditor
            content={w.params?.content as string | undefined}
            title={w.params?.title as string | undefined}
          />
        )
      default:
        return null
    }
  }

  return (
    <ThemeContext.Provider value={getTheme(isDark)}>
      <div
        onClick={(e) => {
          if (blockDesktopInput) {
            e.stopPropagation()
            return
          }
          setSelectedIconId(null)
        }}
        style={{
          position: "fixed",
          inset: 0,
          fontFamily: "'Inter', sans-serif",
        }}
        className={desktopInstable ? "hyk-desktop-unstable" : undefined}
      >
        {/* ── Wallpaper layers — both always mounted for zero-delay crossfade ── */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${lightWallpaper})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            opacity: isDark ? 0 : 1,
            transition: "opacity 500ms ease-in-out",
            filter: wallpaperGlitch ? "blur(1px) saturate(1.2)" : undefined,
            transform: wallpaperGlitch ? "scale(1.01)" : undefined,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${darkWallpaper})`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            opacity: isDark ? 1 : 0,
            transition: "opacity 500ms ease-in-out",
            filter: wallpaperGlitch ? "blur(1px) saturate(1.2)" : undefined,
            transform: wallpaperGlitch ? "scale(1.01)" : undefined,
            zIndex: 0,
            pointerEvents: "none",
          }}
        />
        {flashScreen && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(255,255,255,0.8)",
              zIndex: 99,
              pointerEvents: "none",
            }}
          />
        )}
        {gpuDistortion && (
          <div
            className="hyk-gpu-distortion"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(100, 100, 200, 0.02)",
              zIndex: 98,
              pointerEvents: "none",
            }}
          />
        )}
        {breachMessage && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.74)",
              zIndex: 99,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                color: "#f87171",
                fontSize: "2rem",
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "12px 18px",
                border: "1px solid rgba(248,113,113,0.18)",
                borderRadius: 14,
                background: "rgba(0,0,0,0.45)",
              }}
            >
              SYSTEM BREACH
            </div>
          </div>
        )}
        {screenBlack && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "#000",
              zIndex: 99999,
              pointerEvents: "none",
            }}
          />
        )}
        {/* TopBar — stop click propagation to avoid deselecting icons */}
        <div onClick={(e) => e.stopPropagation()}>
          <TopBar
            isDark={isDark}
            onToggleTheme={() => {
              if (blockDesktopInput) return
              setIsDark((d) => {
                const next = !d
                storageManager.update({ theme: next ? "dark" : "light" })
                return next
              })
            }}
          />
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
            opacity: iconsFlicker ? 0.35 : 1,
            transition: iconsFlicker ? "opacity 0.1s ease" : "opacity 0.3s ease",
          }}
        >
          {icons.map((icon) => (
            <DesktopIcon
              key={icon.id}
              id={icon.id}
              label={icon.label}
              type={icon.type}
              selected={selectedIconId === icon.id}
              isDark={isDark}
              onClick={(e) => {
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
        {windows.map((w) => (
          <WindowFrame
            key={w.id}
            title={w.title}
            x={w.appId === "browser" && browserTransform ? browserTransform.x : w.x}
            y={w.appId === "browser" && browserTransform ? browserTransform.y : w.y}
            width={w.appId === "browser" && browserTransform ? browserTransform.width : w.width}
            height={w.appId === "browser" && browserTransform ? browserTransform.height : w.height}
            zIndex={w.zIndex}
            minimized={w.minimized}
            maximized={w.maximized}
            isFocused={w.id === activeWindowId}
            onClose={() => {
              if (w.appId === "browser" && !browserCloseRequestRef.current()) {
                window.dispatchEvent(new CustomEvent("hyk-breach-escape"))
                return
              }
              closeWindow(w.id)
            }}
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
    </ThemeContext.Provider>
  )
}
