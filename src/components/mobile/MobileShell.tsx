import { useState, useCallback, useRef } from "react"
import { useTheme } from "../../context/ThemeContext"
import MobileStatusBar from "./MobileStatusBar"
import MobileHomeScreen from "./MobileHomeScreen"
import MobileNavBar from "./MobileNavBar"
import MobileRecentApps from "./MobileRecentApps"
import MobileAppView from "./MobileAppView"
import type { AppId } from "../desktop/Desktop"
import { storageManager } from "../../lib/storage"
import lightWallpaper from "@/assets/wallpapers/light.png"
import darkWallpaper from "@/assets/wallpapers/dark.png"

// Import app components
import MobileFileExplorer from "./MobileFileExplorer"
import MobileGallery from "./MobileGallery"
import MobileExperience from "./MobileExperience"
import MobileEducation from "./MobileEducation"
import Resume from "../../apps/Resume"
import Browser from "../../apps/Browser"
import Terminal from "../../apps/Terminal"
import Profile from "../../apps/Profile"
import TextEditor from "../../apps/TextEditor"

type Props = {
  isDark: boolean
  setIsDark: React.Dispatch<React.SetStateAction<boolean>>
}

type StackItem = {
  appId: AppId
  params?: any
}

const APP_TITLES: Record<AppId, string> = {
  profile: "Profile",
  projects: "Files",
  experience: "Experience",
  education: "Education",
  gallery: "Gallery",
  resume: "Resume.pdf",
  browser: "Browser",
  terminal: "Terminal",
  recycle: "Trash",
  editor: "Text Editor",
}

