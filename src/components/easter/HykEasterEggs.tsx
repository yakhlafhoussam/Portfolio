/**
 * HYK Easter Egg UI
 *
 * Three hidden joke scenarios rendered when HYK detects the user
 * has already watched the article and tried to cheat the system.
 *
 * Scenario 1 — "already-viewed"  : Ghost 404 card, does nothing.
 * Scenario 2 — "localstorage-cheat" : Security alert with laughing_1.mp4
 * Scenario 3 — "localstorage-deleted" : Moroccan sarcasm + fake worm article
 */

import laughing1 from "@/assets/videos/laughing_1.mp4"
import laughing2 from "@/assets/videos/laughing_2.mp4"
import laughing4 from "@/assets/videos/laughing_4.mp4"
import laughing5 from "@/assets/videos/laughing_5.mp4"
import { useTheme } from "@/context/ThemeContext"
import { useState } from "react"

// ─── Inline SVG Icons ─────────────────────────────────────────────────────────

function AlertShieldIcon({ size = 20, color = "#ef4444" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

function BrainIcon({ size = 20, color = "#fbbf24" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}>
      <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.44 2.5 2.5 0 0 1 0-3.12 3 3 0 0 1 0-4.88 2.5 2.5 0 0 1 0-3.12A2.5 2.5 0 0 1 9.5 2z" />
      <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.44 2.5 2.5 0 0 0 0-3.12 3 3 0 0 0 0-4.88 2.5 2.5 0 0 0 0-3.12A2.5 2.5 0 0 0 14.5 2z" />
    </svg>
  )
}

function UnlockIcon({ size = 20, color = "#22c55e" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
    </svg>
  )
}

function LockIcon({ size = 20, color = "#ef4444" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, display: "inline-block", verticalAlign: "middle" }}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}



// ─── Shared helpers ───────────────────────────────────────────────────────────

function EggVideo({ src }: { src: string }) {
  const t = useTheme()
  return (
    <video
      src={src}
      autoPlay
      loop
      muted={false}
      playsInline
      controls
      style={{
        width: "100%",
        maxHeight: 340,
        borderRadius: 12,
        marginBottom: 24,
        objectFit: "fill",
        boxShadow: t.isDark
          ? "0 4px 20px rgba(0,0,0,0.4)"
          : "0 4px 16px rgba(0,0,0,0.08)",
      }}
    />
  )
}

// ─── Scenario 1 — Ghost card (already viewed normally) ────────────────────────

export function AlreadyViewedCard({ t }: { t: ReturnType<typeof useTheme> }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 250,
        borderRadius: 10,
        overflow: "hidden",
        background: t.isDark ? "#1a1a1d" : "#f4f4f6",
        border: "1px solid " + (hovered ? t.border : t.border),
        cursor: "default",
        opacity: hovered ? 0.6 : 0.38,
        transition: "opacity 300ms ease",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: t.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "2.8rem",
            fontWeight: 700,
            color: t.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.07)",
            letterSpacing: "-0.04em",
          }}
        >
          404
        </span>
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: t.textFaint,
            marginBottom: 6,
          }}
        >
          Nothing here
        </div>
        <div
          style={{
            color: t.textFaint,
            fontSize: "0.8rem",
            fontWeight: 600,
            lineHeight: 1.35,
          }}
        >
          Nothing interesting here.
        </div>
        <div
          style={{
            color: t.textFaint,
            fontSize: "0.7rem",
            marginTop: 8,
            fontFamily: "'JetBrains Mono', monospace",
            opacity: 0.5,
          }}
        >
          You already know.
        </div>
      </div>
    </div>
  )
}

// Compact list-row version for the news feed page
export function AlreadyViewedListRow({ t }: { t: ReturnType<typeof useTheme> }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px",
        borderRadius: 8,
        background: t.isDark ? "#1a1a1d" : "#f4f4f6",
        border: "1px solid " + t.border,
        opacity: 0.38,
        cursor: "default",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 6,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.04)",
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: t.textFaint,
          }}
        >
          404
        </span>
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            color: t.textFaint,
            fontSize: "0.58rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          Nothing here
        </div>
        <div style={{ color: t.textFaint, fontSize: "0.82rem", fontWeight: 600 }}>
          Nothing interesting here.
        </div>
      </div>
    </div>
  )
}

