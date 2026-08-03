import { useState, useCallback, useRef, useEffect } from "react"
import { useTheme } from "@/context/ThemeContext"

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
}

type ContentBlock = { type: "paragraph" | "heading"; text: string }

type NewsArticle = NewsFeedEntry & {
  author: string
  content: ContentBlock[]
}

type PageState = "home" | "news" | "article" | "404"

// ─── Fetch helpers (swap URL for /api/news later) ─────────────────────────────

async function fetchFeed(): Promise<NewsFeedEntry[]> {
  const r = await fetch("/content/news/feed.json")
  if (!r.ok) throw new Error("feed")
  return r.json()
}

async function fetchArticle(id: string): Promise<NewsArticle> {
  const r = await fetch(`/content/news/${id}/index.json`)
  if (!r.ok) throw new Error("article")
  return r.json()
}

// ─── Shortcut data ────────────────────────────────────────────────────────────

const SHORTCUTS = [
  {
    id: "github", label: "GitHub", url: "https://github.com/yakhlafhoussam",
    icon: (
      <svg width="22" height="22" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    )
  },
  {
    id: "linkedin", label: "LinkedIn", url: "https://linkedin.com/in/houssam-yakhlaf",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    )
  },
  {
    id: "email", label: "Email", url: "mailto:yakhlafhoussam@gmail.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2"/>
        <path d="M2 8l10 6 10-6"/>
      </svg>
    )
  },
  {
    id: "resume", label: "Resume", url: "#",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="12" y1="18" x2="12" y2="12"/>
        <polyline points="9 15 12 18 15 15"/>
      </svg>
    )
  },
  {
    id: "projects", label: "Projects", url: "#",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"/>
        <polyline points="8 6 2 12 8 18"/>
      </svg>
    )
  },
  {
    id: "gallery", label: "Gallery", url: "#",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    )
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function NavBar({ page, onBack, onHome, urlBar, t }: {
  page: PageState
  onBack: () => void
  onHome: () => void
  urlBar: string
  t: ReturnType<typeof useTheme>
}) {
  const accent = t.isDark ? "rgba(74,222,128,1)" : "rgba(37,99,235,1)"
  return (
    <div style={{
      background: t.bgToolbar,
      borderBottom: "1px solid " + t.border,
      padding: "7px 12px",
      display: "flex",
      alignItems: "center",
      gap: 6,
      flexShrink: 0,
      transition: t.transition,
    }}>
      {/* Back */}
      <NavBtn onClick={onBack} disabled={page === "home"} t={t}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </NavBtn>
      {/* Forward (decorative) */}
      <NavBtn onClick={() => {}} disabled t={t}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </NavBtn>
      {/* Refresh */}
      <NavBtn onClick={onHome} t={t}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M13.5 2.5A7 7 0 102 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
          <path d="M2 4v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </NavBtn>
      {/* Address bar */}
      <div style={{
        flex: 1,
        background: t.bgInput,
        border: "1px solid " + t.border,
        borderRadius: 20,
        padding: "5px 14px",
        display: "flex",
        alignItems: "center",
        gap: 7,
        transition: t.transition,
      }}>
        <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
          <rect x="1" y="1" width="14" height="14" rx="3" stroke={t.textFaint} strokeWidth="1.5"/>
          <path d="M5 8h6M8 5v6" stroke={t.textFaint} strokeWidth="1.2"/>
        </svg>
        <span style={{ color: t.textMuted, fontSize: "0.76rem", fontFamily: "'JetBrains Mono', monospace", transition: t.transition }}>
          {urlBar}
        </span>
      </div>
    </div>
  )
}

function NavBtn({ onClick, disabled, children, t }: {
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
    >
      {children}
    </button>
  )
}

function ShortcutIcon({ s, t }: { s: typeof SHORTCUTS[0]; t: ReturnType<typeof useTheme> }) {
  const [hovered, setHovered] = useState(false)
  const accent = t.isDark ? "rgba(74,222,128,0.12)" : "rgba(37,99,235,0.1)"
  const accentBorder = t.isDark ? "rgba(74,222,128,0.3)" : "rgba(37,99,235,0.3)"
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, cursor: "pointer" }}
      onClick={() => { if (s.url !== "#") window.open(s.url, "_blank", "noopener,noreferrer") }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: hovered ? accent : (t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)"),
        border: "1px solid " + (hovered ? accentBorder : t.border),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? (t.isDark ? "rgba(74,222,128,1)" : "rgba(37,99,235,1)") : t.textMuted,
        transform: hovered ? "translateY(-2px) scale(1.06)" : "none",
        transition: "all 200ms ease",
        boxShadow: hovered ? (t.isDark ? "0 4px 16px rgba(74,222,128,0.15)" : "0 4px 16px rgba(37,99,235,0.12)") : "none",
      }}>
        {s.icon}
      </div>
      <span style={{ fontSize: "0.7rem", color: t.textMuted, transition: t.transition }}>{s.label}</span>
    </div>
  )
}

