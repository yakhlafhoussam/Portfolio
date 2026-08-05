import { useRef, useState, useCallback, useEffect } from "react";
import TopBar from "./TopBar";
import DesktopIcon, { IconType } from "./DesktopIcon";
import WindowFrame from "../windows/WindowFrame";
import Terminal from "../../apps/Terminal";
import FileExplorer from "../../apps/FileExplorer";
import Browser from "../../apps/Browser";
import Profile from "../../apps/Profile";
import Resume from "../../apps/Resume";
import Gallery from "../../apps/Gallery";
import TextEditor from "../../apps/TextEditor";
import Trash from "../../apps/Trash";
import { ThemeContext, getTheme } from "../../context/ThemeContext";
import { storageManager } from "../../lib/storage";
import { initVisitor } from "../../services/visitor";
import lightWallpaper from "@/assets/wallpapers/light.png";
import darkWallpaper from "@/assets/wallpapers/dark.png";

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
  | "editor";

type WindowState = {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  params?: Record<string, unknown>;
};

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
};

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
};

let idCounter = 0;

type SpawnWindowOptions = {
  position?: "center" | "cascade";
  force?: boolean;
};

export const WORKSPACE_INSETS = {
  top: 84,
  left: 24,
  right: 24,
  bottom: 24,
} as const;

function clampWindowPosition(
  x: number,
  y: number,
  width: number,
  height: number,
  vw: number,
  vh: number,
) {
  const minX = WORKSPACE_INSETS.left;
  const maxX = Math.max(minX, vw - WORKSPACE_INSETS.right - width);
  const minY = WORKSPACE_INSETS.top;
  const maxY = Math.max(minY, vh - WORKSPACE_INSETS.bottom - height);
  return {
    x: Math.max(minX, Math.min(maxX, x)),
    y: Math.max(minY, Math.min(maxY, y)),
  };
}

function getInitialWindowPosition(
  size: { width: number; height: number },
  strategy: "center" | "cascade",
  windows: WindowState[],
  appId: AppId,
  counter: number,
) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const workspaceWidth = vw - WORKSPACE_INSETS.left - WORKSPACE_INSETS.right;
  const workspaceHeight = vh - WORKSPACE_INSETS.top - WORKSPACE_INSETS.bottom;

  let x = WORKSPACE_INSETS.left + (workspaceWidth - size.width) / 2;
  let y = WORKSPACE_INSETS.top + (workspaceHeight - size.height) / 2;

  if (strategy === "cascade") {
    const lastSameType = windows.filter((w) => w.appId === appId).pop();
    if (lastSameType) {
      const dx =
        (Math.random() > 0.5 ? 1 : -1) * (20 + Math.floor(Math.random() * 31));
      const dy = 15 + Math.floor(Math.random() * 21);
      x = lastSameType.x + dx;
      y = lastSameType.y + dy;
    }
  } else {
    const offset = (counter % 5) * 28;
    x += offset;
    y += offset;
  }

  return clampWindowPosition(x, y, size.width, size.height, vw, vh);
}