// ─── Scenario 2 — LocalStorage cheat card ─────────────────────────────────────

export function LocalStorageCheatCard({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  const accent = "#ef4444"
  const accentBg = "rgba(239,68,68,0.1)"
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 250,
        borderRadius: 10,
        overflow: "hidden",
        background: t.isDark ? "#212124" : "#ffffff",
        border:
          "1px solid " +
          (hovered
            ? "rgba(239,68,68,0.4)"
            : t.isDark
              ? "rgba(239,68,68,0.18)"
              : "rgba(239,68,68,0.18)"),
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered ? "0 8px 24px rgba(239,68,68,0.12)" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(239,68,68,0.07)",
        }}
      >
        <AlertShieldIcon size={38} color={accent} />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              background: accentBg,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            Security Alert
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.64rem" }}>2 min read</span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.8rem",
            fontWeight: 600,
            lineHeight: 1.35,
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <AlertShieldIcon size={14} color={accent} />
          <span>Someone tried to cheat the HYK system.</span>
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          HYK noticed. And HYK remembers.
        </div>
        <div style={{ color: t.textFaint, fontSize: "0.65rem", marginTop: 8 }}>
          Just now
        </div>
      </div>
    </div>
  )
}

export function LocalStorageCheatListRow({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const accent = "#ef4444"
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px",
        borderRadius: 8,
        background: t.isDark ? "#212124" : "#ffffff",
        border: "1px solid rgba(239,68,68,0.22)",
        cursor: "pointer",
        transition: t.transition,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          "rgba(239,68,68,0.45)"
        ;(e.currentTarget as HTMLElement).style.transform = "translateX(2px)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          "rgba(239,68,68,0.22)"
        ;(e.currentTarget as HTMLElement).style.transform = "none"
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 6,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(239,68,68,0.07)",
        }}
      >
        <AlertShieldIcon size={26} color={accent} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            Security Alert
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.66rem" }}>
            Just now · 2 min read
          </span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <AlertShieldIcon size={14} color={accent} />
          <span>Someone tried to cheat the HYK system.</span>
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          HYK noticed. And HYK remembers.
        </div>
      </div>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke={t.textFaint}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

// ─── Scenario 3 — LocalStorage deleted card ────────────────────────────────────

export function LocalStorageDeletedCard({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  const accent = t.isDark ? "rgba(251,191,36,0.9)" : "rgba(180,120,0,0.9)"
  const accentBg = t.isDark
    ? "rgba(251,191,36,0.1)"
    : "rgba(180,120,0,0.08)"
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 250,
        borderRadius: 10,
        overflow: "hidden",
        background: t.isDark ? "#212124" : "#ffffff",
        border:
          "1px solid " +
          (hovered
            ? t.isDark
              ? "rgba(251,191,36,0.35)"
              : "rgba(180,120,0,0.3)"
            : t.isDark
              ? "rgba(251,191,36,0.16)"
              : "rgba(180,120,0,0.14)"),
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered
          ? t.isDark
            ? "0 8px 24px rgba(251,191,36,0.1)"
            : "0 8px 20px rgba(180,120,0,0.07)"
          : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: t.isDark
            ? "rgba(251,191,36,0.06)"
            : "rgba(180,120,0,0.05)",
        }}
      >
        <BrainIcon size={38} color={accent} />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              background: accentBg,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            Security
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.64rem" }}>5 min read</span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.8rem",
            fontWeight: 600,
            lineHeight: 1.35,
            marginBottom: 5,
          }}
        >
          Ach darti daba? Ghadi tzidna gha khadma...
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          By the way, bhala chaft chi doda katdor hna...
        </div>
        <div style={{ color: t.textFaint, fontSize: "0.65rem", marginTop: 8 }}>
          Just now
        </div>
      </div>
    </div>
  )
}

