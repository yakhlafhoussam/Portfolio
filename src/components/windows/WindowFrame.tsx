import { useState } from "react"
import { useTheme } from "../../context/ThemeContext"

type Props = {
  title: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
  maximized: boolean
  isFocused: boolean
  onClose: () => void
  onMinimize: () => void
  onMaximize: () => void
  onMove: (x: number, y: number) => void
  onFocus: () => void
  children: React.ReactNode
}

export default function WindowFrame({
  title,
  x,
  y,
  width,
  height,
  zIndex,
  minimized,
  maximized,
  isFocused,
  onClose,
  onMinimize,
  onMaximize,
  onMove,
  onFocus,
  children,
}: Props) {
  const t = useTheme()
  const [drag, setDrag] = useState<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const [hoverClose, setHoverClose] = useState(false)
  const [hoverMin, setHoverMin] = useState(false)
  const [hoverMax, setHoverMax] = useState(false)

  const handleTitleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || maximized) return
    e.preventDefault()
    e.currentTarget.setPointerCapture(e.pointerId)
    setDrag({ sx: e.clientX, sy: e.clientY, ox: x, oy: y })
    onFocus()
  }

  const handleTitleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return
    const nx = drag.ox + (e.clientX - drag.sx)
    const ny = drag.oy + (e.clientY - drag.sy)
    onMove(nx, Math.max(30, ny))
  }

  const handleTitleUp = () => setDrag(null)

  const pos = maximized
    ? { top: 30, left: 0, width: "100vw", height: "calc(100vh - 30px)", borderRadius: 0 }
    : { top: y, left: x, width, height, borderRadius: 10 }

  return (
    <div
      onPointerDown={onFocus}
      style={{
        position: "fixed",
        ...pos,
        zIndex,
        background:   t.windowBg,
        border:       `1px solid ${isFocused ? t.windowBorderFocused : t.windowBorder}`,
        boxShadow:    isFocused ? t.windowShadowFocused : t.windowShadow,
        display:      minimized ? "none" : "flex",
        flexDirection: "column",
        overflow:     "hidden",
        animation:    "windowOpen 0.18s ease",
        transition:   t.transition,
      }}
    >
      {/* Title bar */}
      <div
        onPointerDown={handleTitleDown}
        onPointerMove={handleTitleMove}
        onPointerUp={handleTitleUp}
        onDoubleClick={onMaximize}
        style={{
          height:       38,
          flexShrink:   0,
          background:   isFocused ? t.titleBarBgFocused : t.titleBarBg,
          borderBottom: `1px solid ${t.border}`,
          display:      "flex",
          alignItems:   "center",
          paddingLeft:  12,
          paddingRight: 12,
          cursor:       maximized ? "default" : drag ? "grabbing" : "grab",
          userSelect:   "none",
          transition:   t.transition,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 7, zIndex: 1 }}>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onClose() }}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            style={{
              width: 13, height: 13, borderRadius: "50%",
              background: "#ff5f57", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, color: "#7a0000",
              opacity: hoverClose ? 1 : 0.85,
              boxShadow: hoverClose ? "0 0 0 2px rgba(255,95,87,0.3)" : "none",
              transition: "box-shadow 0.12s, opacity 0.12s",
            }}
          >
            {hoverClose && "×"}
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMinimize() }}
            onMouseEnter={() => setHoverMin(true)}
            onMouseLeave={() => setHoverMin(false)}
            style={{
              width: 13, height: 13, borderRadius: "50%",
              background: "#ffbd2e", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, color: "#7a4800",
              opacity: hoverMin ? 1 : 0.85,
              boxShadow: hoverMin ? "0 0 0 2px rgba(255,189,46,0.3)" : "none",
              transition: "box-shadow 0.12s, opacity 0.12s",
            }}
          >
            {hoverMin && "−"}
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onMaximize() }}
            onMouseEnter={() => setHoverMax(true)}
            onMouseLeave={() => setHoverMax(false)}
            style={{
              width: 13, height: 13, borderRadius: "50%",
              background: "#28c840", border: "none", cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, color: "#005200",
              opacity: hoverMax ? 1 : 0.85,
              boxShadow: hoverMax ? "0 0 0 2px rgba(40,200,64,0.3)" : "none",
              transition: "box-shadow 0.12s, opacity 0.12s",
            }}
          >
            {hoverMax && "+"}
          </button>
        </div>

        {/* Title */}
        <span
          style={{
            flex: 1,
            textAlign: "center",
            color: isFocused ? t.titleTextFocused : t.titleText,
            fontSize: "0.78rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            pointerEvents: "none",
            transition: t.transition,
            marginRight: 53,
          }}
        >
          {title}
        </span>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  )
}
