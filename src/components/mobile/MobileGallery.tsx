import { useState, useEffect, useRef } from "react"
import { useTheme } from "../../context/ThemeContext"
import { PROJECTS } from "../../content/data"
import blackCapImg from "@/assets/screenshots/trash/blackCap.png"

type Props = {
  initialImageSrc?: string
  registerBackHandler?: (handler: (() => boolean) | null) => void
}

const TRASH_ITEMS = [
  {
    id: "blackcap",
    name: "blackCap.png",
    type: "image",
    src: blackCapImg,
    deletedAt: "Nov 21, 2025",
  },
]

type ActiveImage = {
  src: string
  title: string
  albumName?: string
}

export default function MobileGallery({ initialImageSrc, registerBackHandler }: Props) {
  const t = useTheme()
  const [activeTab, setActiveTab] = useState<"photos" | "albums" | "trash">("photos")
  const [currentAlbumId, setCurrentAlbumId] = useState<string | null>(null)
  
  // Lightbox state
  const [activeImage, setActiveImage] = useState<ActiveImage | null>(null)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Load initial image if provided from FileExplorer
  useEffect(() => {
    if (initialImageSrc) {
      // Find where this image belongs
      const matchingProj = PROJECTS.find((p) => p.screenshots && p.screenshots.includes(initialImageSrc))
      setActiveImage({
        src: initialImageSrc,
        title: matchingProj ? matchingProj.name : "Preview",
        albumName: matchingProj?.name,
      })
    }
  }, [initialImageSrc])

  // Get list of all photos across all albums
  const albums = PROJECTS.filter((p) => p.screenshots && p.screenshots.length > 0)
  const allPhotos: ActiveImage[] = albums.flatMap((proj) =>
    (proj.screenshots || []).map((src) => ({
      src,
      title: proj.name,
      albumName: proj.name,
    }))
  )

  const activeAlbum = PROJECTS.find((p) => p.id === currentAlbumId)
  const albumPhotos: ActiveImage[] = activeAlbum
    ? (activeAlbum.screenshots || []).map((src) => ({
        src,
        title: activeAlbum.name,
        albumName: activeAlbum.name,
      }))
    : []

  // Back button routing
  useEffect(() => {
    if (registerBackHandler) {
      registerBackHandler(() => {
        if (activeImage) {
          setActiveImage(null)
          return true
        }
        if (currentAlbumId) {
          setCurrentAlbumId(null)
          return true
        }
        if (activeTab !== "photos") {
          setActiveTab("photos")
          return true
        }
        return false // Let shell handle closing the app
      })
    }
    return () => {
      if (registerBackHandler) registerBackHandler(null)
    }
  }, [activeImage, currentAlbumId, activeTab, registerBackHandler])

  // Swipe navigation support for lightbox
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      handleNextPhoto()
    } else if (isRightSwipe) {
      handlePrevPhoto()
    }
  }

  // Find active image list context
  const getActivePhotosList = (): ActiveImage[] => {
    if (activeTab === "trash") {
      return TRASH_ITEMS.map((item) => ({
        src: item.src,
        title: item.name,
        albumName: "Trash",
      }))
    }
    if (currentAlbumId) {
      return albumPhotos
    }
    return allPhotos
  }

  const handleNextPhoto = () => {
    if (!activeImage) return
    const list = getActivePhotosList()
    const idx = list.findIndex((p) => p.src === activeImage.src)
    if (idx !== -1 && list.length > 1) {
      const nextIdx = (idx + 1) % list.length
      setActiveImage(list[nextIdx])
    }
  }

  const handlePrevPhoto = () => {
    if (!activeImage) return
    const list = getActivePhotosList()
    const idx = list.findIndex((p) => p.src === activeImage.src)
    if (idx !== -1 && list.length > 1) {
      const prevIdx = (idx - 1 + list.length) % list.length
      setActiveImage(list[prevIdx])
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
        position: "relative",
      }}
    >
      {/* ── Tabs Navigation ── */}
      {!activeImage && (
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid " + t.border,
            background: t.bgSidebar,
            padding: "4px 8px",
            justifyContent: "space-around",
            flexShrink: 0,
          }}
        >
          {(["photos", "albums", "trash"] as const).map((tab) => {
            const isActive = activeTab === tab
            const label = tab.charAt(0).toUpperCase() + tab.slice(1)
            const icon = tab === "photos" ? "🖼️" : tab === "albums" ? "📁" : "🗑️"
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setCurrentAlbumId(null)
                }}
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  borderBottom: isActive
                    ? `3px solid ${t.isDark ? "#4ade80" : "#2563eb"}`
                    : "3px solid transparent",
                  padding: "10px 0",
                  fontSize: "0.8rem",
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? t.text : t.textMuted,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            )
          })}
        </div>
      )}

      {/* ── Main Content Pane ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
        {/* LIGHTBOX / FULL SCREEN VIEWER */}
        {activeImage && (
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            style={{
              position: "absolute",
              inset: 0,
              background: "#000000",
              zIndex: 1000,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {/* Header / Actions */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 56,
                background: "rgba(0,0,0,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "0 16px",
                color: "#fff",
                zIndex: 1010,
              }}
            >
              <button
                onClick={() => setActiveImage(null)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#fff",
                  fontSize: "1.5rem",
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                ←
              </button>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{activeImage.title}</div>
                {activeImage.albumName && (
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.6)" }}>
                    {activeImage.albumName}
                  </div>
                )}
              </div>
              <div style={{ width: 24 }} /> {/* Spacer */}
            </div>

            {/* Centered Image Container */}
            <div
              style={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 16,
              }}
            >
              <img
                src={activeImage.src}
                alt="Fullscreen Preview"
                style={{
                  maxWidth: "100%",
                  maxHeight: "80vh",
                  objectFit: "contain",
                  borderRadius: 4,
                  boxShadow: "0 10px 40px rgba(0,0,0,0.8)",
                }}
              />
            </div>

            {/* Previous / Next buttons for easy touch navigation */}
            <div
              style={{
                position: "absolute",
                bottom: 24,
                display: "flex",
                gap: 32,
                zIndex: 1010,
              }}
            >
              <button
                onClick={handlePrevPhoto}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                ◀
              </button>
              <button
                onClick={handleNextPhoto}
                style={{
                  background: "rgba(255, 255, 255, 0.15)",
                  border: "none",
                  color: "#fff",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  fontSize: "1.1rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                ▶
              </button>
            </div>

            {/* Instruction tooltip */}
            <div
              style={{
                position: "absolute",
                bottom: 84,
                color: "rgba(255,255,255,0.4)",
                fontSize: "0.65rem",
                fontFamily: "monospace",
              }}
            >
              Swipe left/right to browse
            </div>
          </div>
        )}

        {/* TAB 1: ALL PHOTOS */}
        {activeTab === "photos" && !activeImage && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 4,
            }}
          >
            {allPhotos.map((photo, index) => (
              <div
                key={index}
                onClick={() => setActiveImage(photo)}
                style={{
                  aspectRatio: "1/1",
                  overflow: "hidden",
                  borderRadius: 6,
                  background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: `1px solid ${t.border}`,
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>
        )}

        {/* TAB 2: ALBUMS */}
        {activeTab === "albums" && !activeImage && (
          <div>
            {!currentAlbumId ? (
              // List Albums
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 16,
                  padding: 8,
                }}
              >
                {albums.map((proj) => {
                  const coverImage = proj.screenshots[0]
                  return (
                    <div
                      key={proj.id}
                      onClick={() => setCurrentAlbumId(proj.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          aspectRatio: "1/1",
                          borderRadius: 12,
                          overflow: "hidden",
                          border: `1px solid ${t.border}`,
                          position: "relative",
                          background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        }}
                      >
                        <img
                          src={coverImage}
                          alt={proj.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <div
                          style={{
                            position: "absolute",
                            bottom: 8,
                            right: 8,
                            background: "rgba(0,0,0,0.7)",
                            color: "#fff",
                            fontSize: "0.6rem",
                            fontWeight: 600,
                            padding: "2px 6px",
                            borderRadius: 4,
                          }}
                        >
                          {proj.screenshots.length}
                        </div>
                      </div>
                      <div style={{ paddingLeft: 4 }}>
                        <div
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 700,
                            color: t.text,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {proj.name}
                        </div>
                        <div style={{ fontSize: "0.68rem", color: t.textMuted }}>
                          {proj.year}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              // Inside Single Album View
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 12,
                    padding: "0 4px",
                  }}
                >
                  <button
                    onClick={() => setCurrentAlbumId(null)}
                    style={{
                      background: "transparent",
                      border: "none",
                      color: t.isDark ? "#4ade80" : "#2563eb",
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    ← Albums
                  </button>
                  <span style={{ fontSize: "0.8rem", color: t.textMuted }}>/</span>
                  <span style={{ fontSize: "0.8rem", fontWeight: 700, color: t.text }}>
                    {activeAlbum?.name}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 4,
                  }}
                >
                  {albumPhotos.map((photo, index) => (
                    <div
                      key={index}
                      onClick={() => setActiveImage(photo)}
                      style={{
                        aspectRatio: "1/1",
                        overflow: "hidden",
                        borderRadius: 6,
                        background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        border: `1px solid ${t.border}`,
                      }}
                    >
                      <img
                        src={photo.src}
                        alt={photo.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: TRASH */}
        {activeTab === "trash" && !activeImage && (
          <div>
            <div
              style={{
                fontSize: "0.7rem",
                color: t.textFaint,
                marginBottom: 12,
                fontFamily: "monospace",
                padding: "0 4px",
              }}
            >
              Items here will be permanently deleted soon.
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 4,
              }}
            >
              {TRASH_ITEMS.map((item) => (
                <div
                  key={item.id}
                  onClick={() =>
                    setActiveImage({
                      src: item.src,
                      title: item.name,
                      albumName: "Trash Item",
                    })
                  }
                  style={{
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    borderRadius: 6,
                    position: "relative",
                    background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: `1px solid ${t.border}`,
                    opacity: 0.8,
                  }}
                >
                  <img
                    src={item.src}
                    alt={item.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "grayscale(20%)",
                    }}
                  />
                  <div
                    style={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      background: "rgba(0,0,0,0.6)",
                      borderRadius: 4,
                      width: 16,
                      height: 16,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.55rem",
                    }}
                  >
                    🗑️
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
