import { useState, useCallback, useRef, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"
import { storageManager } from "@/lib/storage"
import { useHykExperience } from "@/hooks/useHykExperience"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { resolveHykArticleState } from "@/lib/hykArticleState"
import type { HykArticleState } from "@/lib/hykArticleState"
import {
  AlreadyViewedCard,
  AlreadyViewedListRow,
  LocalStorageCheatCard,
  LocalStorageCheatListRow,
  LocalStorageCheatArticle,
  LocalStorageDeletedCard,
  LocalStorageDeletedListRow,
  LocalStorageDeletedArticle,
  BypassSuccessCard,
  BypassSuccessListRow,
  BypassSuccessArticle,
  BypassFailCard,
  BypassFailListRow,
  BypassFailArticle,
} from "@/components/easter/HykEasterEggs"

// ─── Types ────────────────────────────────────────────────────────────────────

type NewsFeedEntry = {
  id: string
  title: string
  summary: string
  date: string
  category: string
  readingTime: string
  cover: string
  miniImage: string
  publishedAt?: string | null
  source?: "local" | "hyk"
}

type ContentBlock = { type: "paragraph" | "heading"; text: string }

type NewsArticle = NewsFeedEntry & {
  author: string
  content: ContentBlock[]
}

type PageState = "home" | "news" | "article" | "404"

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function getFingerprint(): Promise<string> {
  const fp = await FingerprintJS.load()
  const result = await fp.get()
  return result.visitorId
}

async function fetchLocalFeed(): Promise<NewsFeedEntry[]> {
  try {
    const r = await fetch("/content/news/feed.json")
    if (!r.ok) return []
    const data = await r.json()
    if (!Array.isArray(data)) return []
    return (data as NewsFeedEntry[]).map((e) => ({
      ...e,
      source: "local" as const,
    }))
  } catch {
    return []
  }
}

async function fetchHykFeed(
  fingerprint: string,
): Promise<{ entries: NewsFeedEntry[]; blocked: boolean }> {
  try {
    const r = await fetch("/api/news/hyk/feed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fingerprint }),
    })
    if (r.status === 403) {
      return { entries: [], blocked: true }
    }
    if (!r.ok) return { entries: [], blocked: false }
    const data = await r.json()
    if (!Array.isArray(data)) {
      console.error(
        "[Browser] /api/news/hyk/feed did not return an array:",
        data,
      )
      return { entries: [], blocked: false }
    }
    return {
      entries: (data as NewsFeedEntry[]).map((e) => ({
        ...e,
        source: "hyk" as const,
      })),
      blocked: false,
    }
  } catch {
    return { entries: [], blocked: false }
  }
}

async function loadFeed(): Promise<{
  entries: NewsFeedEntry[]
  hykBlocked: boolean
}> {
  const local = await fetchLocalFeed()
  try {
    const fingerprint = await getFingerprint()
    const { entries: hyk, blocked } = await fetchHykFeed(fingerprint)
    const sortedHyk = [...hyk].sort((a, b) => {
      const da = new Date(a.publishedAt ?? a.date).getTime()
      const db = new Date(b.publishedAt ?? b.date).getTime()
      return db - da
    })
    return { entries: [...local, ...sortedHyk], hykBlocked: blocked }
  } catch (err) {
    console.error("Failed to load news feed:", err)
    return { entries: local, hykBlocked: false }
  }
}

async function markArticleAsRead(articleId: string): Promise<boolean> {
  try {
    const fingerprint = await getFingerprint()
    const r = await fetch("/api/news/hyk/read", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fingerprint, articleId }),
    })
    if (r.ok) {
      const res = await r.json()
      return !!res.success
    }
  } catch (err) {
    console.error("Failed to mark article as read:", err)
  }
  return false
}

async function fetchArticle(entry: NewsFeedEntry): Promise<NewsArticle> {
  if (entry.source === "hyk") {
    const r = await fetch(`/api/news/hyk/${entry.id}`)
    if (!r.ok) throw new Error("article")
    return r.json()
  } else {
    const r = await fetch(`/content/news/${entry.id}/index.json`)
    if (!r.ok) throw new Error("article")
    return r.json()
  }
}

// ─── Shortcuts ────────────────────────────────────────────────────────────────

