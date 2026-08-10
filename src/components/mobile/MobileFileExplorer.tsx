import { useState, useMemo, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import { PROJECTS } from "../../content/data"
import {
  getProjectFilesystem,
  resolveProjectExplorerPath,
  virtualNodesToFileItems,
  type ExplorerFileItem,
} from "@/lib/projectFilesystem"

type Props = {
  openWindow?: (appId: any, params?: any) => void
  registerBackHandler?: (handler: (() => boolean) | null) => void
}

export default function MobileFileExplorer({ openWindow, registerBackHandler }: Props) {
  const t = useTheme()
  const [currentPath, setCurrentPath] = useState<string[]>([])

  // Resolve directory items using the existing filesystem logic
  const displayItems = useMemo((): ExplorerFileItem[] => {
    if (currentPath.length === 0) {
      const rootFolders: ExplorerFileItem[] = PROJECTS.map((p) => ({
        name: p.name,
        type: "folder",
        children: virtualNodesToFileItems(getProjectFilesystem(p.id)),
      }))
      rootFolders.push({
        name: "Archive",
        type: "folder",
        children: [
          {
            name: "restricted.tar.gz",
            type: "file",
            content:
              "Classification restricted. [EPERM: 0x4F]\n\nUnauthorized decryption attempt logged.",
          },
        ],
      })
      return rootFolders
    }

    if (currentPath[0] === "Archive") {
      if (currentPath.length === 1) {
        return [
          {
            name: "restricted.tar.gz",
            type: "file",
            content:
              "Classification restricted. [EPERM: 0x4F]\n\nUnauthorized decryption attempt logged.",
          },
        ]
      }
      return []
    }

    return virtualNodesToFileItems(resolveProjectExplorerPath(currentPath))
  }, [currentPath])

  // Register internal back navigation to pop folders
  useEffect(() => {
    if (registerBackHandler) {
      registerBackHandler(() => {
        if (currentPath.length > 0) {
          setCurrentPath((prev) => prev.slice(0, -1))
          return true
        }
        return false // Let shell handle closing the app
      })
    }
    return () => {
      if (registerBackHandler) registerBackHandler(null)
    }
  }, [currentPath, registerBackHandler])

  // Handle single-tap item opening
  const handleItemTap = (item: ExplorerFileItem) => {
    if (item.type === "folder") {
      setCurrentPath((prev) => [...prev, item.name])
    } else if (item.type === "url" && item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    } else if (
      item.type === "markdown" ||
      item.type === "json" ||
      item.type === "file"
    ) {
      if (openWindow) {
        openWindow("editor", { content: item.content, title: item.name })
      }
    } else if (item.type === "image" && item.imageSrc) {
      if (openWindow) {
        openWindow("gallery", { imageSrc: item.imageSrc })
      }
    }
  }

  // Icons for files/folders
  const renderIcon = (item: ExplorerFileItem) => {
    const iconColor = t.isDark ? "#a78bfa" : "#7c3aed"
    switch (item.type) {
      case "folder":
        return (
          <span style={{ fontSize: "1.4rem" }}>📁</span>
        )
      case "url":
        return (
          <span style={{ fontSize: "1.4rem" }}>🔗</span>
        )
      case "image":
        return (
          <span style={{ fontSize: "1.4rem" }}>🖼️</span>
        )
      case "json":
        return (
          <span style={{ fontSize: "1.4rem" }}>⚙️</span>
        )
      case "markdown":
      case "file":
      default:
        return (
          <span style={{ fontSize: "1.4rem" }}>📄</span>
        )
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        background: t.bg,
        transition: t.transition,
      }}
    >
      {/* ── Mobile Breadcrumbs Header ── */}
      <div
        style={{
          padding: "12px 16px",
          borderBottom: `1px solid ${t.border}`,
          background: t.bgSidebar,
          display: "flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          overflowX: "auto",
          whiteSpace: "nowrap",
          scrollbarWidth: "none",
        }}
      >
        <span
          onClick={() => setCurrentPath([])}
          style={{
            fontSize: "0.8rem",
            fontWeight: currentPath.length === 0 ? 700 : 500,
            color: currentPath.length === 0 ? t.text : t.textMuted,
            cursor: "pointer",
          }}
        >
          Files
        </span>

        {currentPath.map((pathSegment, idx) => {
          const isLast = idx === currentPath.length - 1
          return (
            <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: "0.75rem", color: t.textFaint }}>/</span>
              <span
                onClick={() => {
                  if (!isLast) {
                    setCurrentPath(currentPath.slice(0, idx + 1))
                  }
                }}
                style={{
                  fontSize: "0.8rem",
                  fontWeight: isLast ? 700 : 500,
                  color: isLast ? t.text : t.textMuted,
                  cursor: isLast ? "default" : "pointer",
                }}
              >
                {pathSegment}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── File list container ── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 0",
        }}
      >
        {displayItems.length === 0 ? (
          <div
            style={{
              padding: "48px 16px",
              textAlign: "center",
              color: t.textFaint,
              fontSize: "0.85rem",
              fontFamily: "monospace",
            }}
          >
            Empty Folder
          </div>
        ) : (
          displayItems.map((item, idx) => (
            <div
              key={idx}
              onClick={() => handleItemTap(item)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px",
                borderBottom: `1px solid ${t.border}`,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = t.isDark
                  ? "rgba(255,255,255,0.02)"
                  : "rgba(0,0,0,0.01)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                {renderIcon(item)}
                <span
                  style={{
                    fontWeight: 500,
                    color: t.text,
                    fontFamily: item.type !== "folder" ? "'JetBrains Mono', monospace" : "inherit",
                    fontSize: item.type !== "folder" ? "0.82rem" : "0.88rem",
                  }}
                >
                  {item.name}
                </span>
              </div>

              {item.type === "folder" ? (
                <span style={{ color: t.textFaint, fontSize: "0.9rem" }}>❯</span>
              ) : (
                item.type === "url" && (
                  <span style={{ color: t.textFaint, fontSize: "0.75rem" }}>↗</span>
                )
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