export function LocalStorageDeletedListRow({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const accent = t.isDark ? "rgba(251,191,36,0.9)" : "rgba(180,120,0,0.9)"
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px",
        borderRadius: 8,
        background: t.isDark ? "#212124" : "#ffffff",
        border:
          "1px solid " +
          (t.isDark ? "rgba(251,191,36,0.16)" : "rgba(180,120,0,0.14)"),
        cursor: "pointer",
        transition: t.transition,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = t.isDark
          ? "rgba(251,191,36,0.35)"
          : "rgba(180,120,0,0.3)"
        ;(e.currentTarget as HTMLElement).style.transform = "translateX(2px)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = t.isDark
          ? "rgba(251,191,36,0.16)"
          : "rgba(180,120,0,0.14)"
        ;(e.currentTarget as HTMLElement).style.transform = "none"
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 6,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: t.isDark
            ? "rgba(251,191,36,0.06)"
            : "rgba(180,120,0,0.05)",
        }}
      >
        <BrainIcon size={26} color={accent} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            Security
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.66rem" }}>
            Just now · 5 min read
          </span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.82rem",
            fontWeight: 600,
          }}
        >
          Ach darti daba? Ghadi tzidna gha khadma...
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          By the way, bhala chaft chi doda katdor hna...
        </div>
      </div>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke={t.textFaint}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

// ─── Article Bodies ───────────────────────────────────────────────────────────

