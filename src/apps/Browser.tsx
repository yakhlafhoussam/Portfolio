import { useState, useEffect, useCallback } from "react"
import { useTheme } from "@/context/ThemeContext"

// ─── Types ───────────────────────────────────────────────────────────────────

type Bookmark = {
  id: string
  label: string
  url: string
  description: string
  icon: React.ReactNode
  easter?: boolean
}

/** A single entry in feed.json — only the fields needed for the news list. */
type NewsFeedEntry = {
  id: string
  title: string
  summary: string
  date: string
  category: string
}

/** A single content block inside an article's index.json. */
type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }

/** The full shape of a per-article index.json file. */
type NewsArticle = NewsFeedEntry & {
  author: string
  readingTime: string
  cover?: string
  content: ContentBlock[]
}

// ─── Static bookmarks ────────────────────────────────────────────────────────

const GitHubIcon = () => (
  <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

const BOOKMARKS: Bookmark[] = [
  {
    id: "github",
    label: "GitHub",
    url: "https://github.com/hyk",
    description: "Source code, contributions, and open-source projects",
    icon: <GitHubIcon />,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    url: "https://linkedin.com/in/hyk",
    description: "Professional profile and career history",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    id: "email",
    label: "Email",
    url: "mailto:hyk@proton.me",
    description: "Get in touch — response time usually under 24 hours",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 8l10 6 10-6" />
      </svg>
    ),
  },
  {
    id: "resume",
    label: "Resume",
    url: "#",
    description: "Download the latest PDF version of my resume",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="18" x2="12" y2="12" />
        <polyline points="9 15 12 18 15 15" />
      </svg>
    ),
  },
  {
    id: "repo",
    label: "Portfolio Repository",
    url: "https://github.com/hyk/portfolio",
    description: "The source code for this interactive desktop portfolio",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    ),
  },
  {
    id: "docs",
    label: "Documentation",
    url: "#404",
    description: "Internal documentation",
    easter: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
]

// ─── Data fetching helpers ────────────────────────────────────────────────────

/**
 * Load the news feed index.
 *
 * Future migration: swap `/content/news/feed.json` for `/api/news`
 * without touching any rendering logic.
 */
async function fetchFeed(): Promise<NewsFeedEntry[]> {
  const res = await fetch("/content/news/feed.json")
  if (!res.ok) throw new Error("Failed to load news feed")
  return res.json()
}

/**
 * Load a single article by ID.
 *
 * Future migration: swap `/content/news/${id}/index.json` for `/api/news/${id}`
 * without touching any rendering logic.
 */
async function fetchArticle(id: string): Promise<NewsArticle> {
  const res = await fetch(`/content/news/${id}/index.json`)
  if (!res.ok) throw new Error(`Failed to load article: ${id}`)
  return res.json()
}

// ─── Page state ───────────────────────────────────────────────────────────────

type PageState = "bookmarks" | "news" | "article" | "404" | "external"

// ─── Component ───────────────────────────────────────────────────────────────

