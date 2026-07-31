import profileImg from "@/imports/profile.png"

type SkillLevel = "Expert" | "Proficient" | "Learning"

type Skill = { name: string; level: SkillLevel }

const SKILLS: Skill[] = [
  { name: "TypeScript",    level: "Expert" },
  { name: "Python",        level: "Expert" },
  { name: "Rust",          level: "Proficient" },
  { name: "Go",            level: "Proficient" },
  { name: "React",         level: "Expert" },
  { name: "Node.js",       level: "Expert" },
  { name: "PostgreSQL",    level: "Proficient" },
  { name: "Kubernetes",    level: "Proficient" },
  { name: "PyTorch",       level: "Proficient" },
  { name: "WebAssembly",   level: "Learning" },
  { name: "Zig",           level: "Learning" },
  { name: "WebGPU",        level: "Learning" },
]

const LEVEL_COLOR: Record<SkillLevel, string> = {
  Expert:     "#4ade80",
  Proficient: "#60a5fa",
  Learning:   "#fbbf24",
}

function SkillBadge({ name, level }: Skill) {
  const color = LEVEL_COLOR[level]
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 12px",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 6,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}80`,
          flexShrink: 0,
        }}
      />
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>{name}</span>
      <span
        style={{
          marginLeft: "auto",
          color: color,
          fontSize: "0.68rem",
          fontFamily: "'JetBrains Mono', monospace",
          opacity: 0.7,
        }}
      >
        {level}
      </span>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <div
        style={{
          color: "rgba(255,255,255,0.25)",
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.09em",
          textTransform: "uppercase",
          paddingBottom: 6,
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {title}
      </div>
      {children}
    </div>
  )
}

export default function Profile() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        overflow: "hidden",
        background: "#202024",
      }}
    >
      {/* Left sidebar */}
      <div
        style={{
          width: 240,
          flexShrink: 0,
          background: "#1c1c20",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          padding: "28px 20px",
          gap: 20,
          overflowY: "auto",
        }}
      >
        {/* Avatar */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 88,
              height: 88,
              borderRadius: "50%",
              overflow: "hidden",
              border: "2px solid rgba(74,222,128,0.3)",
              boxShadow: "0 0 20px rgba(74,222,128,0.15)",
              background: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
            <div style={{ color: "#e2e2e2", fontWeight: 600, fontSize: "1rem" }}>HYK</div>
            <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", marginTop: 2 }}>
              Software Engineer
            </div>
          </div>
        </div>

        {/* Nav items */}
        {[
          "Profile",
          "Skills",
          "Languages",
          "Contact",
        ].map((item, i) => (
          <div
            key={item}
            style={{
              padding: "7px 12px",
              borderRadius: 6,
              color: i === 0 ? "#4ade80" : "rgba(255,255,255,0.5)",
              background: i === 0 ? "rgba(74,222,128,0.08)" : "transparent",
              fontSize: "0.82rem",
              cursor: "default",
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
              color: "rgba(255,255,255,0.55)",
              fontSize: "0.85rem",
              lineHeight: 1.75,
              margin: 0,
              marginTop: 8,
            }}
          >
            I build systems that handle complexity at scale — from low-level performance tooling
            in Rust to ML infrastructure and browser-based creative technology. I care deeply
            about correctness, clarity, and the craft of writing software that lasts.
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
            {SKILLS.map(s => <SkillBadge key={s.name} {...s} />)}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
            {(["Expert", "Proficient", "Learning"] as SkillLevel[]).map(l => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div
                  style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: LEVEL_COLOR[l],
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem" }}>{l}</span>
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
          <ContactRow icon="✉" label="Email" value="hyk@proton.me" href="mailto:hyk@proton.me" />
          <ContactRow icon="⌨" label="GitHub" value="github.com/hyk" href="https://github.com/hyk" />
          <ContactRow icon="◈" label="LinkedIn" value="linkedin.com/in/hyk" href="https://linkedin.com/in/hyk" />
        </Section>
      </div>
    </div>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
      <span
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.78rem",
          minWidth: 80,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </span>
      <span
        style={{
          color: accent ? "#4ade80" : "rgba(255,255,255,0.7)",
          fontSize: "0.82rem",
        }}
      >
        {value}
      </span>
    </div>
  )
}

function ContactRow({
  icon, label, value, href,
}: {
  icon: string; label: string; value: string; href: string
}) {
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
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.06)",
        textDecoration: "none",
        transition: "background 0.12s",
      }}
      onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"}
      onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"}
    >
      <span style={{ fontSize: "0.9rem", opacity: 0.6 }}>{icon}</span>
      <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.75rem", minWidth: 60 }}>{label}</span>
      <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.8rem" }}>{value}</span>
    </a>
  )
}
