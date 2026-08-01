import { useState } from "react"

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
  const [drag, setDrag] = useState<{ sx: number; sy: number; ox: number; oy: number } | null>(null)
  const [hoverClose, setHoverClose] = useState(false)
  const [hoverMin, setHoverMin] = useState(false)
  const [hoverMax, setHoverMax] = useState(false)

  if (minimized) return null

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
        background: "#222225",
        border: isFocused ? "1px solid rgba(74, 222, 128, 0.28)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: isFocused
          ? "0 28px 72px rgba(0,0,0,0.85), 0 0 16px rgba(74,222,128,0.06)"
          : "0 24px 64px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "windowOpen 0.18s ease",
        transition: "border-color 0.15s ease, box-shadow 0.15s ease",
      }}
    >
      {/* Title bar */}
      <div
        onPointerDown={handleTitleDown}
        onPointerMove={handleTitleMove}
        onPointerUp={handleTitleUp}
        onDoubleClick={onMaximize}
        style={{
          height: 38,
          flexShrink: 0,
          background: isFocused ? "#2c2c2f" : "#232326",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          cursor: maximized ? "default" : drag ? "grabbing" : "grab",
          userSelect: "none",
          transition: "background 0.15s ease",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 7, zIndex: 1 }}>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation()
              onClose()
            }}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#ff5f57",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              color: "#7a0000",
              opacity: hoverClose ? 1 : 0.85,
              boxShadow: hoverClose ? "0 0 0 2px rgba(255,95,87,0.3)" : "none",
              transition: "box-shadow 0.12s, opacity 0.12s",
            }}
          >
            {hoverClose && "×"}
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation()
              onMinimize()
            }}
            onMouseEnter={() => setHoverMin(true)}
            onMouseLeave={() => setHoverMin(false)}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#ffbd2e",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              color: "#7a4800",
              opacity: hoverMin ? 1 : 0.85,
              boxShadow: hoverMin ? "0 0 0 2px rgba(255,189,46,0.3)" : "none",
              transition: "box-shadow 0.12s, opacity 0.12s",
            }}
          >
            {hoverMin && "−"}
          </button>
          <button
            onPointerDown={e => e.stopPropagation()}
            onClick={e => {
              e.stopPropagation()
              onMaximize()
            }}
            onMouseEnter={() => setHoverMax(true)}
            onMouseLeave={() => setHoverMax(false)}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#28c840",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              color: "#005200",
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
            color: isFocused ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)",
            fontSize: "0.78rem",
            fontWeight: 500,
            letterSpacing: "0.01em",
            pointerEvents: "none",
            transition: "color 0.15s ease",
            marginRight: 53, // Offset traffic lights to center title perfectly
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
