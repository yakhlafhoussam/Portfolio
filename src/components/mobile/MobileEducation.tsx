import { useState, useEffect } from "react"
import { useTheme } from "../../context/ThemeContext"
import { EDUCATION } from "../../content/data"

type Props = {
  registerBackHandler?: (handler: (() => boolean) | null) => void
}

export default function MobileEducation({ registerBackHandler }: Props) {
  const t = useTheme()
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Back button routing: collapse expanded card first, otherwise close app
  useEffect(() => {
    if (registerBackHandler) {
      registerBackHandler(() => {
        if (expandedId) {
          setExpandedId(null)
          return true
        }
        return false
      })
    }
    return () => {
      if (registerBackHandler) registerBackHandler(null)
    }
  }, [expandedId, registerBackHandler])

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
        gap: 12,
      }}
    >
      {EDUCATION.map((edu) => {
        const isExpanded = expandedId === edu.id
        return (
          <div
            key={edu.id}
            onClick={() => setExpandedId(isExpanded ? null : edu.id)}
            style={{
              border: `1px solid ${t.border}`,
              borderRadius: 12,
              padding: 16,
              background: t.bgSidebar,
              boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              gap: 8,
              cursor: "pointer",
              transition: "all 0.22s ease-in-out",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700 }}>
                  {edu.institution}
                </h3>
                <div style={{ fontSize: "0.8rem", color: t.textMuted, marginTop: 2 }}>
                  {edu.degree}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                <span style={{ fontSize: "0.68rem", color: t.textFaint, fontWeight: 500 }}>
                  {edu.period}
                </span>
                <span style={{ fontSize: "0.8rem", color: t.isDark ? "#4ade80" : "#2563eb" }}>
                  {isExpanded ? "▲" : "▼"}
                </span>
              </div>
            </div>

            {/* Expanded section details */}
            {isExpanded && edu.relevant && edu.relevant.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  paddingTop: 10,
                  borderTop: `1px solid ${t.border}`,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  animation: "fadeIn 0.2s ease-in-out",
                }}
              >
                <style>{`
                  @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-4px); }
                    to { opacity: 1; transform: translateY(0); }
                  }
                `}</style>
                <div style={{ fontSize: "0.72rem", fontWeight: 600, color: t.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Curriculum & Technologies
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {edu.relevant.map((skill) => (
                    <span
                      key={skill}
                      style={{
                        background: t.isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                        border: `1px solid ${t.border}`,
                        borderRadius: 4,
                        padding: "2px 6px",
                        fontSize: "0.65rem",
                        color: t.text,
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
