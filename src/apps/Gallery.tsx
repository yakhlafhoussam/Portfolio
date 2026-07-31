import { useState, useEffect } from "react"
import { GALLERY_IMAGES } from "@/data"

type Props = {
  initialImageSrc?: string
}

export default function Gallery({ initialImageSrc }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const [customImage, setCustomImage] = useState<string | null>(initialImageSrc || null)

  // Sync state if initialImageSrc changes while the component is mounted
  useEffect(() => {
    if (initialImageSrc) {
      setCustomImage(initialImageSrc)
    }
  }, [initialImageSrc])

  const active = customImage
    ? { src: customImage, alt: "Preview", caption: "Project Preview" }
    : GALLERY_IMAGES.find(img => img.id === selected)

  const handleClose = () => {
    setSelected(null)
    setCustomImage(null)
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#181818",
        height: "100%",
        position: "relative",
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
          }}
        >
          <img
            src={active.src}
            alt={active.alt || "Preview"}
            onClick={e => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.45)",
              fontSize: "0.8rem",
              marginTop: 16,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            {active.caption}
          </p>
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
            Click anywhere to close
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div
        style={{
          height: 36,
          flexShrink: 0,
          background: "#222224",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 14,
          gap: 8,
          userSelect: "none",
        }}
      >
        <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace" }}>
          {GALLERY_IMAGES.length} items · Grid view
        </span>
      </div>

      {/* Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: 16,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 12,
          alignContent: "start",
        }}
      >
        {GALLERY_IMAGES.map(img => (
          <div
            key={img.id}
            onClick={() => setSelected(img.id)}
            style={{
              borderRadius: 6,
              overflow: "hidden",
              cursor: "zoom-in",
              position: "relative",
              background: "#2a2a2a",
              border: "1px solid rgba(255,255,255,0.06)",
              transition: "transform 0.15s, border-color 0.15s",
              userSelect: "none",
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = "scale(1.02)"
              el.style.borderColor = "rgba(74,222,128,0.3)"
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.transform = "scale(1)"
              el.style.borderColor = "rgba(255,255,255,0.06)"
            }}
          >
            <img
              src={img.src}
              alt={img.alt}
              style={{
                width: "100%",
                height: 140,
                objectFit: "cover",
                display: "block",
              }}
            />
            <div
              style={{
                padding: "7px 10px",
                color: "rgba(255,255,255,0.45)",
                fontSize: "0.72rem",
                fontFamily: "'JetBrains Mono', monospace",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {img.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