export default function MobileShell({ isDark, setIsDark }: Props) {
  const t = useTheme()
  const [openApp, setOpenApp] = useState<AppId | null>(null)
  const [appParams, setAppParams] = useState<any>(null)
  const [navStack, setNavStack] = useState<StackItem[]>([])
  const [recentApps, setRecentApps] = useState<AppId[]>([])
  const [showRecents, setShowRecents] = useState(false)
  // Each app can register a handler that returns true if it consumed the back action
  const internalBackHandlerRef = useRef<(() => boolean) | null>(null)

  // Provide this to apps so they can register/unregister their internal back handler
  const registerBackHandler = useCallback((handler: (() => boolean) | null) => {
    internalBackHandlerRef.current = handler
  }, [])

  // Custom openWindow implementation for mobile
  const openWindow = useCallback((appId: AppId, params?: any) => {
    setOpenApp(appId)
    setAppParams(params)
    setNavStack((prev) => [...prev, { appId, params }])
    setRecentApps((prev) => {
      const filtered = prev.filter((id) => id !== appId)
      return [...filtered, appId]
    })
    // Reset any internal back handler when opening a new app
    internalBackHandlerRef.current = null
  }, [])

  const handleBack = useCallback(() => {
    if (showRecents) {
      setShowRecents(false)
      return
    }
    // First, let the open app handle back internally (e.g. Browser: article → news → home)
    if (internalBackHandlerRef.current) {
      const consumed = internalBackHandlerRef.current()
      if (consumed) return
    }
    // App has no more internal history — navigate at the shell level
    if (navStack.length <= 1) {
      setOpenApp(null)
      setAppParams(null)
      setNavStack([])
    } else {
      const nextStack = navStack.slice(0, -1)
      const prevItem = nextStack[nextStack.length - 1]
      setNavStack(nextStack)
      setOpenApp(prevItem.appId)
      setAppParams(prevItem.params)
    }
  }, [navStack, showRecents])

  const handleHome = useCallback(() => {
    setShowRecents(false)
    setOpenApp(null)
    setAppParams(null)
    setNavStack([])
    internalBackHandlerRef.current = null
  }, [])

  const handleRecentsToggle = useCallback(() => {
    setShowRecents((prev) => !prev)
  }, [])

  const handleSelectRecentApp = useCallback((appId: AppId) => {
    setOpenApp(appId)
    setAppParams(null)
    setNavStack([{ appId }])
    setShowRecents(false)
    internalBackHandlerRef.current = null
  }, [])

  const handleCloseRecentApp = useCallback(
    (appId: AppId) => {
      setRecentApps((prev) => prev.filter((id) => id !== appId))
      if (openApp === appId) {
        setOpenApp(null)
        setAppParams(null)
        setNavStack([])
        internalBackHandlerRef.current = null
      }
    },
    [openApp],
  )

  const handleClearAllRecents = useCallback(() => {
    setRecentApps([])
    setOpenApp(null)
    setAppParams(null)
    setNavStack([])
    setShowRecents(false)
    internalBackHandlerRef.current = null
  }, [])

  const handleToggleTheme = useCallback(() => {
    const next = !isDark
    storageManager.updateTheme(next ? "dark" : "light")
    setIsDark(next)
  }, [isDark, setIsDark])

  // Map AppId to its component render, passing registerBackHandler for apps that support it
  const renderApp = (appId: AppId) => {
    switch (appId) {
      case "projects":
        return (
          <MobileFileExplorer
            openWindow={openWindow}
            registerBackHandler={registerBackHandler}
          />
        )
      case "experience":
        return (
          <MobileExperience />
        )
      case "education":
        return (
          <MobileEducation
            registerBackHandler={registerBackHandler}
          />
        )
      case "gallery":
      case "recycle": // Map recycle case to gallery on mobile as well
        return (
          <MobileGallery
            initialImageSrc={appParams?.imageSrc}
            registerBackHandler={registerBackHandler}
          />
        )
      case "resume":
        return <Resume />
      case "browser":
        return (
          <Browser
            registerCloseRequest={() => {}}
            registerBackHandler={registerBackHandler}
          />
        )
      case "terminal":
        return (
          <Terminal
            autoCommands={appParams?.autoCommands}
            demoLines={appParams?.demoLines}
            cinematicActions={appParams?.cinematicActions}
            visualOnly={appParams?.visualOnly}
            storyId={appParams?.storyId}
            demoAppend={appParams?.append}
            hostname={appParams?.hostname}
          />
        )
      case "profile":
        return <Profile />
      case "editor":
        return (
          <TextEditor content={appParams?.content} title={appParams?.title} />
        )
      default:
        return null
    }
  }

  const activeTitle = openApp ? APP_TITLES[openApp] || "App" : ""
  const canGoBack = showRecents || openApp !== null

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: t.isDark ? "#09090b" : "#f5f5f7",
      }}
    >
      {/* Background wallpaper — mobile-specific positioning */}
      {/* Dark wallpaper layer */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${darkWallpaper})`,
          // auto width, 100% height → natural aspect ratio, no distortion
          backgroundSize: "auto 100%",
          // anchor to right so the figure (right-side subject) stays visible
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          opacity: isDark ? 1 : 0,
          transition: "opacity 500ms ease-in-out",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      {/* Light wallpaper layer */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${lightWallpaper})`,
          backgroundSize: "auto 100%",
          backgroundPosition: "right center",
          backgroundRepeat: "no-repeat",
          opacity: isDark ? 0 : 1,
          transition: "opacity 500ms ease-in-out",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Top Status Bar — fixed height 28px */}
      <MobileStatusBar />

      {/* Main Content Area — grows between status bar and nav bar */}
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          // Reserve bottom space for the nav bar (52px fixed)
          marginBottom: 52,
        }}
      >
        {openApp === null ? (
          <MobileHomeScreen
            onOpenApp={openWindow}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
          />
        ) : (
          <MobileAppView
            title={activeTitle}
            isDark={isDark}
            onToggleTheme={handleToggleTheme}
          >
            {renderApp(openApp)}
          </MobileAppView>
        )}
      </div>

      {/* Recent apps deck overlay */}
      {showRecents && (
        <MobileRecentApps
          recentApps={recentApps}
          onSelectApp={handleSelectRecentApp}
          onCloseApp={handleCloseRecentApp}
          onClearAll={handleClearAllRecents}
          onCloseOverlay={handleRecentsToggle}
        />
      )}

      {/* Bottom Navigation Bar — position: fixed so it stays at bottom */}
      <MobileNavBar
        onBack={handleBack}
        onHome={handleHome}
        onRecents={handleRecentsToggle}
        canGoBack={canGoBack}
      />
    </div>
  )
}