export function LocalStorageCheatArticle({ t }: { t: ReturnType<typeof useTheme> }) {
  const accent = "#ef4444"
  const accentBg = "rgba(239,68,68,0.1)"
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            background: accentBg,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          Security Alert
        </span>
        <span style={{ color: t.textFaint, fontSize: "0.7rem", fontWeight: 500 }}>
          Just now · 2 min read
        </span>
      </div>

      <h1
        style={{
          color: t.text,
          fontSize: "1.75rem",
          fontWeight: 800,
          lineHeight: 1.25,
          margin: "0 0 24px 0",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <AlertShieldIcon size={28} color="#ef4444" />
        <span>SECURITY ALERT</span>
      </h1>

      <p style={{ color: t.textMuted, fontSize: "0.88rem", lineHeight: 1.68, margin: "0 0 16px 0" }}>
        Someone tried to cheat the HYK system.
      </p>

      <EggVideo src={laughing1} />

      <p
        style={{
          color: t.textMuted,
          fontSize: "1rem",
          lineHeight: 1.68,
          margin: "0 0 8px 0",
          fontStyle: "italic",
        }}
      >
        Nice try...
      </p>
      <p style={{ color: t.textMuted, fontSize: "0.88rem", lineHeight: 1.68, margin: "0 0 8px 0" }}>
        But this doesn't work with HYK.
      </p>
      <p style={{ fontSize: "1.4rem", margin: "0 0 24px 0" }}>😄</p>

      <p
        style={{
          color: t.textFaint,
          fontSize: "0.76rem",
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
          margin: 0,
        }}
      >
        hyk.internal — No vulnerabilities found. Better luck next time.
      </p>
    </div>
  )
}

export function LocalStorageDeletedArticle({ t }: { t: ReturnType<typeof useTheme> }) {
  const accent = t.isDark ? "rgba(251,191,36,0.9)" : "rgba(180,120,0,0.9)"
  const accentBg = t.isDark ? "rgba(251,191,36,0.1)" : "rgba(180,120,0,0.08)"

  const wormSections: { heading: string; body: string }[] = [
    {
      heading: "What is a Worm?",
      body: "A computer worm is a standalone malware program that replicates itself in order to spread to other computers. Unlike a standard virus, it doesn't need a host file or any human help to execute. It just wanders around networks on its own, exploiting vulnerabilities and replicating itself to consume bandwidth, like a digital parasite.",
    },
    {
      heading: "Why is it called a worm?",
      body: "The term was inspired by John Brunner's 1975 sci-fi novel 'The Shockwave Rider', which described a self-replicating tapeworm program crawling through a global network. Computer pioneers loved the analogy of code 'crawling' from host to host, so the name stuck. Honestly, 'worm' sounds way cooler than 'self-propagating software entity'.",
    },
    {
      heading: "Worm vs. Virus vs. Trojan: The Big Three",
      body: "Let's break down the differences: (1) A Virus is dependent—it needs to infect a host file and relies on human action (like opening a bad file) to spread. (2) A Worm is autonomous—it spreads by itself across networks without needing a host file or user action. (3) A Trojan is deceptive—it disguises itself as a legit program to trick you into running it, but doesn't replicate on its own. (4) HYK is playful—it won't delete your files, but it will definitely catch you if you try to wipe its LocalStorage.",
    },
  ]

  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      {/* Badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            background: accentBg,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          Security
        </span>
        <span style={{ color: t.textFaint, fontSize: "0.7rem", fontWeight: 500 }}>
          Just now · 5 min read
        </span>
      </div>

      <h1
        style={{
          color: t.text,
          fontSize: "1.75rem",
          fontWeight: 800,
          lineHeight: 1.25,
          margin: "0 0 8px 0",
          letterSpacing: "-0.02em",
        }}
      >
        Ach darti daba?
      </h1>
      <p
        style={{
          color: t.textMuted,
          fontSize: "1rem",
          lineHeight: 1.6,
          margin: "0 0 28px 0",
          fontStyle: "italic",
        }}
      >
        Ghadi tzidna gha khadma...
      </p>

      <EggVideo src={laughing2} />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 28,
          padding: "16px 20px",
          borderRadius: 10,
          background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
          border: "1px solid " + t.border,
        }}
      >
        <p style={{ color: t.textMuted, fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
          Walakin haniya...
        </p>
        <p style={{ color: t.textMuted, fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
          Machi mouchkil.
        </p>
        <p style={{ color: t.textMuted, fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>
          Mesali rasi hatta ana bach n3awed ngedha.
        </p>
        <p style={{ fontSize: "1.3rem", margin: 0 }}>🙂</p>
      </div>

      <div
        style={{
          borderTop: "1px solid " + t.border,
          paddingTop: 24,
          marginBottom: 24,
        }}
      >
        <p style={{ color: t.textMuted, fontSize: "0.88rem", lineHeight: 1.68, margin: "0 0 8px 0" }}>
          By the way...
        </p>
        <p style={{ color: t.textMuted, fontSize: "0.88rem", lineHeight: 1.68, margin: "0 0 24px 0" }}>
          B7al ila chft chi doda katdour hna... Khalli n3tik chi ma3lomat 3liha.
        </p>
      </div>

      {/* Fake serious security article */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {wormSections.map((s, i) => (
          <div key={i}>
            <h2
              style={{
                color: t.text,
                fontSize: "1.1rem",
                fontWeight: 700,
                margin: "0 0 8px 0",
              }}
            >
              {s.heading}
            </h2>
            <p
              style={{
                color: t.textMuted,
                fontSize: "0.88rem",
                lineHeight: 1.68,
                margin: 0,
              }}
            >
              {s.body}
            </p>
          </div>
        ))}
      </div>

      {/* Final challenge at the end of the Worm article */}
      <div
        style={{
          marginTop: 32,
          padding: "16px 20px",
          borderRadius: 10,
          background: t.isDark ? "rgba(239, 68, 68, 0.05)" : "rgba(239, 68, 68, 0.03)",
          border: "1px dashed rgba(239, 68, 68, 0.3)",
        }}
      >
        <h3
          style={{
            color: t.text,
            fontSize: "0.95rem",
            fontWeight: 700,
            margin: "0 0 8px 0",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <LockIcon size={14} color="#ef4444" />
          <span>The Ultimate Bypass Challenge</span>
        </h3>
        <p style={{ color: t.textMuted, fontSize: "0.84rem", lineHeight: 1.5, margin: "0 0 12px 0" }}>
          If you really want to bypass this security and prove your hacker skills...
        </p>
        <code
          style={{
            display: "block",
            background: t.isDark ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.05)",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: "0.8rem",
            fontFamily: "'JetBrains Mono', monospace",
            color: t.isDark ? "#f43f5e" : "#e11d48",
            marginBottom: 12,
          }}
        >
          localStorage.setItem("hykViewed", "HYK")
        </code>
        <p style={{ color: t.textMuted, fontSize: "0.84rem", lineHeight: 1.5, margin: 0 }}>
          Do this in your browser console, then <strong>refresh the page</strong>. Let's see if you can fool HYK.
        </p>
      </div>

      <p
        style={{
          color: t.textFaint,
          fontSize: "0.76rem",
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
          marginTop: 32,
        }}
      >
        hyk.internal/security — Article auto-generated for this session only.
      </p>
    </div>
  )
}

// ─── Case A — Bypass Success (HYK) ───────────────────────────────────────────

export function BypassSuccessCard({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  const accent = "#22c55e"
  const accentBg = "rgba(34,197,94,0.1)"
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 250,
        borderRadius: 10,
        overflow: "hidden",
        background: t.isDark ? "#212124" : "#ffffff",
        border:
          "1px solid " +
          (hovered
            ? "rgba(34,197,94,0.4)"
            : t.isDark
              ? "rgba(34,197,94,0.18)"
              : "rgba(34,197,94,0.18)"),
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered ? "0 8px 24px rgba(34,197,94,0.12)" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(34,197,94,0.07)",
        }}
      >
        <UnlockIcon size={38} color={accent} />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              background: accentBg,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            System Unlocked
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.64rem" }}>1 min read</span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.8rem",
            fontWeight: 600,
            lineHeight: 1.35,
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <UnlockIcon size={14} color={accent} />
          <span>Security Bypass: Success</span>
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          You successfully bypassed the security alert. Or did you?
        </div>
        <div style={{ color: t.textFaint, fontSize: "0.65rem", marginTop: 8 }}>
          Just now
        </div>
      </div>
    </div>
  )
}