export default function Desktop() {
  // Initialize storage state and register visitor on first visit
  useEffect(() => {
    storageManager.initialize();
    initVisitor();
  }, []);

  const [isDark, setIsDark] = useState(() => {
    storageManager.initialize();
    return storageManager.read().theme === "dark";
  });
  const [icons, setIcons] = useState<
    {
      id: AppId;
      label: string;
      type: IconType;
    }[]
  >([]);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const [blockDesktopInput, setBlockDesktopInput] = useState(false);
  const [wallpaperGlitch, setWallpaperGlitch] = useState(false);
  const [iconsFlicker, setIconsFlicker] = useState(false);
  const [flashScreen, setFlashScreen] = useState(false);
  const [logoFlash, setLogoFlash] = useState(false);
  const [popup, setPopup] = useState<{ title: string; body: string[] } | null>(
    null,
  );
  const popupTimerRef = useRef<number | null>(null);
  const [screenBlack, setScreenBlack] = useState(false);
  const [desktopInstable, setDesktopInstable] = useState(false);
  const [browserTransform, setBrowserTransform] = useState<{
    width: number;
    height: number;
    x: number;
    y: number;
    scale: number;
  } | null>(null);
  const [focusedWindow, setFocusedWindow] = useState<
    "browser" | "terminal" | null
  >(null);
  const zRef = useRef(100);
  const breachTimers = useRef<number[]>([]);
  const windowsRef = useRef<WindowState[]>([]);
  const browserCloseRequestRef = useRef<() => boolean>(() => true);

  // Keep windowsRef in sync with windows state (for ref access in callbacks)
  useEffect(() => {
    windowsRef.current = windows;
  }, [windows]);

  useEffect(() => {
    fetch("/content/desktop.json")
      .then((res) => res.json())
      .then((data) => setIcons(data))
      .catch((err) => console.error("Failed to load desktop icons:", err));
  }, []);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.classList.remove("light");
      document.documentElement.style.setProperty(
        "--scrollbar-thumb",
        "rgba(255,255,255,0.12)",
      );
      document.documentElement.style.setProperty(
        "--scrollbar-thumb-hover",
        "rgba(255,255,255,0.22)",
      );
    } else {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
      document.documentElement.style.setProperty(
        "--scrollbar-thumb",
        "rgba(0,0,0,0.15)",
      );
      document.documentElement.style.setProperty(
        "--scrollbar-thumb-hover",
        "rgba(0,0,0,0.25)",
      );
    }
  }, [isDark]);

  const bringToFront = useCallback(
    (id: string, options?: { force?: boolean }) => {
      if (blockDesktopInput && !options?.force) return;
      const z = ++zRef.current;
      setWindows((ws) =>
        ws.map((w) => (w.id === id ? { ...w, zIndex: z } : w)),
      );
      setActiveWindowId(id);
    },
    [blockDesktopInput],
  );

  // spawnWindow: Always creates a new independent instance, never checks for existing windows
  const spawnWindow = useCallback(
    (
      appId: AppId,
      params?: Record<string, unknown>,
      options?: SpawnWindowOptions,
    ) => {
      if (blockDesktopInput && !options?.force) {
        window.dispatchEvent(new CustomEvent("hyk-breach-escape"));
        return { id: "" };
      }

      const size = DEFAULT_SIZES[appId];
      const id = `win-${++idCounter}`;
      const z = ++zRef.current;
      const pos = getInitialWindowPosition(
        size,
        options?.position === "cascade" ? "cascade" : "center",
        windowsRef.current,
        appId,
        idCounter,
      );

      const newWindow: WindowState = {
        id,
        appId,
        title: params?.title ? (params.title as string) : TITLES[appId],
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        minimized: false,
        maximized: false,
        zIndex: z,
        params,
      };

      if (import.meta.env.DEV) {
        console.debug("[DEBUG] spawnWindow", {
          id,
          appId,
          title: newWindow.title,
          x: pos.x,
          y: pos.y,
          z,
          params,
        });
      }

      setWindows((ws) => [...ws, newWindow]);
      setActiveWindowId(id);
      return { id };
    },
    [blockDesktopInput],
  );

  const debugSpawnedRef = useRef(false);

  useEffect(() => {
    if (
      import.meta.env.DEV &&
      window.location.search.includes("spawn-debug") &&
      !debugSpawnedRef.current
    ) {
      debugSpawnedRef.current = true;
      const titles = [
        "Terminal #1",
        "Terminal #2",
        "Terminal #3",
        "Terminal #4",
        "Terminal #5",
      ];
      titles.forEach((title, index) => {
        window.setTimeout(() => {
          spawnWindow(
            "terminal",
            {
              title,
              hostname: `debug-${index + 1}`,
            },
            { position: "cascade", force: true },
          );
        }, index * 150);
      });
    }
  }, [spawnWindow]);

  const openWindow = useCallback(
    (
      appId: AppId,
      params?: Record<string, unknown>,
      options?: { force?: boolean },
    ) => {
      if (blockDesktopInput && !options?.force) {
        window.dispatchEvent(new CustomEvent("hyk-breach-escape"));
        return;
      }

      // If opening an editor, focus existing instance for same file
      if (appId === "editor" && params) {
        const existing = windows.find(
          (w) => w.appId === "editor" && w.params?.title === params.title,
        );
        if (existing) {
          if (existing.minimized) {
            setWindows((ws) =>
              ws.map((w) =>
                w.id === existing.id ? { ...w, minimized: false } : w,
              ),
            );
          }
          bringToFront(existing.id);
          return;
        }
      }

      // If opening gallery with a specific image and gallery is already open
      if (appId === "gallery" && params) {
        const existing = windows.find((w) => w.appId === "gallery");
        if (existing) {
          setWindows((ws) =>
            ws.map((w) =>
              w.id === existing.id ? { ...w, minimized: false, params } : w,
            ),
          );
          bringToFront(existing.id);
          return;
        }
      }

      // For all other apps (except editor): focus existing instance if any
      if (appId !== "editor") {
        const existing = windows.find((w) => w.appId === appId);
        if (existing) {
          if (existing.minimized) {
            setWindows((ws) =>
              ws.map((w) =>
                w.id === existing.id ? { ...w, minimized: false } : w,
              ),
            );
          }
          bringToFront(existing.id);
          return;
        }
      }

      // Create new window instance with default centered positioning
      const size = DEFAULT_SIZES[appId];
      const id = `win-${++idCounter}`;
      const z = ++zRef.current;
      const pos = getInitialWindowPosition(
        size,
        "center",
        windowsRef.current,
        appId,
        idCounter,
      );

      setWindows((ws) => [
        ...ws,
        {
          id,
          appId,
          title: params?.title ? (params.title as string) : TITLES[appId],
          x: pos.x,
          y: pos.y,
          width: size.width,
          height: size.height,
          minimized: false,
          maximized: false,
          zIndex: z,
          params,
        },
      ]);
      setActiveWindowId(id);
    },
    [windows, bringToFront, blockDesktopInput],
  );

  useEffect(() => {
    const handleCountdown = (event: Event) => {
      const detail = (event as CustomEvent).detail as { active: boolean };
      setBlockDesktopInput(detail.active);
    };

    const handlePhase = (event: Event) => {
      const phase = (event as CustomEvent).detail.phase as string;
      switch (phase) {
        case "freeze":
          setBlockDesktopInput(true);
          break;
        case "close-terminal":
          // Persist terminals for the investigation board — do not destroy them
          break;
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
                };
              }
              return w;
            }),
          );
          break;
        case "desktop-instability":
          setDesktopInstable(true);
          breachTimers.current.push(
            window.setTimeout(() => setDesktopInstable(false), 1000),
          );
          break;
        case "browser-move":
          // Move browser window chaotically
          setWindows((ws) =>
            ws.map((w) => {
              if (w.appId === "browser") {
                return {
                  ...w,
                  x: w.x + (Math.random() > 0.5 ? 24 : -24),
                  y: w.y + (Math.random() > 0.5 ? 16 : -16),
                };
              }
              return w;
            }),
          );
          break;
        case "focus-terminal":
          // Switch focus from browser to terminal
          setWindows((ws) =>
            ws.map((w) => {
              if (
                w.appId === "terminal" &&
                !windows.find((x) => x.appId === "terminal")
              ) {
                return w;
              }
              return w;
            }),
          );
          const terminalWindow = windows.find((w) => w.appId === "terminal");
          if (terminalWindow) {
            bringToFront(terminalWindow.id, { force: true });
            setFocusedWindow("terminal");
          }
          breachTimers.current.push(
            window.setTimeout(() => setFocusedWindow(null), 300),
          );
          break;
        case "focus-browser":
          // Switch focus back to browser
          const browserWindow = windows.find((w) => w.appId === "browser");
          if (browserWindow) {
            bringToFront(browserWindow.id, { force: true });
            setFocusedWindow("browser");
          }
          breachTimers.current.push(
            window.setTimeout(() => setFocusedWindow(null), 300),
          );
          break;
        case "wallpaper-glitch":
          setWallpaperGlitch(true);
          breachTimers.current.push(
            window.setTimeout(() => setWallpaperGlitch(false), 600),
          );
          break;
        case "icon-flicker":
          setIconsFlicker(true);
          breachTimers.current.push(
            window.setTimeout(() => setIconsFlicker(false), 600),
          );
          break;
        case "flash-screen":
          setFlashScreen(true);
          breachTimers.current.push(
            window.setTimeout(() => setFlashScreen(false), 220),
          );
          break;
        case "logo-flash":
          setLogoFlash(true);
          breachTimers.current.push(
            window.setTimeout(() => setLogoFlash(false), 220),
          );
          break;
        case "screen-black":
          setScreenBlack(true);
          break;
        case "reload":
          window.location.reload();
          break;
        case "finished":
          setBlockDesktopInput(false);
          setScreenBlack(false);
          break;
      }
    };

    const handleDemoPopup = (event: Event) => {
      const d = (event as CustomEvent).detail as {
        title: string;
        body: string[];
        duration?: number;
      };
      if (popupTimerRef.current) {
        window.clearTimeout(popupTimerRef.current);
      }
      setPopup({ title: d.title, body: d.body });
      popupTimerRef.current = window.setTimeout(() => {
        setPopup(null);
        popupTimerRef.current = null;
      }, d.duration ?? 1800);
    };

    window.addEventListener("hyk-breach-countdown", handleCountdown);
    window.addEventListener("hyk-breach-phase", handlePhase);
    window.addEventListener("hyk-demo-popup", handleDemoPopup);

    return () => {
      window.removeEventListener("hyk-breach-countdown", handleCountdown);
      window.removeEventListener("hyk-breach-phase", handlePhase);
      window.removeEventListener("hyk-demo-popup", handleDemoPopup);
      breachTimers.current.forEach((id) => window.clearTimeout(id));
      breachTimers.current = [];
    };
  }, [openWindow, spawnWindow]);

  // Expose spawnWindow to window object so HYK demo engine can call it
  useEffect(() => {
    (window as any).spawnWindow = spawnWindow;
    return () => {
      delete (window as any).spawnWindow;
    };
  }, [spawnWindow]);

  const closeWindow = useCallback((id: string) => {
    setWindows((ws) => ws.filter((w) => w.id !== id));
    setActiveWindowId((curr) => (curr === id ? null : curr));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, minimized: true } : w)),
    );
    setActiveWindowId((curr) => (curr === id ? null : curr));
  }, []);

  const maximizeWindow = useCallback((id: string) => {
    setWindows((ws) =>
      ws.map((w) => (w.id === id ? { ...w, maximized: !w.maximized } : w)),
    );
  }, []);

  const moveWindow = useCallback((id: string, x: number, y: number) => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    setWindows((ws) =>
      ws.map((w) => {
        if (w.id !== id) return w;
        const clamped = clampWindowPosition(x, y, w.width, w.height, vw, vh);
        return { ...w, x: clamped.x, y: clamped.y };
      }),
    );
  }, []);

  const handleTopBarAppClick = useCallback(
    (windowId: string) => {
      if (blockDesktopInput) {
        window.dispatchEvent(new CustomEvent("hyk-breach-escape"));
        return;
      }

      const win = windows.find((w) => w.id === windowId);
      if (!win) return;

      if (win.minimized) {
        setWindows((ws) =>
          ws.map((w) => (w.id === windowId ? { ...w, minimized: false } : w)),
        );
        bringToFront(windowId);
      } else if (activeWindowId === windowId) {
        minimizeWindow(windowId);
      } else {
        bringToFront(windowId);
      }
    },
    [windows, activeWindowId, bringToFront, minimizeWindow, blockDesktopInput],
  );

  const renderApp = (w: WindowState) => {
    if (import.meta.env.DEV && w.appId === "terminal") {
      console.debug("[DEBUG] renderApp Terminal", {
        id: w.id,
        title: w.title,
        params: w.params,
      });
    }
    switch (w.appId) {
      case "projects":
        return <FileExplorer section="projects" openWindow={openWindow} />;
      case "experience":
        return <FileExplorer section="experience" openWindow={openWindow} />;
      case "education":
        return <FileExplorer section="education" openWindow={openWindow} />;
      case "gallery":
        return (
          <Gallery initialImageSrc={w.params?.imageSrc as string | undefined} />
        );
      case "resume":
        return <Resume />;
      case "browser":
        return (
          <Browser
            registerCloseRequest={(callback) => {
              browserCloseRequestRef.current = callback;
            }}
          />
        );
      case "terminal":
        return (
          <Terminal
            autoCommands={w.params?.autoCommands as string[] | undefined}
            demoLines={w.params?.demoLines as string[] | undefined}
            cinematicActions={w.params?.cinematicActions as any[] | undefined}
            visualOnly={w.params?.visualOnly as boolean | undefined}
            storyId={w.params?.storyId as string | undefined}
            demoAppend={w.params?.append as boolean | undefined}
            hostname={w.params?.hostname as string | undefined}
          />
        );
      case "profile":
        return <Profile />;
      case "recycle":
        return <Trash />;
      case "editor":
        return (
          <TextEditor
            content={w.params?.content as string | undefined}
            title={w.params?.title as string | undefined}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ThemeContext.Provider value={getTheme(isDark)}>
      <div
        onClick={(e) => {
          if (blockDesktopInput) {
            e.stopPropagation();
            return;
          }
          setSelectedIconId(null);
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
        {popup && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(0,0,0,0.74)",
              zIndex: 100000,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                background: "rgba(15,15,15,0.96)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 18,
                boxShadow: "0 30px 80px rgba(0,0,0,0.45)",
                padding: "24px 28px",
                maxWidth: 420,
                width: "min(100%, 420px)",
                color: "#f8fafc",
                fontFamily: "'Inter', sans-serif",
                pointerEvents: "none",
              }}
            >
              <div
                style={{
                  fontSize: "1rem",
                  fontWeight: 700,
                  marginBottom: 14,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#f8fafc",
                }}
              >
                {popup.title}
              </div>
              <div
                style={{ display: "flex", flexDirection: "column", gap: 10 }}
              >
                {popup.body.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    style={{
                      color: "#e2e8f0",
                      fontSize: "0.95rem",
                      lineHeight: 1.6,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {line}
                  </div>
                ))}
              </div>
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
        {/* ── Workspace container — single source of truth for horizontal bounds ── */}
        {/* TopBar lives inside so it inherits the same left/right edges as windows */}
        <div
          style={{
            position: "fixed",
            top: 0,
            bottom: 0,
            left: WORKSPACE_INSETS.left,
            right: WORKSPACE_INSETS.right,
            pointerEvents: "none",
            zIndex: 10001,
          }}
        >
          {/* TopBar — stop click propagation to avoid deselecting icons */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ pointerEvents: "auto" }}
          >
            <TopBar
              isDark={isDark}
              onToggleTheme={() => {
                if (blockDesktopInput) return;
                setIsDark((d) => {
                  const next = !d;
                  storageManager.update({ theme: next ? "dark" : "light" });
                  return next;
                });
              }}
              runningApps={windows}
              activeWindowId={activeWindowId}
              onAppClick={handleTopBarAppClick}
            />
          </div>
        </div>

        {/* Desktop icons — flex column wrap for responsive grid */}
        <div
          style={{
            position: "absolute",
            top: WORKSPACE_INSETS.top + 12,
            left: WORKSPACE_INSETS.left,
            bottom: WORKSPACE_INSETS.bottom,
            display: "flex",
            flexDirection: "column",
            flexWrap: "wrap",
            alignContent: "flex-start",
            gap: 6,
            maxHeight: "calc(100vh - 140px)",
            opacity: iconsFlicker ? 0.35 : 1,
            transition: iconsFlicker
              ? "opacity 0.1s ease"
              : "opacity 0.3s ease",
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
                e.stopPropagation();
                setSelectedIconId(icon.id);
              }}
              onDoubleClick={() => {
                openWindow(icon.id);
                setSelectedIconId(null);
              }}
            />
          ))}
        </div>

        {/* Open windows */}
        {windows.map((w) => (
          <WindowFrame
            key={w.id}
            title={w.title}
            x={
              w.appId === "browser" && browserTransform
                ? browserTransform.x
                : w.x
            }
            y={
              w.appId === "browser" && browserTransform
                ? browserTransform.y
                : w.y
            }
            width={
              w.appId === "browser" && browserTransform
                ? browserTransform.width
                : w.width
            }
            height={
              w.appId === "browser" && browserTransform
                ? browserTransform.height
                : w.height
            }
            zIndex={w.zIndex}
            minimized={w.minimized}
            maximized={w.maximized}
            isFocused={w.id === activeWindowId}
            onClose={() => {
              if (w.appId === "browser" && !browserCloseRequestRef.current()) {
                window.dispatchEvent(new CustomEvent("hyk-breach-escape"));
                return;
              }
              closeWindow(w.id);
            }}
            onMinimize={() => minimizeWindow(w.id)}
            onMaximize={() => maximizeWindow(w.id)}
            onMove={(x, y) => moveWindow(w.id, x, y)}
            onFocus={() => bringToFront(w.id)}
          >
            {renderApp(w)}
          </WindowFrame>
        ))}
      </div>
    </ThemeContext.Provider>
  );
}
