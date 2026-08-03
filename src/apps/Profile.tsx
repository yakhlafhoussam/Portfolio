import profileImg from "@/assets/profile/profile.png"
import { useTheme } from "@/context/ThemeContext"

type SkillLevel = "Expert" | "Proficient" | "Learning"

type Skill = { name: string level: SkillLevel }

const SKILLS: Skill[] = [
  { name: "TypeScript", level: "Expert" },
  { name: "Python", level: "Expert" },
  { name: "Rust", level: "Proficient" },
  { name: "Go", level: "Proficient" },
  { name: "React", level: "Expert" },
  { name: "Node.js", level: "Expert" },
  { name: "PostgreSQL", level: "Proficient" },
  { name: "Kubernetes", level: "Proficient" },
  { name: "PyTorch", level: "Proficient" },
  { name: "WebAssembly", level: "Learning" },
  { name: "Zig", level: "Learning" },
  { name: "WebGPU", level: "Learning" },
]

function getLevelColor(level: SkillLevel, isDark: boolean): string {
  if (isDark) {
    switch (level) {
      case "Expert":
        return "#4ade80"
      case "Proficient":
        return "#60a5fa"
      case "Learning":
        return "#fbbf24"
    }
  } else {
    switch (level) {
      case "Expert":
        return "#16a34a"
      case "Proficient":
        return "#2563eb"
      case "Learning":
        return "#d97706"
    }
  }
}

function SkillBadge({ name, level }: Skill) {
  const t = useTheme()
  const color = getLevelColor(level, t.isDark)
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: "1px solid " + t.border,
        borderRadius: 6,
        transition: t.transition,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: t.isDark ? `0 0 6px ${color}80` : "none",
          flexShrink: 0,
          transition: t.transition,
        }}
      />
      <span
        style={{ color: t.text, fontSize: "0.8rem", transition: t.transition }}
      >
        {name}
      </span>
      <span
        style={{
          marginLeft: "auto",
          color: color,
          fontSize: "0.68rem",
          fontFamily: "'JetBrains Mono', monospace",
          opacity: 0.8,
          transition: t.transition,
        }}
      >
        {level}
      </span>
    </div>
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
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        background: t.bg,
        transition: t.transition,
      }}
    >
      {/* Left sidebar */}
      <div
        style={{
          width: 240,
          flexShrink: 0,
          background: t.bgSidebar,
          borderRight: "1px solid " + t.border,
          display: "flex",
          flexDirection: "column",
          padding: "28px 20px",
          gap: 20,
          overflowY: "auto",
          transition: t.transition,
        }}
      >
        {/* Avatar */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 88,
              height: 88,
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
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                color: t.text,
                fontWeight: 600,
                fontSize: "1rem",
                transition: t.transition,
              }}
            >
              HYK
            </div>
            <div
              style={{
                color: t.textMuted,
                fontSize: "0.75rem",
                marginTop: 2,
                transition: t.transition,
              }}
            >
              Software Engineer
            </div>
          </div>
        </div>

        {/* Nav items */}
        {["Profile", "Skills", "Languages", "Contact"].map((item, i) => (
          <div
            key={item}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              color: i === 0 ? (t.isDark ? "#4ade80" : "#2563eb") : t.textMuted,
              background:
                i === 0
                  ? t.isDark
                    ? "rgba(74,222,128,0.08)"
                    : "rgba(37,99,235,0.08)"
                  : "transparent",
              fontSize: "0.82rem",
              cursor: "default",
              transition: t.transition,
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "28px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 28,
        }}
      >
        <Section title="About">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Row label="Name" value="HYK" />
            <Row label="Location" value="Earth, Solar System" />
            <Row label="Status" value="Open to opportunities" accent />
            <Row label="Focus" value="Systems + AI infrastructure" />
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
            I build systems that handle complexity at scale — from low-level
            performance tooling in Rust to ML infrastructure and browser-based
            creative technology. I care deeply about correctness, clarity, and
            the craft of writing software that lasts.
          </p>
        </Section>

        <Section title="Skills">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 6,
            }}
          >
            {SKILLS.map((s) => (
              <SkillBadge key={s.name} {...s} />
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
            {(["Expert", "Proficient", "Learning"] as SkillLevel[]).map((l) => (
              <div
                key={l}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: getLevelColor(l, t.isDark),
                    transition: t.transition,
                  }}
                />
                <span
                  style={{
                    color: t.textFaint,
                    fontSize: "0.7rem",
                    transition: t.transition,
                  }}
                >
                  {l}
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Languages">
          {[
            { lang: "English", level: "Fluent" },
            { lang: "Turkish", level: "Native" },
            { lang: "Japanese", level: "Elementary" },
          ].map(({ lang, level }) => (
            <Row key={lang} label={lang} value={level} />
          ))}
        </Section>

        <Section title="Contact">
          <ContactRow
            icon="✉"
            label="Email"
            value="hyk@proton.me"
            href="mailto:hyk@proton.me"
          />
          <ContactRow
            icon="⌨"
            label="GitHub"
            value="github.com/hyk"
            href="https://github.com/hyk"
          />
          <ContactRow
            icon="◈"
            label="LinkedIn"
            value="linkedin.com/in/hyk"
            href="https://linkedin.com/in/hyk"
          />
        </Section>
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
  icon: string
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
        gap: 12,
        padding: "8px 12px",
        borderRadius: 6,
        background: t.isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)",
        border: "1px solid " + t.border,
        textDecoration: "none",
        transition: t.transition,
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLElement).style.background = t.bgHover)
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLElement).style.background = t.isDark
          ? "rgba(255,255,255,0.03)"
          : "rgba(0,0,0,0.02)")
      }
    >
      <span
        style={{
          fontSize: "0.9rem",
          color: t.textFaint,
          transition: t.transition,
        }}
      >
        {icon}
      </span>
      <span
        style={{
          color: t.textMuted,
          fontSize: "0.75rem",
          minWidth: 60,
          transition: t.transition,
        }}
      >
        {label}
      </span>
      <span
        style={{ color: t.text, fontSize: "0.8rem", transition: t.transition }}
      >
        {value}
      </span>
    </a>
  )
}
