import { useState } from "react"
import { PROJECTS, EXPERIENCE, EDUCATION } from "@/data"

type Section = "projects" | "experience" | "education"
type Props = { section: Section }

/* ── Shared layout ── */
const col: React.CSSProperties = { display: "flex", flexDirection: "column", overflow: "hidden" }
const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8 }

function Tag({ label }: { label: string }) {
  return (
    <span
      style={{
        background: "rgba(74,222,128,0.1)",
        color: "#4ade80",
        border: "1px solid rgba(74,222,128,0.2)",
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: "0.7rem",
        fontFamily: "'JetBrains Mono', monospace",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  )
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Active" ? "#4ade80" : status === "Beta" ? "#fbbf24" : "#a78bfa"
  return (
    <span
      style={{
        fontSize: "0.68rem",
        color,
        border: `1px solid ${color}40`,
        borderRadius: 4,
        padding: "1px 6px",
        fontFamily: "'JetBrains Mono', monospace",
      }}
    >
      {status}
    </span>
  )
}

/* ── Projects view ── */
function ProjectsExplorer() {
  const [selected, setSelected] = useState<string | null>(PROJECTS[0].id)
  const project = PROJECTS.find(p => p.id === selected) ?? null

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      {/* Sidebar */}
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: "#1e1e21",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          ...col,
        }}
      >
        <div
          style={{
            padding: "10px 14px 6px",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Projects
        </div>
        {PROJECTS.map(p => (
          <div
            key={p.id}
            onClick={() => setSelected(p.id)}
            style={{
              padding: "7px 14px",
              cursor: "default",
              background: selected === p.id ? "rgba(74,222,128,0.08)" : "transparent",
              borderLeft: selected === p.id ? "2px solid #4ade80" : "2px solid transparent",
              display: "flex",
              alignItems: "center",
              gap: 8,
              transition: "background 0.1s",
            }}
            onMouseEnter={e => {
              if (selected !== p.id) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"
            }}
            onMouseLeave={e => {
              if (selected !== p.id) (e.currentTarget as HTMLElement).style.background = "transparent"
            }}
          >
            <svg width="16" height="14" viewBox="0 0 16 14">
              <path
                d="M1 3C1 2.2 1.6 1.5 2.4 1.5H6.5L7.5 3H13.6C14.4 3 15 3.7 15 4.5V11.5C15 12.3 14.4 13 13.6 13H2.4C1.6 13 1 12.3 1 11.5V3Z"
                fill="#4a9eff"
                fillOpacity="0.7"
              />
            </svg>
            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>
              {p.name}
            </span>
          </div>
        ))}

        {/* Easter egg: Archive folder */}
        <div
          onClick={() => setSelected("archive")}
          style={{
            padding: "7px 14px",
            cursor: "default",
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: selected === "archive" ? "rgba(255,255,255,0.04)" : "transparent",
            borderLeft: selected === "archive" ? "2px solid rgba(255,255,255,0.2)" : "2px solid transparent",
          }}
          onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.03)"}
          onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = selected === "archive" ? "rgba(255,255,255,0.04)" : "transparent"}
        >
          <svg width="16" height="14" viewBox="0 0 16 14">
            <path
              d="M1 3C1 2.2 1.6 1.5 2.4 1.5H6.5L7.5 3H13.6C14.4 3 15 3.7 15 4.5V11.5C15 12.3 14.4 13 13.6 13H2.4C1.6 13 1 12.3 1 11.5V3Z"
              fill="#555"
            />
          </svg>
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace" }}>
            Archive
          </span>
        </div>
      </div>

      {/* Detail panel */}
      <div style={{ flex: 1, ...col, overflowY: "auto", padding: "24px 28px" }}>
        {selected === "archive" ? (
          <div style={{ ...col, gap: 16 }}>
            <h2 style={{ color: "rgba(255,255,255,0.3)", fontWeight: 500, fontSize: "1rem", margin: 0 }}>
              Archive/
            </h2>
            <div
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 8,
                padding: "20px 24px",
                fontFamily: "'JetBrains Mono', monospace",
                color: "rgba(255,255,255,0.15)",
                fontSize: "0.82rem",
              }}
            >
              <div>██████████████.tar.gz</div>
              <div style={{ marginTop: 12, fontSize: "0.72rem", color: "rgba(255,255,255,0.1)" }}>
                Classification restricted. [EPERM: 0x4F]
              </div>
            </div>
          </div>
        ) : project ? (
          <div style={{ ...col, gap: 20 }}>
            <div style={{ ...row, justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <h2 style={{ margin: 0, color: "#e2e2e2", fontWeight: 600, fontSize: "1.15rem", fontFamily: "'JetBrains Mono', monospace" }}>
                {project.name}/
              </h2>
              <div style={{ ...row, gap: 8 }}>
                <StatusBadge status={project.status} />
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem" }}>{project.year}</span>
              </div>
            </div>

            {project.image && (
              <img
                src={project.image}
                alt={project.name}
                style={{
                  width: "100%",
                  height: 200,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              />
            )}

            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
              {project.description}
            </p>

            <div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
                Technologies
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {project.technologies.map(t => <Tag key={t} label={t} />)}
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.7)",
                  borderRadius: 6,
                  padding: "7px 14px",
                  fontSize: "0.8rem",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: 6,
                  transition: "background 0.12s",
                }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)"}
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                </svg>
                GitHub
              </a>
              {project.demo && (
                <a
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: "rgba(74,222,128,0.08)",
                    border: "1px solid rgba(74,222,128,0.2)",
                    color: "#4ade80",
                    borderRadius: 6,
                    padding: "7px 14px",
                    fontSize: "0.8rem",
                    textDecoration: "none",
                    display: "flex", alignItems: "center", gap: 6,
                    transition: "background 0.12s",
                  }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.14)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = "rgba(74,222,128,0.08)"}
                >
                  ↗ Live Demo
                </a>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* ── Experience view ── */
function ExperienceExplorer() {
  const [selected, setSelected] = useState(EXPERIENCE[0].id)
  const item = EXPERIENCE.find(e => e.id === selected)

  const typeIcon = (type: string) => {
    if (type === "internship") return "🏢"
    if (type === "research") return "🔬"
    return "💻"
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: "#1e1e21",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          ...col,
        }}
      >
        <div
          style={{
            padding: "10px 14px 6px",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Experience
        </div>
        {EXPERIENCE.map(e => (
          <div
            key={e.id}
            onClick={() => setSelected(e.id)}
            style={{
              padding: "8px 14px",
              cursor: "default",
              background: selected === e.id ? "rgba(167,139,250,0.08)" : "transparent",
              borderLeft: selected === e.id ? "2px solid #a78bfa" : "2px solid transparent",
              transition: "background 0.1s",
            }}
            onMouseEnter={ev => {
              if (selected !== e.id) (ev.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"
            }}
            onMouseLeave={ev => {
              if (selected !== e.id) (ev.currentTarget as HTMLElement).style.background = "transparent"
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.79rem", fontWeight: 500 }}>
              {e.company}
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", marginTop: 1 }}>
              {e.period.split(" — ")[0]}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, ...col, overflowY: "auto", padding: "24px 28px" }}>
        {item && (
          <div style={{ ...col, gap: 18 }}>
            <div>
              <div style={{ ...row, gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0, color: "#e2e2e2", fontWeight: 600, fontSize: "1.1rem" }}>
                  {item.role}
                </h2>
                <span style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>
                  {item.period}
                </span>
              </div>
              <div style={{ color: "#a78bfa", fontSize: "0.85rem", marginTop: 4 }}>
                {item.company} · {item.location}
              </div>
            </div>

            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.85rem", lineHeight: 1.7, margin: 0 }}>
              {item.description}
            </p>

            <div>
              <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
                Technologies
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {item.technologies.map(t => <Tag key={t} label={t} />)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Education view ── */
function EducationExplorer() {
  const [selected, setSelected] = useState(EDUCATION[0].id)
  const item = EDUCATION.find(e => e.id === selected)

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
      <div
        style={{
          width: 220,
          flexShrink: 0,
          background: "#1e1e21",
          borderRight: "1px solid rgba(255,255,255,0.06)",
          ...col,
        }}
      >
        <div
          style={{
            padding: "10px 14px 6px",
            color: "rgba(255,255,255,0.3)",
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Education
        </div>
        {EDUCATION.map(e => (
          <div
            key={e.id}
            onClick={() => setSelected(e.id)}
            style={{
              padding: "8px 14px",
              cursor: "default",
              background: selected === e.id ? "rgba(251,191,36,0.08)" : "transparent",
              borderLeft: selected === e.id ? "2px solid #fbbf24" : "2px solid transparent",
              transition: "background 0.1s",
            }}
            onMouseEnter={ev => {
              if (selected !== e.id) (ev.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"
            }}
            onMouseLeave={ev => {
              if (selected !== e.id) (ev.currentTarget as HTMLElement).style.background = "transparent"
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.79rem", fontWeight: 500 }}>
              {e.degree}
            </div>
            <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.72rem", marginTop: 1 }}>
              {e.period}
            </div>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, ...col, overflowY: "auto", padding: "24px 28px" }}>
        {item && (
          <div style={{ ...col, gap: 18 }}>
            <div>
              <h2 style={{ margin: 0, color: "#e2e2e2", fontWeight: 600, fontSize: "1.1rem" }}>
                {item.degree}
              </h2>
              <div style={{ color: "#fbbf24", fontSize: "0.85rem", marginTop: 4 }}>
                {item.institution} · {item.period}
              </div>
              {item.gpa && (
                <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.78rem", marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
                  GPA: {item.gpa}
                </div>
              )}
            </div>

            {item.relevant.length > 0 && (
              <div>
                <div style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8 }}>
                  Relevant Coursework
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {item.relevant.map(r => (
                    <span
                      key={r}
                      style={{
                        background: "rgba(251,191,36,0.08)",
                        color: "rgba(251,191,36,0.8)",
                        border: "1px solid rgba(251,191,36,0.18)",
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {r}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Toolbar ── */
function Toolbar({ path }: { path: string }) {
  return (
    <div
      style={{
        height: 36,
        flexShrink: 0,
        background: "#252528",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 6,
      }}
    >
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M10 3L5 8L10 13" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M6 3L11 8L6 13" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <div
        style={{
          flex: 1,
          background: "rgba(0,0,0,0.25)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 4,
          padding: "3px 10px",
          color: "rgba(255,255,255,0.4)",
          fontSize: "0.75rem",
          fontFamily: "'JetBrains Mono', monospace",
          marginLeft: 6,
        }}
      >
        ~/desktop/{path}
      </div>
    </div>
  )
}

export default function FileExplorer({ section }: Props) {
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: "#222225" }}>
      <Toolbar path={section} />
      {section === "projects"   && <ProjectsExplorer />}
      {section === "experience" && <ExperienceExplorer />}
      {section === "education"  && <EducationExplorer />}
    </div>
  )
}