const SHORTCUTS = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/yakhlafhoussam",
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/houssam-yakhlaf",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:yakhlafhoussam@gmail.com",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 8l10 6 10-6" />
      </svg>
    ),
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    url: "https://wa.me/212615940605",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
      </svg>
    ),
  },
  {
    id: "discord",
    label: "Discord",
    url: "https://discord.com/users/houssam_yakhlaf",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 127.14 96.36"
        fill="currentColor"
      >
        <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C-3.66,42.48-1.93,76.06,8.7,95.91a106,106,0,0,0,32.22,16.29,80.06,80.06,0,0,0,6.77-11A68.86,68.86,0,0,1,37,95.34c1.1-.81,2.17-1.67,3.2-2.56a75.14,75.14,0,0,0,93.82,0c1,1,2.1,1.75,3.2,2.56a69,69,0,0,1-10.74,5.92,80.13,80.13,0,0,0,6.77,11,106,106,0,0,0,32.22-16.29C129.2,76.06,131,42.48,107.7,8.07ZM42.45,75.64c-6.3,0-11.48-5.78-11.48-12.83S36.08,50,42.45,50s11.53,5.78,11.48,12.83S48.75,75.64,42.45,75.64Zm42.24,0c-6.3,0-11.48-5.78-11.48-12.83S78.32,50,84.69,50s11.53,5.78,11.48,12.83S91,75.64,84.69,75.64Z" />
      </svg>
    ),
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar({
  page,
  onBack,
  onHome,
  urlBar,
  disableNavigation,
  t,
}: {
  page: PageState
  onBack: () => void
  onHome: () => void
  urlBar: string
  disableNavigation?: boolean
  t: ReturnType<typeof useTheme>
}) {
  return (
    <div
      style={{
        background: t.bgToolbar,
        borderBottom: "1px solid " + t.border,
        padding: "6px 12px",
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexShrink: 0,
        transition: t.transition,
      }}
    >
      <NavBtn
        onClick={onBack}
        disabled={page === "home" || disableNavigation}
        t={t}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M10 3L5 8l5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavBtn>
      <NavBtn onClick={() => {}} disabled t={t}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavBtn>
      <NavBtn onClick={onHome} disabled={disableNavigation} t={t}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            d="M13.5 2.5A7 7 0 102 8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M2 4v4h4"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </NavBtn>
      <div
        style={{
          flex: 1,
          background: t.bgInput,
          border: "1px solid " + t.border,
          borderRadius: 20,
          padding: "5px 14px",
          display: "flex",
          alignItems: "center",
          gap: 7,
          transition: t.transition,
        }}
      >
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <rect
            x="1"
            y="1"
            width="14"
            height="14"
            rx="3"
            stroke={t.textFaint}
            strokeWidth="1.5"
          />
          <path d="M5 8h6M8 5v6" stroke={t.textFaint} strokeWidth="1.2" />
        </svg>
        <span
          style={{
            color: t.textMuted,
            fontSize: "0.76rem",
            fontFamily: "'JetBrains Mono', monospace",
            transition: t.transition,
          }}
        >
          {urlBar}
        </span>
      </div>
    </div>
  )
}

function NavBtn({
  onClick,
  disabled,
  children,
  t,
}: {
  onClick: () => void
  disabled?: boolean
  children: React.ReactNode
  t: ReturnType<typeof useTheme>
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: "none",
        border: "none",
        borderRadius: 6,
        width: 28,
        height: 28,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: disabled ? "default" : "pointer",
        color: disabled ? t.textFaint : t.textMuted,
        transition: t.transition,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = t.bgHover
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = "none"
      }}
    >
      {children}
    </button>
  )
}

function ShortcutIcon({
  s,
  t,
}: {
  s: typeof SHORTCUTS[0]
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  const accent = t.isDark ? "rgba(74,222,128,0.12)" : "rgba(37,99,235,0.08)"
  const accentBorder = t.isDark
    ? "rgba(74,222,128,0.3)"
    : "rgba(37,99,235,0.25)"
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 7,
        cursor: "pointer",
        width: 72,
      }}
      onClick={() => window.open(s.url, "_blank", "noopener,noreferrer")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: hovered
            ? accent
            : t.isDark
              ? "rgba(255,255,255,0.04)"
              : "rgba(0,0,0,0.04)",
          border: "1px solid " + (hovered ? accentBorder : t.border),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: hovered
            ? t.isDark
              ? "rgba(74,222,128,1)"
              : "rgba(37,99,235,1)"
            : t.textMuted,
          transform: hovered ? "translateY(-2px)" : "none",
          transition: "all 180ms cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: hovered
            ? t.isDark
              ? "0 4px 12px rgba(74,222,128,0.12)"
              : "0 4px 12px rgba(37,99,235,0.08)"
            : "none",
        }}
      >
        {s.icon}
      </div>
      <span
        style={{
          fontSize: "0.68rem",
          color: t.textMuted,
          fontWeight: 500,
          transition: t.transition,
          textAlign: "center",
        }}
      >
        {s.label}
      </span>
    </div>
  )
}

