import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"
import blackCapImg from "@/assets/screenshots/trash/blackCap.png"

const TRASH_ITEMS = [
  {
    id: "blackcap",
    name: "blackCap.png",
    type: "image",
    src: blackCapImg,
    deletedAt: "Nov 21, 2025",
  },
]

export default function Trash() {
  const t = useTheme()
  const [lightbox, setLightbox] = useState<string | null>(null)

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: t.bg,
        color: t.text,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
        fontFamily: "'Inter', sans-serif",
        userSelect: "none",
        transition: t.transition,
        position: "relative",
      }}
    >
      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
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
            src={lightbox}
            alt="Preview"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: "100%",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 8,
              boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
              opacity: 0.85,
              filter: "grayscale(20%)",
            }}
          />
          <p
            style={{
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.78rem",
              marginTop: 14,
              fontFamily: "'JetBrains Mono', monospace",
            }}
          >
            Click anywhere to close
          </p>
        </div>
      )}

      {/* Toolbar */}
      <div
        style={{
          padding: "16px 24px 0",
          flexShrink: 0,
        }}
      >
        <h1
          style={{
            fontSize: "1.4rem",
            fontWeight: 600,
            margin: 0,
            color: t.text,
            transition: t.transition,
          }}
        >
          Trash
        </h1>
        <hr
          style={{
            border: "none",
            borderTop: "1px solid " + t.border,
            margin: "16px 0 0 0",
            transition: t.transition,
          }}
        />
        <div
          style={{
            padding: "8px 0",
            fontSize: "0.72rem",
            color: t.textFaint,
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {TRASH_ITEMS.length} item{TRASH_ITEMS.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Grid */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "8px 24px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
          gap: 14,
          alignContent: "start",
        }}
      >
        {TRASH_ITEMS.map((item) => (
          <div
            key={item.id}
            onClick={() => setLightbox(item.src)}
            style={{
              borderRadius: 8,
              overflow: "hidden",
              cursor: "pointer",
              background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
              border: "1px solid " + t.border,
              transition: "all 0.18s ease",
              opacity: 0.72,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.opacity = "1"
              el.style.transform = "scale(1.02)"
              el.style.borderColor = t.isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement
              el.style.opacity = "0.72"
              el.style.transform = "scale(1)"
              el.style.borderColor = t.border
            }}
          >
            {/* Thumbnail */}
            <div
              style={{
                width: "100%",
                height: 100,
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={item.src}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  filter: "grayscale(20%)",
                }}
              />
              {/* Deleted overlay badge */}
              <div
                style={{
                  position: "absolute",
                  top: 6,
                  right: 6,
                  background: "rgba(0,0,0,0.65)",
                  borderRadius: 4,
                  padding: "2px 5px",
                  fontSize: "0.58rem",
                  color: "rgba(255,255,255,0.6)",
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                🗑
              </div>
            </div>

            {/* Info */}
            <div
              style={{
                padding: "7px 10px 9px",
                borderTop: "1px solid " + t.border,
              }}
            >
              <div
                style={{
                  fontSize: "0.72rem",
                  fontWeight: 500,
                  color: t.text,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: 2,
                }}
              >
                {item.name}
              </div>
              <div
                style={{
                  fontSize: "0.64rem",
                  color: t.textFaint,
                  fontFamily: "'JetBrains Mono', monospace",
                }}
              >
                Deleted {item.deletedAt}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
