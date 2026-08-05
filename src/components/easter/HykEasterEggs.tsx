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
import { useTheme } from "@/context/ThemeContext"
import { useState } from "react"

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
        objectFit: "cover",
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
          fontSize: "2.6rem",
        }}
      >
        🚨
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
          }}
        >
          🚨 Someone tried to cheat the HYK system.
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
          fontSize: "1.8rem",
        }}
      >
        🚨
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
          }}
        >
          🚨 Someone tried to cheat the HYK system.
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
          fontSize: "2.6rem",
        }}
      >
        🧠
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
          By the way, bhala chaft chi virus kaydor hna...
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
          fontSize: "1.8rem",
        }}
      >
        🧠
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
          By the way, bhala chaft chi virus kaydor hna...
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
        }}
      >
        🚨 SECURITY ALERT
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
      heading: "What is a computer worm?",
      body: "A computer worm is a standalone malware program that replicates itself to spread to other systems. Unlike viruses, worms do not need a host file. They exploit network vulnerabilities to propagate automatically — silently, efficiently, and without your permission.",
    },
    {
      heading: "How worms spread",
      body: "Worms typically spread through email attachments, network shares, instant messaging links, and unpatched operating system vulnerabilities. Once inside, they can replicate thousands of copies of themselves within seconds. Some modern worms also monitor browser storage events.",
    },
    {
      heading: "Famous worms in history",
      body: "The Morris Worm (1988) was one of the first recognized internet worms, infecting roughly 6,000 machines. ILOVEYOU (2000) spread via email and caused an estimated $10 billion in damage. Stuxnet (2010) targeted industrial systems and is widely considered the first cyber weapon. And then there's HYK, which simply notices when you delete its LocalStorage.",
    },
    {
      heading: "How to protect your system",
      body: "Keep your OS and software up to date. Use a reputable antivirus program. Avoid clicking unknown links. Don't open suspicious attachments. And most importantly — do not delete LocalStorage entries that you don't fully understand. Some systems remember.",
    },
    {
      heading: "Why deleting LocalStorage won't fool HYK 😄",
      body: "When you delete the HYK_STORAGE key from localStorage, you might think the system forgets you. But HYK has already spoken to Firestore. Firestore doesn't forget. It's sitting quietly on a server somewhere, with your fingerprint, smiling. This article is its way of saying hello.",
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
          Bhala chaft chi virus kaydor hna... Khalli n3tik chi ma3lomat 3lih.
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