function NewsCard({
  entry,
  onClick,
  t,
}: {
  entry: NewsFeedEntry
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  const accent = t.isDark ? "rgba(74,222,128,0.9)" : "rgba(37,99,235,0.9)"
  const accentBg = t.isDark ? "rgba(74,222,128,0.12)" : "rgba(37,99,235,0.06)"

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
              ? "rgba(74,222,128,0.22)"
              : "rgba(37,99,235,0.25)"
            : t.border),
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered
          ? t.isDark
            ? "0 8px 24px rgba(0,0,0,0.3)"
            : "0 8px 20px rgba(0,0,0,0.06)"
          : "none",
      }}
    >
      <div
        style={{
          width: "100%",
          height: 120,
          overflow: "hidden",
          background: t.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.03)",
        }}
      >
        <img
          src={entry.miniImage}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            transition: "transform 400ms ease",
            transform: hovered ? "scale(1.03)" : "scale(1)",
          }}
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = "none"
          }}
        />
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
            {entry.category}
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.64rem" }}>
            {entry.readingTime}
          </span>
        </div>
        <div
          style={{
            color: t.text,
            fontSize: "0.8rem",
            fontWeight: 600,
            lineHeight: 1.35,
            marginBottom: 5,
            transition: t.transition,
          }}
        >
          {entry.title}
        </div>
        <div
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            lineHeight: 1.4,
            transition: t.transition,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {entry.summary}
        </div>
        <div style={{ color: t.textFaint, fontSize: "0.65rem", marginTop: 8 }}>
          {entry.date}
        </div>
      </div>
    </div>
  )
}

