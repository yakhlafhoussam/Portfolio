import { useTheme } from "../../context/ThemeContext"
import { EXPERIENCE } from "../../content/data"

export default function MobileExperience() {
  const t = useTheme()

  return (
    <div
      style={{
        flex: 1,
        background: t.bg,
        color: t.text,
        padding: "16px 20px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      {EXPERIENCE.map((item) => (
        <div
          key={item.id}
          style={{
            border: `1px solid ${t.border}`,
            borderRadius: 12,
            padding: 16,
            background: t.bgSidebar,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            gap: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
                {item.company}
              </h3>
              <div style={{ fontSize: "0.8rem", color: t.textMuted, marginTop: 2 }}>
                {item.role}
              </div>
            </div>
            <span
              style={{
                fontSize: "0.68rem",
                fontFamily: "monospace",
                color: t.isDark ? "#4ade80" : "#2563eb",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {item.period}
            </span>
          </div>

          <div style={{ fontSize: "0.72rem", color: t.textFaint, fontFamily: "monospace" }}>
            {item.location} • {item.type.toUpperCase()}
          </div>

          <p style={{ margin: 0, fontSize: "0.82rem", lineHeight: 1.4, color: t.textMuted }}>
            {item.description}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
            {item.technologies.map((tech) => (
              <span
                key={tech}
                style={{
                  background: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                  border: `1px solid ${t.border}`,
                  borderRadius: 4,
                  padding: "2px 6px",
                  fontSize: "0.65rem",
                  color: t.text,
                  fontWeight: 500,
                }}
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
