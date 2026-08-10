import { useState, useEffect } from "react"
import profileImg from "@/assets/profile/profile.png"
import { useTheme } from "@/context/ThemeContext"
import { EDUCATION } from "@/content/data"
import profileData from "../../public/content/profile.json"
import awsIcon from "@/assets/icons/aws.svg"

// ─── High-quality Custom SVG Technology Icons ───────────────────────────────
const SPECIAL_ICONS: Record<string, React.ReactNode> = {
  aws: (
    <img src={awsIcon} alt="AWS" style={{ width: 14, height: 14, objectFit: "contain" }} />
  ),
  hyprland: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 21V3l10 10V3" />
      <path d="M20 21V10" />
    </svg>
  ),
  wayland: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M2.5 3h2.8l2.9 12.2L11.7 3h2.6l3.5 12.2L20.7 3h2.8L18.7 21h-3.2L12 8.8 8.5 21H5.3L2.5 3z" />
    </svg>
  ),
  ags: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="2" y1="7" x2="22" y2="7" />
      <circle cx="6" cy="5" r="1" fill="currentColor" />
      <circle cx="10" cy="5" r="1" fill="currentColor" />
      <circle cx="14" cy="5" r="1" fill="currentColor" />
      <path d="M6 12h4m2 0h2" />
    </svg>
  ),
  astal: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="12" y1="12" x2="22" y2="8.5" />
      <line x1="12" y1="12" x2="2" y2="8.5" />
    </svg>
  ),
  gtk4: (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  "draw.io": (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="3" />
      <circle cx="5" cy="18" r="3" />
      <circle cx="19" cy="18" r="3" />
      <line x1="10" y1="7.5" x2="6.5" y2="15.5" />
      <line x1="14" y1="7.5" x2="17.5" y2="15.5" />
      <line x1="8" y1="18" x2="16" y2="18" />
    </svg>
  )
}

