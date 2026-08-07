import { useState, useEffect } from "react"
import { PROJECTS } from "@/content/data"
import { useTheme } from "@/context/ThemeContext"
import portfolioImg from "@/assets/screenshots/portfolio.png"

type Props = {
  initialImageSrc?: string
}

function ChevronLeftIcon({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  )
}

function ChevronRightIcon({ size = 24, color = "#fff" }: { size?: number; color?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export default function Gallery({ initialImageSrc }: Props) {
  const t = useTheme()
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null)
  const [selected, setSelected] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomOrigin, setZoomOrigin] = useState("center center")
  const [customImage, setCustomImage] = useState<string | null>(
    initialImageSrc || null,
  )

  // Sync state if initialImageSrc changes while the component is mounted
  useEffect(() => {
    if (initialImageSrc) {
      setCustomImage(initialImageSrc)
    }
  }, [initialImageSrc])

  const active = customImage
    ? { src: customImage, alt: "Preview", caption: "Project Preview" }
    : selected
      ? { src: selected, alt: "Screenshot", caption: "Project Screenshot" }
      : null

  const handleClose = () => {
    setSelected(null)
    setCustomImage(null)
    setIsZoomed(false)
    setZoomOrigin("center center")
  }

  const albums = PROJECTS.filter((p) => p.screenshots && p.screenshots.length > 0)
  const activeAlbum = PROJECTS.find((p) => p.id === currentAlbumId)

  // Find the active list of images for navigation
  let activeImagesList: string[] = []
  if (currentAlbumId && activeAlbum) {
    activeImagesList = activeAlbum.screenshots || []
  } else if (active) {
    // If opened directly from FileExplorer (customImage), find the project it belongs to
    const matchingProj = PROJECTS.find((p) => p.screenshots && p.screenshots.includes(active.src))
    if (matchingProj) {
      activeImagesList = matchingProj.screenshots || []
    } else {
      activeImagesList = [active.src]
    }
  }

  const currentIndex = activeImagesList.indexOf(active?.src || "")

  const goPrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (activeImagesList.length <= 1 || currentIndex === -1) return
    setIsZoomed(false)
    setZoomOrigin("center center")
    const prevIdx = (currentIndex - 1 + activeImagesList.length) % activeImagesList.length
    const prevSrc = activeImagesList[prevIdx]
    if (customImage) {
      setCustomImage(prevSrc)
    } else {
      setSelected(prevSrc)
    }
  }

  const goNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (activeImagesList.length <= 1 || currentIndex === -1) return
    setIsZoomed(false)
    setZoomOrigin("center center")
    const nextIdx = (currentIndex + 1) % activeImagesList.length
    const nextSrc = activeImagesList[nextIdx]
    if (customImage) {
      setCustomImage(nextSrc)
    } else {
      setSelected(nextSrc)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!active) return
      if (e.key === "ArrowLeft") {
        goPrev()
      } else if (e.key === "ArrowRight") {
        goNext()
      } else if (e.key === "Escape") {
        handleClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [active, currentIndex, activeImagesList])

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (isZoomed) {
      setIsZoomed(false)
    } else {
      const rect = e.currentTarget.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 100
      const y = ((e.clientY - rect.top) / rect.height) * 100
      setZoomOrigin(`${x}% ${y}%`)
      setIsZoomed(true)
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: t.bg,
        height: "100%",
        position: "relative",
        transition: t.transition,
      }}
    >
      {/* Lightbox */}
      {active && (
        <div
          onClick={handleClose}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,0.92)",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 32,
            cursor: "zoom-out",
            overflow: "hidden",
          }}
        >
          {/* Left Arrow */}
          {activeImagesList.length > 1 && (
            <button
              onClick={goPrev}
              style={{
                position: "absolute",
                left: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                zIndex: 101,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1.05)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1)"
              }}
            >
              <ChevronLeftIcon />
            </button>
          )}

          {/* Image Wrapper */}
          <div
            style={{
              maxWidth: "85%",
              maxHeight: "80vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              borderRadius: 8,
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={active.src}
              alt={active.alt || "Preview"}
              onClick={handleImageClick}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                width: "auto",
                height: "auto",
                objectFit: "contain",
                userSelect: "none",
                cursor: isZoomed ? "zoom-out" : "zoom-in",
                transformOrigin: zoomOrigin,
                transform: isZoomed ? "scale(2.5)" : "scale(1)",
                transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          </div>

          {/* Right Arrow */}
          {activeImagesList.length > 1 && (
            <button
              onClick={goNext}
              style={{
                position: "absolute",
                right: 24,
                top: "50%",
                transform: "translateY(-50%)",
                background: "rgba(255,255,255,0.08)",
                border: "none",
                borderRadius: "50%",
                width: 48,
                height: 48,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                transition: "all 0.2s ease",
                zIndex: 101,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.18)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1.05)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.08)"
                ;(e.currentTarget as HTMLButtonElement).style.transform = "translateY(-50%) scale(1)"
              }}
            >
              <ChevronRightIcon />
            </button>
          )}

          {/* Info Footer */}
          <div
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.8rem",
              marginTop: 16,
              fontFamily: "'JetBrains Mono', monospace",
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span>{active.caption}</span>
            {activeImagesList.length > 1 && (
              <span style={{ color: "rgba(255,255,255,0.25)" }}>
                ({currentIndex + 1} of {activeImagesList.length})
              </span>
            )}
          </div>

          <div
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              color: "rgba(255,255,255,0.4)",
              fontSize: "0.75rem",
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Click anywhere or press Esc to close
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div
        style={{
          height: 36,
          flexShrink: 0,
          background: t.bgToolbar,
          borderBottom: "1px solid " + t.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 14px",
          userSelect: "none",
          transition: t.transition,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {currentAlbumId && (
            <button
              onClick={() => setCurrentAlbumId(null)}
              style={{
                background: "transparent",
                border: "none",
                color: t.isDark ? "#4ade80" : "#2563eb",
                fontSize: "0.75rem",
                fontFamily: "'JetBrains Mono', monospace",
                cursor: "pointer",
                padding: "2px 6px",
                borderRadius: 4,
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = t.isDark
                  ? "rgba(255,255,255,0.05)"
                  : "rgba(0,0,0,0.05)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.background = "transparent"
              }}
            >
              ← Albums
            </button>
          )}
          <span
            style={{
              color: t.textFaint,
              fontSize: "0.72rem",
              fontFamily: "'JetBrains Mono', monospace",
              transition: t.transition,
            }}
          >
            {currentAlbumId
              ? `${activeAlbum?.name} · ${activeAlbum?.screenshots.length} screenshots`
              : `${albums.length} albums`}
          </span>
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 16,
          alignContent: "start",
        }}
      >
        {/* Album List View */}
        {!currentAlbumId &&
          albums.map((proj) => {
            const firstImage = proj.screenshots[0] || portfolioImg
            return (
              <div
                key={proj.id}
                onClick={() => setCurrentAlbumId(proj.id)}
                style={{
                  borderRadius: 8,
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  background: t.isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                  border: "1px solid " + t.border,
                  transition: "all 0.2s ease-in-out",
                  userSelect: "none",
                  display: "flex",
                  flexDirection: "column",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = "translateY(-4px)"
                  el.style.borderColor = t.isDark
                    ? "rgba(74,222,128,0.4)"
                    : "rgba(37,99,235,0.4)"
                  el.style.boxShadow = t.isDark
                    ? "0 10px 30px rgba(0,0,0,0.3)"
                    : "0 10px 20px rgba(0,0,0,0.05)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = "translateY(0)"
                  el.style.borderColor = t.border
                  el.style.boxShadow = "none"
                }}
              >
                <div style={{ position: "relative", width: "100%", height: 130 }}>
                  <img
                    src={firstImage}
                    alt={proj.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      background: "rgba(0,0,0,0.75)",
                      color: "#fff",
                      fontSize: "0.65rem",
                      padding: "3px 6px",
                      borderRadius: 4,
                      fontFamily: "'JetBrains Mono', monospace",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    📁 {proj.screenshots.length} Photos
                  </div>
                </div>
                <div
                  style={{
                    padding: "10px 12px",
                    borderTop: "1px solid " + t.border,
                    transition: t.transition,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      color: t.text,
                      marginBottom: 2,
                    }}
                  >
                    {proj.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.68rem",
                      color: t.textMuted,
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {proj.year} · {proj.status}
                  </div>
                </div>
              </div>
            )
          })}

        {/* Inside Active Album View */}
        {currentAlbumId &&
          activeAlbum?.screenshots.map((src, idx) => {
            const filename = `${
              activeAlbum.id === "workspace"
                ? "worksphere"
                : activeAlbum.id === "debuggers-lms"
                  ? "debuggers"
                  : activeAlbum.id
            }_${idx + 1}.png`
            return (
              <div
                key={idx}
                onClick={() => setSelected(src)}
                style={{
                  borderRadius: 6,
                  overflow: "hidden",
                  cursor: "zoom-in",
                  position: "relative",
                  background: t.isDark
                    ? "rgba(255,255,255,0.03)"
                    : "rgba(0,0,0,0.02)",
                  border: "1px solid " + t.border,
                  transition: "all 0.15s ease-in-out",
                  userSelect: "none",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = "scale(1.02)"
                  el.style.borderColor = t.isDark
                    ? "rgba(74,222,128,0.3)"
                    : "rgba(37,99,235,0.3)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement
                  el.style.transform = "scale(1)"
                  el.style.borderColor = t.border
                }}
              >
                <img
                  src={src}
                  alt={filename}
                  style={{
                    width: "100%",
                    height: 130,
                    objectFit: "cover",
                    display: "block",
                  }}
                />
                <div
                  style={{
                    padding: "7px 10px",
                    color: t.textMuted,
                    fontSize: "0.7rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    transition: t.transition,
                  }}
                >
                  {filename}
                </div>
              </div>
            )
          })}

        {currentAlbumId &&
          (!activeAlbum?.screenshots || activeAlbum.screenshots.length === 0) && (
            <div
              style={{
                gridColumn: "1 / -1",
                padding: "48px 16px",
                textAlign: "center",
                color: t.textMuted,
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.8rem",
              }}
            >
              No screenshots available in this album.
            </div>
          )}
      </div>
    </div>
  )
}
