import { useState, useCallback } from "react"
import { useTheme } from "../../context/ThemeContext"
import MobileStatusBar from "./MobileStatusBar"
import MobileHomeScreen from "./MobileHomeScreen"
import MobileNavBar from "./MobileNavBar"
import MobileRecentApps from "./MobileRecentApps"
import MobileAppView from "./MobileAppView"
import type { AppId } from "../desktop/Desktop"
import { storageManager } from "../../lib/storage"

// Import app components
import FileExplorer from "../../apps/FileExplorer"
import Gallery from "../../apps/Gallery"
import Resume from "../../apps/Resume"
import Browser from "../../apps/Browser"
import Terminal from "../../apps/Terminal"
import Profile from "../../apps/Profile"
import Trash from "../../apps/Trash"
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
  projects: "Projects",
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

  // Custom openWindow implementation for mobile
  const openWindow = useCallback((appId: AppId, params?: any) => {
    setOpenApp(appId)
    setAppParams(params)
    setNavStack((prev) => [...prev, { appId, params }])
    setRecentApps((prev) => {
      const filtered = prev.filter((id) => id !== appId)
      return [...filtered, appId]
    })
  }, [])

  const handleBack = useCallback(() => {
    if (showRecents) {
      setShowRecents(false)
      return
    }
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
  }, [])

  const handleRecentsToggle = useCallback(() => {
    setShowRecents((prev) => !prev)
  }, [])

  const handleSelectRecentApp = useCallback((appId: AppId) => {
    setOpenApp(appId)
    setAppParams(null)
    setNavStack([{ appId }])
    setShowRecents(false)
  }, [])

  const handleCloseRecentApp = useCallback(
    (appId: AppId) => {
      setRecentApps((prev) => prev.filter((id) => id !== appId))
      if (openApp === appId) {
        setOpenApp(null)
        setAppParams(null)
        setNavStack([])
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
  }, [])

  const handleToggleTheme = useCallback(() => {
    const next = !isDark
    storageManager.updateTheme(next ? "dark" : "light")
    setIsDark(next)
  }, [isDark, setIsDark])

  // Map AppId to its component render
  const renderApp = (appId: AppId) => {
    switch (appId) {
      case "projects":
        return <FileExplorer section="projects" openWindow={openWindow} />
      case "experience":
        return <FileExplorer section="experience" openWindow={openWindow} />
      case "education":
        return <FileExplorer section="education" openWindow={openWindow} />
      case "gallery":
        return <Gallery initialImageSrc={appParams?.imageSrc} />
      case "resume":
        return <Resume />
      case "browser":
        return <Browser registerCloseRequest={() => {}} />
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
      case "recycle":
        return <Trash />
      case "editor":
        return <TextEditor content={appParams?.content} title={appParams?.title} />
      default:
        return null
    }
  }

  const activeTitle = openApp ? APP_TITLES[openApp] || "App" : ""

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
      {/* Background wallpaper layers matching desktop shell */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: isDark
            ? "radial-gradient(circle at 50% 20%, #1e1b4b 0%, #09090b 100%)"
            : "radial-gradient(circle at 50% 20%, #f0f4ff 0%, #e2e8f0 100%)",
          zIndex: 0,
          transition: t.transition,
        }}
      />

      {/* Top Status Bar */}
      <MobileStatusBar />

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          position: "relative",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          paddingBottom: 52, // bottom nav bar offset
        }}
      >
        {openApp === null ? (
          <MobileHomeScreen onOpenApp={openWindow} />
        ) : (
          <MobileAppView title={activeTitle} isDark={isDark} onToggleTheme={handleToggleTheme}>
            {renderApp(openApp)}
          </MobileAppView>
        )}
      </div>

      {/* Recent apps deck preview overlay */}
      {showRecents && (
        <MobileRecentApps
          recentApps={recentApps}
          onSelectApp={handleSelectRecentApp}
          onCloseApp={handleCloseRecentApp}
          onClearAll={handleClearAllRecents}
          onCloseOverlay={handleRecentsToggle}
        />
      )}

      {/* Bottom Navigation Bar */}
      <MobileNavBar
        onBack={handleBack}
        onHome={handleHome}
        onRecents={handleRecentsToggle}
        canGoBack={navStack.length > 0 || showRecents}
      />
    </div>
  )
}