function TechIcon({ name }: { name: string }) {
  const [error, setError] = useState(false)

  const key = name
    .toLowerCase()
    .replace("spring boot", "spring")
    .replace("angular", "angularjs")
    .replace("vue.js", "vuejs")
    .replace("tailwindcss", "tailwindcss")
    .replace("tailwind css", "tailwindcss")
    .trim()

  // Use custom SVGs for specific keys
  if (SPECIAL_ICONS[key]) {
    return <>{SPECIAL_ICONS[key]}</>
  }

  // Fallbacks for other custom elements
  if (
    error ||
    [
      "vercel",
      "rest apis",
      "jwt",
      "jpa",
      "ci/cd",
      "docker compose",
      "sql",
    ].includes(key)
  ) {
    if (key === "vercel") {
      return (
        <svg width="14" height="14" viewBox="0 0 116 100" fill="currentColor">
          <path d="M57.5 0L115 100H0L57.5 0Z" />
        </svg>
      )
    }
    return (
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </svg>
    )
  }

  const url = `https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${key}/${key}-original.svg`
  return (
    <img
      src={url}
      alt={name}
      onError={() => setError(true)}
      style={{ width: 14, height: 14, objectFit: "contain" }}
    />
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const t = useTheme()
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          color: t.textFaint,
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          paddingBottom: 6,
          borderBottom: "1px solid " + t.border,
          transition: t.transition,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

export default function Profile() {
  const t = useTheme()
  const [activeTab, setActiveTab] = useState<string>("Profile")
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768
    }
    return false
  })

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: isMobile ? "column" : "row",
        overflow: "hidden",
        background: t.bg,
        transition: t.transition,
      }}
    >
      {/* Sidebar/TopBar Navigation */}
      <div
        style={{
          width: isMobile ? "100%" : 240,
          flexShrink: 0,
          background: t.bgSidebar,
          borderRight: isMobile ? "none" : "1px solid " + t.border,
          borderBottom: isMobile ? "1px solid " + t.border : "none",
          display: "flex",
          flexDirection: isMobile ? "column" : "column",
          padding: isMobile ? "16px" : "28px 20px",
          gap: isMobile ? 12 : 20,
          overflowY: isMobile ? "visible" : "auto",
          transition: t.transition,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: isMobile ? 48 : 88,
              height: isMobile ? 48 : 88,
              borderRadius: "50%",
              overflow: "hidden",
              border: t.isDark
                ? "2px solid rgba(74,222,128,0.3)"
                : "2px solid rgba(37,99,235,0.3)",
              boxShadow: t.isDark
                ? "0 0 20px rgba(74,222,128,0.15)"
                : "0 0 20px rgba(37,99,235,0.1)",
              background: t.isDark ? "#111" : "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: t.transition,
            }}
          >
            <img
              src={profileImg}
              alt="HYK"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </div>
          <div style={{ textAlign: isMobile ? "left" : "center" }}>
            <div
              style={{
                color: t.text,
                fontWeight: 600,
                fontSize: isMobile ? "0.9rem" : "1rem",
                transition: t.transition,
              }}
            >
              {profileData.name}
            </div>
            <div
              style={{
                color: t.textMuted,
                fontSize: isMobile ? "0.7rem" : "0.75rem",
                marginTop: 2,
                transition: t.transition,
              }}
            >
              {profileData.title}
            </div>
          </div>
        </div>

        {/* Nav items */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "row" : "column",
            gap: isMobile ? 8 : 4,
            overflowX: isMobile ? "auto" : "visible",
            width: "100%",
            scrollbarWidth: "none",
          }}
        >
          {["Profile", "Skills", "Languages", "Contact"].map((item) => {
            const isSelected = activeTab === item
            return (
              <div
                key={item}
                onClick={() => setActiveTab(item)}
                style={{
                  padding: isMobile ? "6px 12px" : "7px 12px",
                  borderRadius: 6,
                  color: isSelected ? (t.isDark ? "#4ade80" : "#2563eb") : t.textMuted,
                  background: isSelected
                    ? t.isDark
                      ? "rgba(74,222,128,0.08)"
                      : "rgba(37,99,235,0.08)"
                    : "transparent",
                  fontSize: "0.82rem",
                  cursor: "pointer",
                  transition: t.transition,
                  whiteSpace: "nowrap",
                }}
              >
                {item}
              </div>
            )
          })}
        </div>
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "18px" : "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        {activeTab === "Profile" && (
          <>
            <Section title="About">
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <Row label="Name" value={profileData.name} />
                <Row label="Location" value={profileData.location} />
                <Row label="Status" value={profileData.status} accent />
                <Row label="Focus" value={profileData.focus} />
              </div>
              <p
                style={{
                  color: t.textMuted,
                  fontSize: "0.85rem",
                  lineHeight: 1.75,
                  margin: 0,
                  marginTop: 8,
                  transition: t.transition,
                }}
              >
                {profileData.about}
              </p>
            </Section>

            <Section title="Education">
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {EDUCATION.map((edu) => (
                  <div key={edu.id} style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ color: t.text, fontWeight: 600, fontSize: "0.85rem" }}>
                        {edu.institution}
                      </span>
                      <span style={{ color: t.textFaint, fontSize: "0.72rem", fontFamily: "'JetBrains Mono', monospace" }}>
                        {edu.period}
                      </span>
                    </div>
                    <div style={{ color: t.textMuted, fontSize: "0.78rem" }}>
                      {edu.degree}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </>
        )}

        {activeTab === "Skills" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {Object.entries(profileData.skills).map(([category, techs]) => (
              <Section key={category} title={category}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 8,
                  }}
                >
                  {(techs as string[]).map((tech) => (
                    <div
                      key={tech}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        padding: "6px 12px",
                        background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
                        border: "1px solid " + t.border,
                        borderRadius: 6,
                        transition: t.transition,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 16,
                          height: 16,
                          flexShrink: 0,
                          color: t.isDark ? "#4ade80" : "#2563eb",
                        }}
                      >
                        <TechIcon name={tech} />
                      </div>
                      <span
                        style={{
                          color: t.text,
                          fontSize: "0.8rem",
                          transition: t.transition,
                        }}
                      >
                        {tech}
                      </span>
                    </div>
                  ))}
                </div>
              </Section>
            ))}
          </div>
        )}

        {activeTab === "Languages" && (
          <Section title="Languages">
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {[
                { lang: "Arabic", level: "Native", percent: 100, flag: "🇲🇦" },
                { lang: "English", level: "Professional Working", percent: 85, flag: "🇬🇧" },
                { lang: "French", level: "Professional Working", percent: 70, flag: "🇫🇷" },
              ].map(({ lang, level, percent, flag }) => (
                <div
                  key={lang}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    padding: "14px 16px",
                    borderRadius: 8,
                    background: t.isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                    border: "1px solid " + t.border,
                    transition: t.transition,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "1.2rem", lineHeight: 1 }}>{flag}</span>
                      <span style={{ color: t.text, fontWeight: 600, fontSize: "0.85rem" }}>
                        {lang}
                      </span>
                    </div>
                    <span
                      style={{
                        color: t.isDark ? "#4ade80" : "#2563eb",
                        fontSize: "0.75rem",
                        fontWeight: 500,
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      {level}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div
                    style={{
                      height: 6,
                      width: "100%",
                      background: t.isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)",
                      borderRadius: 3,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${percent}%`,
                        background: t.isDark
                          ? "linear-gradient(90deg, #22c55e, #4ade80)"
                          : "linear-gradient(90deg, #3b82f6, #2563eb)",
                        borderRadius: 3,
                        boxShadow: t.isDark ? "0 0 8px rgba(74,222,128,0.4)" : "none",
                        transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Section>
        )}

        {activeTab === "Contact" && (
          <Section title="Contact">
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <ContactRow
                icon={
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                }
                label="Email"
                value={profileData.contact.email}
                href={`mailto:${profileData.contact.email}`}
              />
              <ContactRow
                icon={
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                  </svg>
                }
                label="GitHub"
                value={profileData.contact.github}
                href={`https://${profileData.contact.github}`}
              />
              <ContactRow
                icon={
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                }
                label="LinkedIn"
                value={profileData.contact.linkedin}
                href={`https://${profileData.contact.linkedin}`}
              />
              <ContactRow
                icon={
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.182 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z"/>
                  </svg>
                }
                label="Discord"
                value="houssam_yakhlaf"
                href="https://discord.com/users/1412070532844752950"
              />
              {profileData.contact.phone && (
                <ContactRow
                  icon={
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  }
                  label="Phone"
                  value={profileData.contact.phone}
                  href={`tel:${profileData.contact.phone}`}
                />
              )}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}

function Row({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  const t = useTheme()
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      <span
        style={{
          color: t.textFaint,
          fontSize: "0.78rem",
          minWidth: 80,
          fontFamily: "'JetBrains Mono', monospace",
          transition: t.transition,
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: accent ? (t.isDark ? "#4ade80" : "#16a34a") : t.textMuted,
          fontSize: "0.82rem",
          transition: t.transition,
        }}
      >
        {value}
      </span>
    </div>
  )
}

function ContactRow({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
}) {
  const t = useTheme()
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "12px 16px",
        borderRadius: 8,
        background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: "1px solid " + t.border,
        textDecoration: "none",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = t.bgHover
        el.style.borderColor = t.isDark ? "rgba(74,222,128,0.4)" : "rgba(37,99,235,0.4)"
        el.style.transform = "translateY(-2px)"
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.background = t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)"
        el.style.borderColor = t.border
        el.style.transform = "translateY(0)"
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.isDark ? "#4ade80" : "#2563eb",
          width: 20,
          height: 20,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <span
          style={{
            color: t.textFaint,
            fontSize: "0.68rem",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {label}
        </span>
        <span style={{ color: t.text, fontSize: "0.82rem", fontWeight: 500 }}>
          {value}
        </span>
      </div>
    </a>
  )
}
