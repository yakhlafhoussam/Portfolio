/**
 * DevToolsEasterEgg.tsx
 *
 * Rendered as an overlay whenever the browser DevTools panel is detected.
 * Effects:
 *   1. Blood drips canvas animation covering the full screen.
 *   2. "I see you" typewriter text centred on the desktop.
 */

import { useEffect, useRef, useState } from "react"

// ─── Blood drip canvas ────────────────────────────────────────────────────────

interface Drip {
  x: number
  y: number
  speed: number
  length: number
  width: number
  opacity: number
  bulbRadius: number
}

function BloodCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const drips: Drip[] = []
    const MAX_DRIPS = 28

    const spawn = (): Drip => ({
      x: Math.random() * window.innerWidth,
      y: 0,
      speed: 0.4 + Math.random() * 1.2,
      length: 20 + Math.random() * 120,
      width: 2 + Math.random() * 6,
      opacity: 0.55 + Math.random() * 0.45,
      bulbRadius: 3 + Math.random() * 6,
    })

    // Seed initial drips at random heights so screen isn't empty at start
    for (let i = 0; i < MAX_DRIPS; i++) {
      const d = spawn()
      d.y = Math.random() * window.innerHeight * 0.6
      drips.push(d)
    }

    let animId: number
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const d of drips) {
        const gradient = ctx.createLinearGradient(d.x, d.y, d.x, d.y + d.length)
        gradient.addColorStop(0, `rgba(140,0,0,${d.opacity})`)
        gradient.addColorStop(1, `rgba(80,0,0,0)`)

        // Drip trail
        ctx.beginPath()
        ctx.moveTo(d.x, d.y)
        ctx.lineTo(d.x, d.y + d.length)
        ctx.strokeStyle = gradient
        ctx.lineWidth = d.width
        ctx.lineCap = "round"
        ctx.stroke()

        // Bulb at tip
        ctx.beginPath()
        ctx.arc(d.x, d.y + d.length, d.bulbRadius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(120,0,0,${d.opacity * 0.85})`
        ctx.fill()

        d.y += d.speed

        // Reset drip when it falls off screen
        if (d.y - d.length > canvas.height) {
          Object.assign(d, spawn())
        }
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  )
}

// ─── "I see you" typewriter ───────────────────────────────────────────────────

const MESSAGE = "I  s e e  y o u"

function ISeeYou() {
  const [displayed, setDisplayed] = useState("")
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Small delay before the text starts appearing
    const showTimer = window.setTimeout(() => setVisible(true), 400)
    return () => window.clearTimeout(showTimer)
  }, [])

  useEffect(() => {
    if (!visible) return
    let i = 0
    const id = window.setInterval(() => {
      i++
      setDisplayed(MESSAGE.slice(0, i))
      if (i >= MESSAGE.length) window.clearInterval(id)
    }, 90)
    return () => window.clearInterval(id)
  }, [visible])

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', 'Courier New', monospace",
          fontSize: "clamp(2rem, 5vw, 4.5rem)",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#cc0000",
          textShadow: `
            0 0 18px rgba(200,0,0,0.9),
            0 0 40px rgba(180,0,0,0.5),
            0 0 80px rgba(140,0,0,0.25)
          `,
          opacity: visible ? 1 : 0,
          transition: "opacity 500ms ease-in-out",
          userSelect: "none",
        }}
      >
        {displayed}
        {/* Blinking cursor while typing */}
        {displayed.length < MESSAGE.length && (
          <span
            style={{
              display: "inline-block",
              width: "0.06em",
              height: "1em",
              background: "#cc0000",
              marginLeft: 6,
              verticalAlign: "text-bottom",
              animation: "hyk-cursor-blink 0.7s steps(1) infinite",
            }}
          />
        )}
      </span>
      <style>{`
        @keyframes hyk-cursor-blink { 50% { opacity: 0; } }
      `}</style>
    </div>
  )
}

// ─── Full overlay ─────────────────────────────────────────────────────────────

export default function DevToolsEasterEgg() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <BloodCanvas />
      <ISeeYou />
    </div>
  )
}