function NewsCard({ entry, onClick, t }: {
  entry: NewsFeedEntry
  onClick: () => void
  t: ReturnType<typeof useTheme>
}) {
  const [hovered, setHovered] = useState(false)
  const accent = t.isDark ? "rgba(74,222,128,0.8)" : "rgba(37,99,235,0.85)"
  const accentBg = t.isDark ? "rgba(74,222,128,0.10)" : "rgba(37,99,235,0.08)"

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: 260,
        borderRadius: 12,
        overflow: "hidden",
        background: t.isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)",
        border: "1px solid " + (hovered ? (t.isDark ? "rgba(74,222,128,0.2)" : "rgba(37,99,235,0.25)") : t.border),
        cursor: "pointer",
        transform: hovered ? "translateY(-2px)" : "none",
        transition: "all 200ms ease",
        boxShadow: hovered ? (t.isDark ? "0 8px 24px rgba(0,0,0,0.4)" : "0 8px 24px rgba(0,0,0,0.12)") : "none",
      }}
    >
      {/* Mini image */}
      <div style={{ width: "100%", height: 130, overflow: "hidden", background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.06)" }}>
        <img
          src={entry.miniImage}
          alt={entry.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "transform 300ms ease", transform: hovered ? "scale(1.04)" : "scale(1)" }}
          onError={e => { (e.target as HTMLImageElement).style.display = "none" }}
        />
      </div>
      {/* Content */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
          <span style={{
            fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase",
            color: accent, background: accentBg, padding: "2px 7px", borderRadius: 10,
          }}>
            {entry.category}
          </span>
          <span style={{ color: t.textFaint, fontSize: "0.67rem" }}>{entry.readingTime}</span>
        </div>
        <div style={{ color: t.text, fontSize: "0.82rem", fontWeight: 600, lineHeight: 1.35, marginBottom: 6, transition: t.transition }}>
          {entry.title}
        </div>
        <div style={{ color: t.textMuted, fontSize: "0.72rem", lineHeight: 1.5, transition: t.transition }}>
          {entry.summary}
        </div>
        <div style={{ color: t.textFaint, fontSize: "0.67rem", marginTop: 10 }}>{entry.date}</div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Browser() {
  const t = useTheme()
  const [page, setPage] = useState<PageState>("home")
  const [urlBar, setUrlBar] = useState("hyk://new-tab")
  const [feed, setFeed] = useState<NewsFeedEntry[]>([])
  const [feedLoading, setFeedLoading] = useState(false)
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [articleLoading, setArticleLoading] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  // Load feed on mount for home page news cards
  useEffect(() => {
    setFeedLoading(true)
    fetchFeed().then(setFeed).catch(() => {}).finally(() => setFeedLoading(false))
  }, [])

  // Focus search on home page
  useEffect(() => {
    if (page === "home") setTimeout(() => searchRef.current?.focus(), 100)
  }, [page])

  const goHome = useCallback(() => {
    setPage("home")
    setUrlBar("hyk://new-tab")
  }, [])

  const goBack = useCallback(() => {
    if (page === "article") { setPage("news"); setUrlBar("news://hyk.internal/feed") }
    else goHome()
  }, [page, goHome])

  const openNews = useCallback(async () => {
    setPage("news")
    setUrlBar("news://hyk.internal/feed")
  }, [])

  const openArticle = useCallback(async (entry: NewsFeedEntry) => {
    setPage("article")
    setUrlBar(`news://hyk.internal/${entry.id}`)
    setArticle(null)
    setArticleLoading(true)
    try { setArticle(await fetchArticle(entry.id)) }
    catch { setPage("404") }
    finally { setArticleLoading(false) }
  }, [])

  const accent = t.isDark ? "rgba(74,222,128,1)" : "rgba(37,99,235,1)"
  const accentBg = t.isDark ? "rgba(74,222,128,0.08)" : "rgba(37,99,235,0.07)"

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t.bg, transition: t.transition }}>

      <NavBar page={page} onBack={goBack} onHome={goHome} urlBar={urlBar} t={t} />

      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* ── HOME ── */}
        {page === "home" && (
          <div style={{ display: "flex", flexDirection: "column", padding: "32px 32px 40px", minHeight: "100%", gap: 32 }}>

            {/* Search */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, paddingTop: 8 }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 700, color: t.text, letterSpacing: "-0.02em", transition: t.transition }}>
                Good evening
              </div>
              <div style={{
                width: "100%", maxWidth: 520,
                display: "flex", alignItems: "center", gap: 10,
                background: t.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: "1px solid " + t.borderStrong,
                borderRadius: 28,
                padding: "10px 18px",
                boxShadow: t.isDark ? "0 2px 12px rgba(0,0,0,0.3)" : "0 2px 12px rgba(0,0,0,0.08)",
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={t.textFaint} strokeWidth="2" strokeLinecap="round">
                  <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                </svg>
                <input
                  ref={searchRef}
                  placeholder="Search the portfolio or the web..."
                  style={{
                    flex: 1, background: "none", border: "none", outline: "none",
                    color: t.text, fontSize: "0.85rem", fontFamily: "inherit",
                  }}
                />
              </div>
            </div>

            {/* Shortcuts */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
              <div style={{ color: t.textFaint, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                Quick access
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "20px 28px" }}>
                {SHORTCUTS.map(s => <ShortcutIcon key={s.id} s={s} t={t} />)}
              </div>
            </div>

            {/* News section */}
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ color: t.textFaint, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600 }}>
                  Latest News
                </div>
                <button
                  onClick={openNews}
                  style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: accent, fontSize: "0.72rem", fontWeight: 600, padding: 0,
                  }}
                >
                  See all →
                </button>
              </div>

              {feedLoading ? (
                <div style={{ color: t.textFaint, fontSize: "0.8rem" }}>Loading…</div>
              ) : (
                <div style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none" }}>
                  {feed.map(entry => (
                    <NewsCard key={entry.id} entry={entry} onClick={() => openArticle(entry)} t={t} />
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ── NEWS LIST ── */}
        {page === "news" && (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ color: t.textFaint, fontSize: "0.68rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 20 }}>
              HYK News
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {feed.map(entry => (
                <div
                  key={entry.id}
                  onClick={() => openArticle(entry)}
                  style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                    borderRadius: 10, background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: "1px solid " + t.border, cursor: "pointer", transition: t.transition,
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = t.bgHover
                    el.style.borderColor = t.isDark ? "rgba(74,222,128,0.2)" : "rgba(37,99,235,0.3)"
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
                    el.style.borderColor = t.border
                  }}
                >
                  <img src={entry.miniImage} alt="" style={{ width: 52, height: 52, borderRadius: 8, objectFit: "cover", flexShrink: 0 }} onError={e => { (e.target as HTMLImageElement).style.display = "none" }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accent }}>{entry.category}</span>
                      <span style={{ color: t.textFaint, fontSize: "0.68rem" }}>{entry.date} · {entry.readingTime}</span>
                    </div>
                    <div style={{ color: t.text, fontSize: "0.84rem", fontWeight: 500, transition: t.transition }}>{entry.title}</div>
                    <div style={{ color: t.textMuted, fontSize: "0.74rem", marginTop: 3, lineHeight: 1.4, transition: t.transition }}>{entry.summary}</div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ARTICLE ── */}
        {page === "article" && (
          <div style={{ padding: "28px 32px", maxWidth: 640 }}>
            {articleLoading || !article ? (
              <div style={{ color: t.textFaint, fontSize: "0.8rem" }}>Loading…</div>
            ) : (
              <>
                {article.cover && (
                  <img src={article.cover} alt={article.title} style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 10, marginBottom: 20 }} />
                )}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                  <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: accent, background: accentBg, padding: "2px 8px", borderRadius: 10 }}>{article.category}</span>
                  <span style={{ color: t.textFaint, fontSize: "0.68rem" }}>{article.date} · {article.readingTime}</span>
                </div>
                <div style={{ color: t.text, fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.35, marginBottom: 20, transition: t.transition }}>{article.title}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {article.content.map((block, i) =>
                    block.type === "heading"
                      ? <div key={i} style={{ color: t.text, fontSize: "0.9rem", fontWeight: 700, marginTop: 6, transition: t.transition }}>{block.text}</div>
                      : <div key={i} style={{ color: t.textMuted, fontSize: "0.83rem", lineHeight: 1.68, transition: t.transition }}>{block.text}</div>
                  )}
                </div>
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid " + t.border, color: t.textFaint, fontSize: "0.72rem" }}>By {article.author}</div>
              </>
            )}
          </div>
        )}

        {/* ── 404 ── */}
        {page === "404" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 16, padding: 40 }}>
            <div style={{ fontSize: "4rem", fontWeight: 700, color: t.isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", fontFamily: "'JetBrains Mono', monospace" }}>404</div>
            <div style={{ color: t.textMuted, fontSize: "0.9rem" }}>Page not found.</div>
            <div style={{ color: t.textFaint, fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>This page was never published. Or perhaps it was.</div>
          </div>
        )}

      </div>
    </div>
  )
}