export default function Browser() {
  const t = useTheme()

  const [page, setPage] = useState<PageState>("bookmarks")
  const [urlBar, setUrlBar] = useState("bookmarks://new-tab")

  // News state
  const [feed, setFeed] = useState<NewsFeedEntry[]>([])
  const [feedLoading, setFeedLoading] = useState(false)
  const [article, setArticle] = useState<NewsArticle | null>(null)
  const [articleLoading, setArticleLoading] = useState(false)

  // ── Load feed when navigating to news page ──
  const openNews = useCallback(async () => {
    setPage("news")
    setUrlBar("news://hyk.internal/feed")
    if (feed.length > 0) return
    setFeedLoading(true)
    try {
      const data = await fetchFeed()
      setFeed(data)
    } catch {
      // feed stays empty; UI handles gracefully
    } finally {
      setFeedLoading(false)
    }
  }, [feed.length])

  // ── Load individual article on demand ──
  const openArticle = useCallback(async (entry: NewsFeedEntry) => {
    setPage("article")
    setUrlBar(`news://hyk.internal/${entry.id}`)
    setArticle(null)
    setArticleLoading(true)
    try {
      const data = await fetchArticle(entry.id)
      setArticle(data)
    } catch {
      setPage("404")
    } finally {
      setArticleLoading(false)
    }
  }, [])

  // ── Navigate bookmarks ──
  const navigate = (bm: Bookmark) => {
    if (bm.easter) {
      setPage("404")
      setUrlBar(bm.url === "#404" ? "https://docs.hyk.internal" : bm.url)
      return
    }
    if (bm.id === "resume") return
    window.open(bm.url, "_blank", "noopener,noreferrer")
  }

  // ── Back to bookmarks ──
  const goBack = () => {
    if (page === "article") {
      setPage("news")
      setUrlBar("news://hyk.internal/feed")
    } else {
      setPage("bookmarks")
      setUrlBar("bookmarks://new-tab")
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t.bg, transition: t.transition }}>

      {/* Browser chrome */}
      <div
        style={{
          background: t.bgToolbar,
          borderBottom: "1px solid " + t.border,
          padding: "8px 12px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          flexShrink: 0,
          transition: t.transition,
        }}
      >
        <button
          onClick={goBack}
          style={{
            background: t.bgHover,
            border: "none",
            borderRadius: 4,
            color: t.textMuted,
            fontSize: "0.8rem",
            padding: "4px 8px",
            cursor: "pointer",
            transition: t.transition,
          }}
        >
          ←
        </button>
        <div
          style={{
            flex: 1,
            background: t.bgInput,
            border: "1px solid " + t.border,
            borderRadius: 6,
            padding: "5px 12px",
            color: t.textMuted,
            fontSize: "0.78rem",
            fontFamily: "'JetBrains Mono', monospace",
            display: "flex",
            alignItems: "center",
            gap: 6,
            transition: t.transition,
          }}
        >
          <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="14" height="14" rx="3" stroke={t.textFaint} strokeWidth="1.5" style={{ transition: t.transition }} />
            <path d="M5 8h6M8 5v6" stroke={t.textFaint} strokeWidth="1.2" style={{ transition: t.transition }} />
          </svg>
          {urlBar}
        </div>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, overflowY: "auto" }}>

        {/* 404 */}
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
                lineHeight: 1,
                transition: t.transition,
              }}
            >
              404
            </div>
            <div style={{ color: t.textMuted, fontSize: "0.9rem", textAlign: "center", transition: t.transition }}>
              Documentation unavailable.
            </div>
            <div
              style={{
                color: t.textFaint,
                fontSize: "0.75rem",
                fontFamily: "'JetBrains Mono', monospace",
                textAlign: "center",
                transition: t.transition,
              }}
            >
              This page was never published. Or perhaps it was.
            </div>
          </div>
        )}

        {/* Bookmarks */}
        {page === "bookmarks" && (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ color: t.textFaint, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 20, transition: t.transition }}>
              Bookmarks
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>

              {/* News shortcut */}
              <div
                onClick={openNews}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "12px 16px",
                  borderRadius: 8,
                  background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                  border: "1px solid " + t.border,
                  cursor: "pointer",
                  transition: t.transition,
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
                <div style={{ color: t.textMuted, flexShrink: 0, transition: t.transition }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 22h16a2 2 0 002-2V4a2 2 0 00-2-2H8a2 2 0 00-2 2v16a2 2 0 01-2 2zm0 0a2 2 0 01-2-2v-9c0-1.1.9-2 2-2h2" />
                    <path d="M18 14h-8M15 18h-5M10 6h8v4h-8z" />
                  </svg>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: t.text, fontSize: "0.85rem", fontWeight: 500, transition: t.transition }}>HYK News</div>
                  <div style={{ color: t.textMuted, fontSize: "0.75rem", marginTop: 2, transition: t.transition }}>Industry news, community highlights, and dev culture</div>
                </div>
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round" style={{ transition: t.transition }} />
                </svg>
              </div>

              {/* Static bookmarks */}
              {BOOKMARKS.map(bm => (
                <div
                  key={bm.id}
                  onClick={() => navigate(bm)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 16px",
                    borderRadius: 8,
                    background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                    border: "1px solid " + t.border,
                    cursor: "pointer",
                    transition: t.transition,
                    opacity: bm.easter ? 0.5 : 1,
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
                  <div style={{ color: t.textMuted, flexShrink: 0, transition: t.transition }}>{bm.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: t.text, fontSize: "0.85rem", fontWeight: 500, transition: t.transition }}>{bm.label}</div>
                    <div style={{ color: t.textMuted, fontSize: "0.75rem", marginTop: 2, transition: t.transition }}>{bm.description}</div>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8h10M9 4l4 4-4 4" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round" style={{ transition: t.transition }} />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* News feed list */}
        {page === "news" && (
          <div style={{ padding: "28px 32px" }}>
            <div style={{ color: t.textFaint, fontSize: "0.7rem", letterSpacing: "0.08em", textTransform: "uppercase", fontWeight: 600, marginBottom: 20, transition: t.transition }}>
              HYK News
            </div>
            {feedLoading ? (
              <div style={{ color: t.textFaint, fontSize: "0.8rem", transition: t.transition }}>Loading…</div>
            ) : feed.length === 0 ? (
              <div style={{ color: t.textFaint, fontSize: "0.8rem", transition: t.transition }}>No articles available.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {feed.map(entry => (
                  <div
                    key={entry.id}
                    onClick={() => openArticle(entry)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 14,
                      padding: "12px 16px",
                      borderRadius: 8,
                      background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                      border: "1px solid " + t.border,
                      cursor: "pointer",
                      transition: t.transition,
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
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                        <span
                          style={{
                            fontSize: "0.62rem",
                            fontWeight: 600,
                            letterSpacing: "0.08em",
                            textTransform: "uppercase",
                            color: t.isDark ? "rgba(74,222,128,0.8)" : "rgba(37,99,235,0.8)",
                            transition: t.transition,
                          }}
                        >
                          {entry.category}
                        </span>
                        <span style={{ color: t.textFaint, fontSize: "0.7rem", transition: t.transition }}>{entry.date}</span>
                      </div>
                      <div style={{ color: t.text, fontSize: "0.85rem", fontWeight: 500, transition: t.transition }}>{entry.title}</div>
                      <div style={{ color: t.textMuted, fontSize: "0.75rem", marginTop: 3, lineHeight: 1.4, transition: t.transition }}>{entry.summary}</div>
                    </div>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8h10M9 4l4 4-4 4" stroke={t.textFaint} strokeWidth="1.5" strokeLinecap="round" style={{ transition: t.transition }} />
                    </svg>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Article reader */}
        {page === "article" && (
          <div style={{ padding: "28px 32px", maxWidth: 640 }}>
            {articleLoading || !article ? (
              <div style={{ color: t.textFaint, fontSize: "0.8rem", transition: t.transition }}>Loading…</div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span
                    style={{
                      fontSize: "0.62rem",
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: t.isDark ? "rgba(74,222,128,0.8)" : "rgba(37,99,235,0.8)",
                      transition: t.transition,
                    }}
                  >
                    {article.category}
                  </span>
                  <span style={{ color: t.textFaint, fontSize: "0.7rem", transition: t.transition }}>{article.date}</span>
                  <span style={{ color: t.textFaint, fontSize: "0.7rem", transition: t.transition }}>· {article.readingTime}</span>
                </div>
                <div style={{ color: t.text, fontSize: "1rem", fontWeight: 700, lineHeight: 1.4, marginBottom: 16, transition: t.transition }}>
                  {article.title}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {article.content.map((block, i) => {
                    if (block.type === "heading") {
                      return (
                        <div key={i} style={{ color: t.text, fontSize: "0.88rem", fontWeight: 600, marginTop: 8, transition: t.transition }}>
                          {block.text}
                        </div>
                      )
                    }
                    return (
                      <div key={i} style={{ color: t.textMuted, fontSize: "0.82rem", lineHeight: 1.65, transition: t.transition }}>
                        {block.text}
                      </div>
                    )
                  })}
                </div>
                <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid " + t.border, color: t.textFaint, fontSize: "0.72rem", transition: t.transition }}>
                  By {article.author}
                </div>
              </>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