function SponsoredCard({
  title,
  desc,
  tag,
  t,
}: {
  title: string
  desc: string
  tag: string
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 12,
        borderRadius: 8,
        background: t.isDark ? "#212124" : "#ffffff",
        border: "1px solid " + t.border,
        display: "flex",
        flexDirection: "column",
        gap: 6,
        boxShadow: hovered
          ? t.isDark
            ? "0 4px 12px rgba(0,0,0,0.2)"
            : "0 4px 12px rgba(0,0,0,0.04)"
          : "none",
        transition: "all 150ms ease",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: "0.55rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: t.textFaint,
          }}
        >
          Sponsored
        </span>
        <span
          style={{
            fontSize: "0.55rem",
            background: t.isDark
              ? "rgba(255,255,255,0.06)"
              : "rgba(0,0,0,0.05)",
            padding: "1px 5px",
            borderRadius: 3,
            color: t.textMuted,
          }}
        >
          {tag}
        </span>
      </div>
      <div
        style={{
          fontSize: "0.78rem",
          fontWeight: 600,
          color: t.text,
          lineHeight: 1.3,
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: "0.68rem", color: t.textMuted, lineHeight: 1.4 }}>
        {desc}
      </div>
      <div
        style={{
          marginTop: 4,
          textAlign: "center",
          fontSize: "0.7rem",
          fontWeight: 600,
          padding: "4px 8px",
          borderRadius: 4,
          background: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)",
          color: t.text,
        }}
      >
        Claim Offer
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Browser({
  registerCloseRequest,
}: {
  registerCloseRequest?: (callback: () => boolean) => void
}) {
  const t = useTheme()
  const [page, setPage] = useState<PageState>("home")
  const [urlBar, setUrlBar] = useState("hyk://new-tab")
  const [feed, setFeed] = useState<NewsFeedEntry[]>([])
  const [feedLoading, setFeedLoading] = useState(false)
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const [currentArticle, setCurrentArticle] = useState<NewsFeedEntry | null>(null)
  const [hykArticleState, setHykArticleState] = useState<HykArticleState>("normal")
  // "egg" page: the user opened an easter egg article (not a real article)
  const [eggPage, setEggPage] = useState<"cheat" | "deleted" | "bypass-success" | "bypass-fail" | null>(null)
  const searchRef = useRef<HTMLInputElement>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const browserWindowRef = useRef<HTMLDivElement | null>(null)
  const glitchLayersRef = useRef<HTMLDivElement | null>(null)
  const rgbLayersRef = useRef<HTMLDivElement | null>(null)
  const noiseCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const scanlinesRef = useRef<HTMLDivElement | null>(null)
  const screenFlashRef = useRef<HTMLDivElement | null>(null)

  const {
    showStarted,
    takeoverActive,
    countdownActive,
    startCountdown,
    resetCountdown,
    forceStartShow,
  } = useHykExperience()

  useEffect(() => {
    setFeedLoading(true)
    loadFeed()
      .then(({ entries, hykBlocked }) => {
        setFeed(entries)
        setHykArticleState(resolveHykArticleState(hykBlocked))
      })
      .catch(() => {})
      .finally(() => setFeedLoading(false))
  }, [])

  useEffect(() => {
    if (page === "home") setTimeout(() => searchRef.current?.focus(), 100)
  }, [page])

  useEffect(() => {
    registerCloseRequest?.(() => {
      return !countdownActive && !takeoverActive
    })
    return () => {
      registerCloseRequest?.(() => true)
    }
  }, [countdownActive, takeoverActive, registerCloseRequest])

  const guardNavigation = useCallback(
    (navigate: () => void | Promise<void>) => {
      if ((countdownActive || takeoverActive) && currentArticle?.source === "hyk") {
        forceStartShow()
        return
      }
      void navigate()
    },
    [countdownActive, takeoverActive, currentArticle, forceStartShow],
  )

  useEffect(() => {
    const stage = stageRef.current
    const windowEl = browserWindowRef.current
    const glitchLayers = glitchLayersRef.current
    const rgbLayers = rgbLayersRef.current
    const noiseCanvas = noiseCanvasRef.current
    const scanlines = scanlinesRef.current
    const screenFlash = screenFlashRef.current
    if (
      !stage ||
      !windowEl ||
      !glitchLayers ||
      !rgbLayers ||
      !noiseCanvas ||
      !scanlines ||
      !screenFlash
    ) {
      return
    }

    const timers: number[] = []
    let running = false
    let intensity = 0.18

    const rand = (min: number, max: number) => Math.random() * (max - min) + min
    const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1))
    const chance = (p: number) => Math.random() < p
    const pick = <T,>(arr: T[]) => arr[randInt(0, arr.length - 1)]
    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      timers.push(id)
      return id
    }

    const clearTimers = () => {
      timers.forEach((id) => window.clearTimeout(id))
      timers.length = 0
    }

    const clearGlitchState = () => {
      glitchLayers.innerHTML = ""
      rgbLayers.innerHTML = ""
      noiseCanvas.style.opacity = "0"
      scanlines.style.opacity = "0"
      screenFlash.style.opacity = "0"
      windowEl.style.filter = "none"
      stage.style.transform = ""
      stage.style.transition = ""
    }

    const sizeNoiseCanvas = () => {
      const scale = 0.35
      noiseCanvas.width = Math.max(64, Math.floor(window.innerWidth * scale))
      noiseCanvas.height = Math.max(64, Math.floor(window.innerHeight * scale))
    }

    const sliceGlitch = () => {
      const sliceCount = randInt(2, 5)
      for (let i = 0; i < sliceCount; i++) {
        const clone = windowEl.cloneNode(true) as HTMLElement
        clone.classList.add("glitch-clone")
        clone.removeAttribute("id")

        const bandTop = rand(0, 92)
        const bandHeight = rand(2, 16)
        const bandBottom = Math.max(0, 100 - bandTop - bandHeight)
        clone.style.clipPath = `inset(${bandTop}% 0 ${bandBottom}% 0)`

        const dir = chance(0.5) ? 1 : -1
        const dist = rand(6, 46) * dir
        const skew = rand(-3, 3)
        clone.style.transform = `translateX(${dist}px) skewX(${skew}deg)`
        if (chance(0.35)) {
          clone.style.filter = `hue-rotate(${randInt(-70, 70)}deg) saturate(${rand(1.4, 3)}) contrast(${rand(1, 1.6)})`
        }
        clone.style.opacity = String(rand(0.75, 1))

        glitchLayers.appendChild(clone)
        schedule(() => clone.remove(), rand(50, 160) * 10)
      }
    }

    const rgbSplit = () => {
      rgbLayers.innerHTML = ""
      const offset = rand(3, 16)
      const channels = [
        { id: "red-channel", dx: -offset, dy: rand(-3, 3) },
        { id: "green-channel", dx: rand(-2, 2), dy: rand(-2, 2) },
        { id: "blue-channel", dx: offset, dy: rand(-3, 3) },
      ]

      channels.forEach((ch) => {
        const clone = windowEl.cloneNode(true) as HTMLElement
        clone.classList.add("glitch-clone", "channel-clone")
        clone.removeAttribute("id")
        clone.style.filter = `url(#${ch.id})`
        clone.style.mixBlendMode = "screen"
        clone.style.transform = `translate(${ch.dx}px, ${ch.dy}px)`
        rgbLayers.appendChild(clone)
      })

      rgbLayers.style.opacity = "1"
      schedule(() => {
        rgbLayers.style.opacity = "0"
        schedule(() => {
          rgbLayers.innerHTML = ""
          rgbLayers.style.opacity = "0"
        }, 120)
      }, 150)
    }

    const windowJolt = () => {
      const jx = rand(-16, 16)
      const jy = rand(-10, 10)
      const sx = rand(0.9, 1.14)
      const sy = rand(0.88, 1.12)
      const skx = rand(-7, 7)
      const sky = rand(-2, 2)

      stage.style.transition = "transform 0.09s ease-out"
      stage.style.transform = `translate(${jx}px, ${jy}px) scale(${sx}, ${sy}) skewX(${skx}deg) skewY(${sky}deg)`
      schedule(() => {
        stage.style.transition = "transform 0.14s cubic-bezier(0.5, 1.5, 0.5, 1)"
        stage.style.transform = "translate(0, 0) scale(1, 1) skewX(0deg) skewY(0deg)"
      }, rand(90, 120))
    }

    const cornerStretch = () => {
      const origins = ["top left", "top right", "bottom left", "bottom right"]
      const origin = pick(origins)
      stage.style.transformOrigin = origin
      stage.style.transition = "transform 0.12s ease-out"
      stage.style.transform = `scaleX(${rand(1.04, 1.32)}) scaleY(${rand(0.82, 1.05)})`
      schedule(() => {
        stage.style.transition = "transform 0.16s ease-out"
        stage.style.transform = "scale(1, 1)"
        schedule(() => {
          stage.style.transformOrigin = "center center"
        }, 180)
      }, rand(50, 130))
    }

    const displaceWarp = () => {
      const turb = stage.querySelector<SVGElement>("#turbNoise")
      const filterEl = stage.querySelector<SVGElement>("#corrupt-displace feDisplacementMap")
      if (!turb || !filterEl) return

      windowEl.style.filter = "url(#corrupt-displace)"
      const scale = randInt(12, 55)
      turb.setAttribute("seed", String(randInt(1, 999)))
      filterEl.setAttribute("scale", String(scale))
      schedule(() => {
        filterEl.setAttribute("scale", "0")
        windowEl.style.filter = "none"
      }, 180)
    }

    const screenFlashFn = (black: boolean) => {
      screenFlash.style.background = black ? "#000" : "#fff"
      screenFlash.style.transition = "opacity 0.08s ease-in"
      screenFlash.style.opacity = black ? String(rand(0.7, 1)) : String(rand(0.18, 0.55))
      schedule(() => {
        screenFlash.style.opacity = "0"
      }, rand(30, 90))
    }

    const noiseBurst = () => {
      const w = noiseCanvas.width
      const h = noiseCanvas.height
      const imgData = noiseCanvas.getContext("2d")?.createImageData(w, h)
      if (!imgData) return
      const data = imgData.data
      for (let i = 0; i < data.length; i += 4) {
        const v = Math.random() * 255
        data[i] = v
        data[i + 1] = v
        data[i + 2] = v
        data[i + 3] = Math.random() * 90
      }
      noiseCanvas.getContext("2d")?.putImageData(imgData, 0, 0)
      noiseCanvas.style.transition = "opacity 0.2s ease-in"
      noiseCanvas.style.opacity = String(rand(0.18, 0.55))
      schedule(() => {
        noiseCanvas.style.opacity = "0"
      }, rand(70, 220))
    }

    const scanlineRoll = () => {
      scanlines.style.transition = "background-position 0.35s linear, opacity 0.4s ease"
      scanlines.style.backgroundPositionY = `${rand(220, 640)}px`
      scanlines.style.opacity = String(rand(0.35, 0.7))
      schedule(() => {
        scanlines.style.opacity = "0.12"
      }, rand(180, 400))
    }

    const updateIntensity = () => {
      intensity += rand(-0.16, 0.22)
      intensity = Math.min(1, Math.max(0.08, intensity))
    }

    const glitchTick = () => {
      if (!running) return
      updateIntensity()

      if (chance(0.55 + intensity * 0.3)) sliceGlitch()
      if (chance(0.28 + intensity * 0.3)) rgbSplit()
      if (chance(0.3 + intensity * 0.32)) windowJolt()
      if (chance(0.07 + intensity * 0.16)) cornerStretch()
      if (chance(0.1 + intensity * 0.18)) displaceWarp()
      if (chance(0.16 + intensity * 0.22)) noiseBurst()
      if (chance(0.12 + intensity * 0.18)) scanlineRoll()
      if (chance(0.035 + intensity * 0.08)) screenFlashFn(chance(0.5))

      const calm = chance(0.12)
      const base = calm ? rand(500, 1400) : rand(45, 420)
      const next = base / (0.5 + intensity)
      schedule(glitchTick, next)
    }

    const startCorruption = () => {
      running = true
      sizeNoiseCanvas()
      glitchTick()
    }

    if (takeoverActive) {
      startCorruption()
    }

    const handleResize = () => sizeNoiseCanvas()
    window.addEventListener("resize", handleResize)

    return () => {
      running = false
      clearTimers()
      clearGlitchState()
      window.removeEventListener("resize", handleResize)
    }
  }, [takeoverActive])

  const restoreLocalStorageAfterReading = useCallback(() => {
    storageManager.update({
      hyk: {
        viewed: true,
      },
    })
    try {
      window.localStorage.removeItem("hykViewed")
    } catch {}
  }, [])

  const eggPageRef = useRef<"cheat" | "deleted" | "bypass-success" | "bypass-fail" | null>(null)
  useEffect(() => {
    eggPageRef.current = eggPage
  }, [eggPage])

  useEffect(() => {
    return () => {
      if (eggPageRef.current !== null) {
        storageManager.update({
          hyk: {
            viewed: true,
          },
        })
        try {
          window.localStorage.removeItem("hykViewed")
        } catch {}
      }
    }
  }, [])

  const goHome = useCallback(() => {
    guardNavigation(() => {
      if (eggPage !== null) {
        restoreLocalStorageAfterReading()
      }
      setPage("home")
      setEggPage(null)
      setUrlBar("hyk://new-tab")
    })
  }, [guardNavigation, eggPage, restoreLocalStorageAfterReading])

  const goBack = useCallback(() => {
    guardNavigation(() => {
      if (eggPage !== null) {
        restoreLocalStorageAfterReading()
      }
      if (page === "article") {
        setPage("news")
        setEggPage(null)
        setUrlBar("news://hyk.internal/feed")
      } else {
        setPage("home")
        setEggPage(null)
        setUrlBar("hyk://new-tab")
      }
    })
  }, [page, guardNavigation, eggPage, restoreLocalStorageAfterReading])

  const openNews = useCallback(async () => {
    guardNavigation(() => {
      setPage("news")
      setUrlBar("news://hyk.internal/feed")
    })
  }, [guardNavigation])

  const openArticle = useCallback(
    async (entry: NewsFeedEntry) => {
      guardNavigation(async () => {
        setPage("article")
        setUrlBar(`news://hyk.internal/${entry.id}`)
        setCurrentArticle(entry)
        setArticle(null)
        setArticleLoading(true)
        if (entry.source === "hyk") {
          startCountdown()
        } else {
          resetCountdown()
        }

        try {
          const data = await fetchArticle(entry)
          setArticle({ ...data, source: entry.source })
          if (entry.source === "hyk") {
            markArticleAsRead(entry.id).then((success) => {
              if (success) {
                storageManager.update({
                  hyk: {
                    viewed: true,
                  },
                })
              }
            })
          }
        } catch {
          resetCountdown()
          setCurrentArticle(null)
          setPage("404")
        } finally {
          setArticleLoading(false)
        }
      })
    },
    [guardNavigation, resetCountdown, startCountdown],
  )

  const accent = t.isDark ? "rgba(74,222,128,1)" : "rgba(37,99,235,1)"
  const accentBg = t.isDark ? "rgba(74,222,128,0.1)" : "rgba(37,99,235,0.06)"

  return (
    <div
      ref={stageRef}
      className="browser"
      style={{
        position: "relative",
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      <div
        ref={browserWindowRef}
        id="browserWindow"
        className="browser-window"
        style={{
          position: "relative",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          background: t.bg,
          transition: t.transition,
        }}
      >
        <NavBar
          page={page}
          onBack={goBack}
          onHome={goHome}
          urlBar={urlBar}
          t={t}
        />

        <div style={{ flex: 1, overflowY: "auto" }}>
        {/* ── HOME ── */}
        {page === "home" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "40px 32px",
              minHeight: "100%",
              justifyContent: "space-between",
              boxSizing: "border-box",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 36,
                maxWidth: 860,
                margin: "0 auto",
                width: "100%",
              }}
            >
              {/* Search */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 14,
                  paddingTop: 10,
                }}
              >
                <div
                  style={{
                    fontSize: "1.45rem",
                    fontWeight: 700,
                    color: t.text,
                    letterSpacing: "-0.02em",
                    transition: t.transition,
                  }}
                >
                  Search the Web
                </div>
                <div
                  style={{
                    width: "100%",
                    maxWidth: 500,
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    background: t.isDark ? "#212124" : "#ffffff",
                    border: "1px solid " + t.border,
                    borderRadius: 28,
                    padding: "10px 18px",
                    boxShadow: t.isDark
                      ? "0 4px 16px rgba(0,0,0,0.3)"
                      : "0 4px 12px rgba(0,0,0,0.04)",
                    transition: t.transition,
                  }}
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={t.textFaint}
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                  </svg>
                  <input
                    ref={searchRef}
                    placeholder="Search the portfolio or the web..."
                    style={{
                      flex: 1,
                      background: "none",
                      border: "none",
                      outline: "none",
                      color: t.text,
                      fontSize: "0.85rem",
                      fontFamily: "inherit",
                    }}
                  />
                </div>
              </div>

              {/* Shortcuts */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 16,
                  flexWrap: "wrap",
                }}
              >
                {SHORTCUTS.map((s) => (
                  <ShortcutIcon key={s.id} s={s} t={t} />
                ))}
              </div>
            </div>

            {/* News Row (Footer aligned layout) */}
            <div
              style={{
                maxWidth: 1040,
                margin: "40px auto 0",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                gap: 12,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{
                    color: t.textMuted,
                    fontSize: "0.66rem",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    fontWeight: 700,
                  }}
                >
                  Latest News
                </div>
                <button
                  onClick={openNews}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: accent,
                    fontSize: "0.72rem",
                    fontWeight: 600,
                    padding: 0,
                  }}
                >
                  See all →
                </button>
              </div>

              {feedLoading ? (
                <div style={{ color: t.textFaint, fontSize: "0.8rem" }}>
                  Loading…
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    overflowX: "auto",
                    paddingBottom: 6,
                    scrollbarWidth: "none",
                  }}
                >
                  {feed.map((entry) => (
                    <NewsCard
                      key={entry.id}
                      entry={entry}
                      onClick={() => openArticle(entry)}
                      t={t}
                    />
                  ))}
                  {/* HYK easter egg card — shown when feed API blocked */}
                  {hykArticleState === "already-viewed" && (
                    <AlreadyViewedCard t={t} />
                  )}
                  {hykArticleState === "localstorage-cheat" && (
                    <LocalStorageCheatCard
                      t={t}
                      onClick={() => {
                        setPage("article")
                        setEggPage("cheat")
                        setUrlBar("news://hyk.internal/security-alert")
                      }}
                    />
                  )}
                  {hykArticleState === "localstorage-deleted" && (
                    <LocalStorageDeletedCard
                      t={t}
                      onClick={() => {
                        setPage("article")
                        setEggPage("deleted")
                        setUrlBar("news://hyk.internal/computer-worms")
                      }}
                    />
                  )}
                  {hykArticleState === "bypass-success" && (
                    <BypassSuccessCard
                      t={t}
                      onClick={() => {
                        setPage("article")
                        setEggPage("bypass-success")
                        setUrlBar("news://hyk.internal/bypass-success")
                      }}
                    />
                  )}
                  {hykArticleState === "bypass-fail" && (
                    <BypassFailCard
                      t={t}
                      onClick={() => {
                        setPage("article")
                        setEggPage("bypass-fail")
                        setUrlBar("news://hyk.internal/bypass-fail")
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── NEWS LIST ── */}
        {page === "news" && (
          <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto" }}>
            <div
              style={{
                color: t.textFaint,
                fontSize: "0.68rem",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                fontWeight: 700,
                marginBottom: 20,
              }}
            >
              HYK News Feed
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {feed.map((entry) => (
                <div
                  key={entry.id}
                  onClick={() => openArticle(entry)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px",
                    borderRadius: 8,
                    background: t.isDark ? "#212124" : "#ffffff",
                    border: "1px solid " + t.border,
                    cursor: "pointer",
                    transition: t.transition,
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = t.isDark
                      ? "rgba(74,222,128,0.25)"
                      : "rgba(37,99,235,0.25)"
                    el.style.transform = "translateX(2px)"
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement
                    el.style.borderColor = t.border
                    el.style.transform = "none"
                  }}
                >
                  <img
                    src={entry.miniImage}
                    alt=""
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 6,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = "none"
                    }}
                  />
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
                        {entry.category}
                      </span>
                      <span style={{ color: t.textFaint, fontSize: "0.66rem" }}>
                        {entry.date} · {entry.readingTime}
                      </span>
                    </div>
                    <div
                      style={{
                        color: t.text,
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        transition: t.transition,
                      }}
                    >
                      {entry.title}
                    </div>
                    <div
                      style={{
                        color: t.textMuted,
                        fontSize: "0.72rem",
                        marginTop: 2,
                        lineHeight: 1.4,
                        transition: t.transition,
                      }}
                    >
                      {entry.summary}
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
              ))}
              {/* HYK easter egg rows in the full news list */}
              {hykArticleState === "already-viewed" && (
                <AlreadyViewedListRow t={t} />
              )}
              {hykArticleState === "localstorage-cheat" && (
                <LocalStorageCheatListRow
                  t={t}
                  onClick={() => {
                    setPage("article")
                    setEggPage("cheat")
                    setUrlBar("news://hyk.internal/security-alert")
                  }}
                />
              )}
              {hykArticleState === "localstorage-deleted" && (
                <LocalStorageDeletedListRow
                  t={t}
                  onClick={() => {
                    setPage("article")
                    setEggPage("deleted")
                    setUrlBar("news://hyk.internal/computer-worms")
                  }}
                />
              )}
              {hykArticleState === "bypass-success" && (
                <BypassSuccessListRow
                  t={t}
                  onClick={() => {
                    setPage("article")
                    setEggPage("bypass-success")
                    setUrlBar("news://hyk.internal/bypass-success")
                  }}
                />
              )}
              {hykArticleState === "bypass-fail" && (
                <BypassFailListRow
                  t={t}
                  onClick={() => {
                    setPage("article")
                    setEggPage("bypass-fail")
                    setUrlBar("news://hyk.internal/bypass-fail")
                  }}
                />
              )}
            </div>
          </div>
        )}

        {/* ── ARTICLE READER ── */}
        {page === "article" && eggPage !== null && (
          <div style={{ padding: "32px", maxWidth: 1200, margin: "0 auto", boxSizing: "border-box" }}>
            <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
              {eggPage === "cheat" && <LocalStorageCheatArticle t={t} />}
              {eggPage === "deleted" && <LocalStorageDeletedArticle t={t} />}
              {eggPage === "bypass-success" && <BypassSuccessArticle t={t} />}
              {eggPage === "bypass-fail" && <BypassFailArticle t={t} />}
            </div>
          </div>
        )}
        {page === "article" && eggPage === null && (
          <div
            style={{
              padding: "32px",
              maxWidth: 1200,
              margin: "0 auto",
              boxSizing: "border-box",
            }}
          >
            {articleLoading || !article ? (
              <div
                style={{
                  color: t.textFaint,
                  fontSize: "0.8rem",
                  textAlign: "center",
                }}
              >
                Loading…
              </div>
            ) : (
              <div
                style={{ display: "flex", gap: 32, alignItems: "flex-start" }}
              >
                {/* Main Content Column */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {article.cover && (
                    <img
                      src={article.cover}
                      alt=""
                      style={{
                        width: "100%",
                        maxHeight: 340,
                        objectFit: "cover",
                        borderRadius: 12,
                        marginBottom: 24,
                        boxShadow: t.isDark
                          ? "0 4px 20px rgba(0,0,0,0.25)"
                          : "0 4px 16px rgba(0,0,0,0.06)",
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 12,
                    }}
                  >
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
                      {article.category}
                    </span>
                    <span
                      style={{
                        color: t.textFaint,
                        fontSize: "0.7rem",
                        fontWeight: 500,
                      }}
                    >
                      {article.date} · {article.readingTime}
                    </span>
                  </div>

                  <h1
                    style={{
                      color: t.text,
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      lineHeight: 1.25,
                      margin: "0 0 16px 0",
                      letterSpacing: "-0.02em",
                      transition: t.transition,
                    }}
                  >
                    {article.title}
                  </h1>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      marginBottom: 28,
                      paddingBottom: 16,
                      borderBottom: "1px solid " + t.border,
                    }}
                  >
                    <div
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: "50%",
                        background: t.isDark
                          ? "rgba(255,255,255,0.08)"
                          : "rgba(0,0,0,0.08)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        color: t.textMuted,
                      }}
                    >
                      {article.author.charAt(0)}
                    </div>
                    <span
                      style={{
                        fontSize: "0.74rem",
                        color: t.textMuted,
                        fontWeight: 500,
                      }}
                    >
                      By {article.author}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 16,
                    }}
                  >
                    {article.content.map((block, i) =>
                      block.type === "heading" ? (
                        <h2
                          key={i}
                          style={{
                            color: t.text,
                            fontSize: "1.1rem",
                            fontWeight: 700,
                            marginTop: 12,
                            marginBottom: 4,
                            transition: t.transition,
                          }}
                        >
                          {block.text}
                        </h2>
                      ) : (
                        <p
                          key={i}
                          style={{
                            color: t.textMuted,
                            fontSize: "0.88rem",
                            lineHeight: 1.68,
                            margin: 0,
                            transition: t.transition,
                          }}
                        >
                          {block.text}
                        </p>
                      ),
                    )}
                  </div>
                </div>

                {/* Decorative Right Sidebar (Ad Parody) - Visible only on Desktop screens */}
                <div
                  className="browser-ad-sidebar"
                  style={{
                    width: 260,
                    flexShrink: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: 16,
                  }}
                >
                  <style>{`
                    @media (max-width: 900px) {
                      .browser-ad-sidebar { display: none !important; }
                    }
                  `}</style>

                  <SponsoredCard
                    title="Spin the Wheel and Win an iPhone 17 Pro!"
                    desc="You have been randomly selected as our lucky visitor. Guaranteed prizes!"
                    tag="Win Big"
                    t={t}
                  />
                  <SponsoredCard
                    title="This One VS Code Extension Will Change Your Career"
                    desc="Senior engineers hate this secret tool. Learn how to write 10x code in seconds."
                    tag="Extension"
                    t={t}
                  />
                  <SponsoredCard
                    title="Top 10 AI Tools Developers Can't Stop Using"
                    desc="Build entire apps without writing a single line of logic. Number 7 will shock you."
                    tag="Trends"
                    t={t}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── 404 ── */}
        {page === "404" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 16,
              padding: 40,
            }}
          >
            <div
              style={{
                fontSize: "4rem",
                fontWeight: 700,
                color: t.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              404
            </div>
            <div style={{ color: t.textMuted, fontSize: "0.9rem" }}>
              Page not found.
            </div>
            <div
              style={{
                color: t.textFaint,
                fontSize: "0.75rem",
                fontFamily: "'JetBrains Mono', monospace",
              }}
            >
              This page was never published. Or perhaps it was.
            </div>
          </div>
        )}
      </div>
      </div>
      <div ref={glitchLayersRef} className="glitch-layers" />
      <div ref={rgbLayersRef} className="rgb-layers" />
      <canvas ref={noiseCanvasRef} className="noise-canvas" />
      <div ref={scanlinesRef} className="scanlines" />
      <div ref={screenFlashRef} className="screen-flash" />
      <svg className="svg-defs" width="0" height="0" aria-hidden="true">
        <defs>
          <filter id="red-channel" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
          </filter>
          <filter id="green-channel" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 0 1 0" />
          </filter>
          <filter id="blue-channel" colorInterpolationFilters="sRGB">
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 1 0" />
          </filter>
          <filter id="corrupt-displace" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              id="turbNoise"
              type="fractalNoise"
              baseFrequency="0.01 0.09"
              numOctaves="2"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
    </div>
  )
}