export function BypassSuccessListRow({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const accent = "#22c55e"
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px",
        borderRadius: 8,
        background: t.isDark ? "#212124" : "#ffffff",
        border: "1px solid rgba(34,197,94,0.22)",
        cursor: "pointer",
        transition: t.transition,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          "rgba(34,197,94,0.45)"
        ;(e.currentTarget as HTMLElement).style.transform = "translateX(2px)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          "rgba(34,197,94,0.22)"
        ;(e.currentTarget as HTMLElement).style.transform = "none"
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 6,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(34,197,94,0.07)",
        }}
      >
        <UnlockIcon size={26} color={accent} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            System Unlocked
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.66rem" }}>
            Just now · 1 min read
          </span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <UnlockIcon size={14} color={accent} />
          <span>Security Bypass: Success</span>
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          You successfully bypassed the security alert. Or did you?
        </div>
      </div>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke={t.textFaint}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function BypassSuccessArticle({ t }: { t: ReturnType<typeof useTheme> }) {
  const accent = "#22c55e"
  const accentBg = "rgba(34,197,94,0.1)"
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            background: accentBg,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          System Unlocked
        </span>
        <span style={{ color: t.textFaint, fontSize: "0.7rem", fontWeight: 500 }}>
          Just now · 1 min read
        </span>
      </div>

      <h1
        style={{
          color: t.text,
          fontSize: "1.75rem",
          fontWeight: 800,
          lineHeight: 1.25,
          margin: "0 0 24px 0",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <UnlockIcon size={28} color="#22c55e" />
        <span>SECURITY BYPASS: SUCCESS</span>
      </h1>

      <p style={{ color: t.text, fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.6, margin: "0 0 16px 0" }}>
        I can't believe you actually trusted me 😂
      </p>

      <EggVideo src={laughing4} />

      <p style={{ color: t.textMuted, fontSize: "0.95rem", lineHeight: 1.68, margin: "0 0 16px 0" }}>
        Congratulations...
      </p>

      <p style={{ color: t.textMuted, fontSize: "0.95rem", lineHeight: 1.68, margin: "0 0 24px 0" }}>
        You followed instructions from an article written by the same system that trapped you.
      </p>

      <div
        style={{
          padding: "16px 20px",
          borderRadius: 10,
          background: t.isDark ? "rgba(34,197,94,0.05)" : "rgba(34,197,94,0.03)",
          border: "1px solid rgba(34,197,94,0.3)",
          marginBottom: 24,
        }}
      >
        <p style={{ color: t.textMuted, fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>
          Hats off to your persistence though! Playful curiosity is what makes development fun.
        </p>
      </div>

      <p
        style={{
          color: t.textFaint,
          fontSize: "0.76rem",
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
          margin: 0,
        }}
      >
        hyk.internal/bypass — Session completed. Have a wonderful day!
      </p>
    </div>
  )
}

// ─── Case B — Bypass Fail (hyk) ──────────────────────────────────────────────

export function BypassFailCard({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  const accent = "#f59e0b"
  const accentBg = "rgba(245,158,11,0.1)"
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 250,
        borderRadius: 10,
        overflow: "hidden",
        background: t.isDark ? "#212124" : "#ffffff",
        border:
          "1px solid " +
          (hovered
            ? "rgba(245,158,11,0.4)"
            : t.isDark
              ? "rgba(245,158,11,0.18)"
              : "rgba(245,158,11,0.18)"),
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered ? "0 8px 24px rgba(245,158,11,0.12)" : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(245,158,11,0.07)",
        }}
      >
        <LockIcon size={38} color={accent} />
      </div>
      <div style={{ padding: "10px 12px 12px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
              background: accentBg,
              padding: "2px 6px",
              borderRadius: 4,
            }}
          >
            Bypass Blocked
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.64rem" }}>1 min read</span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.8rem",
            fontWeight: 600,
            lineHeight: 1.35,
            marginBottom: 5,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <LockIcon size={14} color={accent} />
          <span>Security Bypass: Failed</span>
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            lineHeight: 1.4,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          You tried to bypass security but something went wrong. Click to inspect error.
        </div>
        <div style={{ color: t.textFaint, fontSize: "0.65rem", marginTop: 8 }}>
          Just now
        </div>
      </div>
    </div>
  )
}

export function BypassFailListRow({
  onClick,
  t,
}: {
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const accent = "#f59e0b"
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "12px",
        borderRadius: 8,
        background: t.isDark ? "#212124" : "#ffffff",
        border: "1px solid rgba(245,158,11,0.22)",
        cursor: "pointer",
        transition: t.transition,
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          "rgba(245,158,11,0.45)"
        ;(e.currentTarget as HTMLElement).style.transform = "translateX(2px)"
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor =
          "rgba(245,158,11,0.22)"
        ;(e.currentTarget as HTMLElement).style.transform = "none"
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 6,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(245,158,11,0.07)",
        }}
      >
        <LockIcon size={26} color={accent} />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              fontSize: "0.58rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: accent,
            }}
          >
            Bypass Blocked
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.66rem" }}>
            Just now · 1 min read
          </span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.82rem",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <LockIcon size={14} color={accent} />
          <span>Security Bypass: Failed</span>
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            marginTop: 2,
            lineHeight: 1.4,
          }}
        >
          You tried to bypass security but something went wrong. Click to inspect error.
        </div>
      </div>
      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
        <path
          d="M3 8h10M9 4l4 4-4 4"
          stroke={t.textFaint}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export function BypassFailArticle({ t }: { t: ReturnType<typeof useTheme> }) {
  const accent = "#f59e0b"
  const accentBg = "rgba(245,158,11,0.1)"
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <span
          style={{
            fontSize: "0.62rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: accent,
            background: accentBg,
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          Bypass Blocked
        </span>
        <span style={{ color: t.textFaint, fontSize: "0.7rem", fontWeight: 500 }}>
          Just now · 1 min read
        </span>
      </div>

      <h1
        style={{
          color: t.text,
          fontSize: "1.75rem",
          fontWeight: 800,
          lineHeight: 1.25,
          margin: "0 0 24px 0",
          letterSpacing: "-0.02em",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <LockIcon size={28} color="#f59e0b" />
        <span>SECURITY BYPASS: FAILED</span>
      </h1>

      <p style={{ color: t.text, fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.6, margin: "0 0 16px 0" }}>
        I said HYK... not hyk 😅
      </p>

      <EggVideo src={laughing5} />

      <p style={{ color: t.textMuted, fontSize: "0.95rem", lineHeight: 1.68, margin: "0 0 16px 0" }}>
        Almost got it!
      </p>

      <p style={{ color: t.textMuted, fontSize: "0.95rem", lineHeight: 1.68, margin: "0 0 24px 0" }}>
        But the check is case-sensitive. "HYK" must be completely in uppercase. Try changing the localStorage value to all-caps and refreshing!
      </p>

      <p
        style={{
          color: t.textFaint,
          fontSize: "0.76rem",
          lineHeight: 1.6,
          fontFamily: "'JetBrains Mono', monospace",
          margin: 0,
        }}
      >
        hyk.internal/bypass — Error code: CaseSensitivityMismatch.
      </p>
    </div>
  )
}

