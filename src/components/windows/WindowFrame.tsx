import { useState, useCallback } from "react"
import { useTheme } from "../../context/ThemeContext"
import { WORKSPACE_INSETS } from "../desktop/Desktop"

const MIN_WIDTH = 320
const MIN_HEIGHT = 200

type ResizeDir =
  | "n" | "s" | "e" | "w"
  | "ne" | "nw" | "se" | "sw"

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
  onResize: (x: number, y: number, width: number, height: number) => void
  onFocus: () => void
  closeDisabled?: boolean
  children: React.ReactNode
}

// ─── Resize handle style helper ────────────────────────────────────────────────
function handleStyle(dir: ResizeDir): React.CSSProperties {
  const base: React.CSSProperties = {
    position: "absolute",
    zIndex: 10,
  }

  const edgeSize = 6
  const cornerSize = 14

  switch (dir) {
    case "n":  return { ...base, top: 0, left: cornerSize, right: cornerSize, height: edgeSize, cursor: "n-resize" }
    case "s":  return { ...base, bottom: 0, left: cornerSize, right: cornerSize, height: edgeSize, cursor: "s-resize" }
    case "e":  return { ...base, right: 0, top: cornerSize, bottom: cornerSize, width: edgeSize, cursor: "e-resize" }
    case "w":  return { ...base, left: 0, top: cornerSize, bottom: cornerSize, width: edgeSize, cursor: "w-resize" }
    case "ne": return { ...base, top: 0, right: 0, width: cornerSize, height: cornerSize, cursor: "ne-resize" }
    case "nw": return { ...base, top: 0, left: 0, width: cornerSize, height: cornerSize, cursor: "nw-resize" }
    case "se": return { ...base, bottom: 0, right: 0, width: cornerSize, height: cornerSize, cursor: "se-resize" }
    case "sw": return { ...base, bottom: 0, left: 0, width: cornerSize, height: cornerSize, cursor: "sw-resize" }
  }
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
  onResize,
  onFocus,
  closeDisabled = false,
  children,
}: Props) {
  const t = useTheme()

  // ── Drag state ──────────────────────────────────────────────────────────────
  const [drag, setDrag] = useState<{
    sx: number
    sy: number
    ox: number
    oy: number
  } | null>(null)

  // ── Resize state ────────────────────────────────────────────────────────────
  const [resize, setResize] = useState<{
    dir: ResizeDir
    sx: number
    sy: number
    ox: number
    oy: number
    ow: number
    oh: number
  } | null>(null)

  const [hoverClose, setHoverClose] = useState(false)
  const [hoverMin, setHoverMin] = useState(false)
  const [hoverMax, setHoverMax] = useState(false)

  // ── Title bar drag ──────────────────────────────────────────────────────────
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
    onMove(nx, Math.max(WORKSPACE_INSETS.top, ny))
  }

  const handleTitleUp = () => setDrag(null)

  // ── Resize handle ───────────────────────────────────────────────────────────
  const handleResizeDown = useCallback(
    (dir: ResizeDir) => (e: React.PointerEvent<HTMLDivElement>) => {
      if (maximized) return
      e.stopPropagation()
      e.preventDefault()
      e.currentTarget.setPointerCapture(e.pointerId)
      onFocus()
      setResize({ dir, sx: e.clientX, sy: e.clientY, ox: x, oy: y, ow: width, oh: height })
    },
    [maximized, x, y, width, height, onFocus],
  )

  const handleResizeMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!resize) return
      const dx = e.clientX - resize.sx
      const dy = e.clientY - resize.sy
      const { dir, ox, oy, ow, oh } = resize

      let nx = ox, ny = oy, nw = ow, nh = oh

      // Horizontal
      if (dir.includes("e")) { nw = Math.max(MIN_WIDTH, ow + dx) }
      if (dir.includes("w")) { nw = Math.max(MIN_WIDTH, ow - dx); nx = ox + ow - nw }
      // Vertical
      if (dir.includes("s")) { nh = Math.max(MIN_HEIGHT, oh + dy) }
      if (dir.includes("n")) {
        nh = Math.max(MIN_HEIGHT, oh - dy)
        ny = Math.max(WORKSPACE_INSETS.top, oy + oh - nh)
      }

      onResize(nx, ny, nw, nh)
    },
    [resize, onResize],
  )

  const handleResizeUp = useCallback(() => setResize(null), [])

  const pos = maximized
    ? {
        top: WORKSPACE_INSETS.top,
        left: WORKSPACE_INSETS.left,
        width: `calc(100vw - ${WORKSPACE_INSETS.left + WORKSPACE_INSETS.right}px)`,
        height: `calc(100vh - ${WORKSPACE_INSETS.top + WORKSPACE_INSETS.bottom}px)`,
        borderRadius: 10,
      }
    : { top: y, left: x, width, height, borderRadius: 10 }

  const RESIZE_DIRS: ResizeDir[] = ["n", "s", "e", "w", "ne", "nw", "se", "sw"]

  return (
    <div
      onPointerDown={onFocus}
      onPointerMove={resize ? handleResizeMove : undefined}
      onPointerUp={resize ? handleResizeUp : undefined}
      style={{
        position: "fixed",
        ...pos,
        zIndex,
        background: t.windowBg,
        border: `1px solid ${
          isFocused ? t.windowBorderFocused : t.windowBorder
        }`,
        boxShadow: isFocused ? t.windowShadowFocused : t.windowShadow,
        display: minimized ? "none" : "flex",
        flexDirection: "column",
        overflow: "hidden",
        animation: "windowOpen 0.18s ease",
        transition: resize ? "none" : t.transition,
      }}
    >
      {/* Resize handles — only shown when not maximized */}
      {!maximized && RESIZE_DIRS.map((dir) => (
        <div
          key={dir}
          style={handleStyle(dir)}
          onPointerDown={handleResizeDown(dir)}
          onPointerMove={handleResizeMove}
          onPointerUp={handleResizeUp}
        />
      ))}

      {/* Title bar */}
      <div
        onPointerDown={handleTitleDown}
        onPointerMove={handleTitleMove}
        onPointerUp={handleTitleUp}
        onDoubleClick={onMaximize}
        style={{
          height: 38,
          flexShrink: 0,
          background: isFocused ? t.titleBarBgFocused : t.titleBarBg,
          borderBottom: `1px solid ${t.border}`,
          display: "flex",
          alignItems: "center",
          paddingLeft: 12,
          paddingRight: 12,
          cursor: maximized ? "default" : drag ? "grabbing" : "grab",
          userSelect: "none",
          transition: t.transition,
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 7, zIndex: 1 }}>
          <button
            disabled={closeDisabled}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation()
              if (!closeDisabled) onClose()
            }}
            onMouseEnter={() => setHoverClose(true)}
            onMouseLeave={() => setHoverClose(false)}
            style={{
              width: 13,
              height: 13,
              borderRadius: "50%",
              background: "#ff5f57",
              border: "none",
              cursor: closeDisabled ? "default" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 8,
              color: "#7a0000",
              opacity: closeDisabled ? 0.45 : hoverClose ? 1 : 0.85,
              boxShadow: closeDisabled
                ? "none"
                : hoverClose
                ? "0 0 0 2px rgba(255,95,87,0.3)"
                : "none",
              transition: "box-shadow 0.12s, opacity 0.12s",
            }}
          >
            {hoverClose && !closeDisabled && "×"}
          </button>
          <button
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
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
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => {
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
      <div
        style={{
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  )
}
