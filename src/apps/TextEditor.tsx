import { useState } from "react"
import { useTheme } from "@/context/ThemeContext"

type Props = {
  content?: string
  title?: string
}

export default function TextEditor({
  content: initialContent = "",
  title = "untitled.txt",
}: Props) {
  const t = useTheme()
  const [content, setContent] = useState(initialContent)
  const [mode, setMode] = useState<"edit" | "preview">(
    title.endsWith(".md") ? "preview" : "edit",
  )

  // Simple Markdown parser for previewing README.md files
  const renderMarkdown = (text: string) => {
    const lines = text.split("\n")
    return lines.map((line, index) => {
      // Headers
      if (line.startsWith("# ")) {
        return (
          <h1
            key={index}
            style={{
              color: t.text,
              fontSize: "1.5rem",
              fontWeight: 600,
              borderBottom: "1px solid " + t.border,
              paddingBottom: 6,
              margin: "18px 0 10px",
              transition: t.transition,
            }}
          >
            {line.slice(2)}
          </h1>
        )
      }
      if (line.startsWith("## ")) {
        return (
          <h2
            key={index}
            style={{
              color: t.text,
              fontSize: "1.2rem",
              fontWeight: 600,
              margin: "14px 0 8px",
              transition: t.transition,
            }}
          >
            {line.slice(3)}
          </h2>
        )
      }
      if (line.startsWith("### ")) {
        return (
          <h3
            key={index}
            style={{
              color: t.text,
              fontSize: "1.05rem",
              fontWeight: 500,
              margin: "12px 0 6px",
              transition: t.transition,
            }}
          >
            {line.slice(4)}
          </h3>
        )
      }
      // List items
      if (line.startsWith("- ")) {
        return (
          <li
            key={index}
            style={{
              color: t.textMuted,
              fontSize: "0.82rem",
              marginLeft: 16,
              marginBottom: 4,
              lineHeight: 1.5,
              transition: t.transition,
            }}
          >
            {line.slice(2)}
          </li>
        )
      }
      // Empty lines
      if (line.trim() === "") {
        return <div key={index} style={{ height: 8 }} />
      }
      // Paragraphs
      return (
        <p
          key={index}
          style={{
            color: t.textMuted,
            fontSize: "0.82rem",
            lineHeight: 1.6,
            margin: "6px 0",
            transition: t.transition,
          }}
        >
          {line}
        </p>
      )
    })
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        background: t.bg,
        overflow: "hidden",
        height: "100%",
        transition: t.transition,
      }}
    >
      {/* Editor top bar */}
      <div
        style={{
          height: 36,
          background: t.bgToolbar,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1px solid " + t.border,
          userSelect: "none",
          flexShrink: 0,
          transition: t.transition,
        }}
      >
        <span
          style={{
            color: t.textMuted,
            fontSize: "0.72rem",
            fontFamily: "'JetBrains Mono', monospace",
            transition: t.transition,
          }}
        >
          {title}
        </span>
        {title.endsWith(".md") && (
          <div
            style={{
              display: "flex",
              background: t.bgInput,
              borderRadius: 4,
              padding: 2,
              transition: t.transition,
            }}
          >
            <button
              onClick={() => setMode("edit")}
              style={{
                background:
                  mode === "edit"
                    ? t.isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)"
                    : "transparent",
                color:
                  mode === "edit"
                    ? t.isDark
                      ? "#4ade80"
                      : "#2563eb"
                    : t.textFaint,
                border: "none",
                borderRadius: 3,
                padding: "2px 8px",
                fontSize: "0.68rem",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: t.transition,
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setMode("preview")}
              style={{
                background:
                  mode === "preview"
                    ? t.isDark
                      ? "rgba(255,255,255,0.08)"
                      : "rgba(0,0,0,0.06)"
                    : "transparent",
                color:
                  mode === "preview"
                    ? t.isDark
                      ? "#4ade80"
                      : "#2563eb"
                    : t.textFaint,
                border: "none",
                borderRadius: 3,
                padding: "2px 8px",
                fontSize: "0.68rem",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
                transition: t.transition,
              }}
            >
              Preview
            </button>
          </div>
        )}
      </div>

      {/* Editor area */}
      <div style={{ flex: 1, overflow: "auto", display: "flex" }}>
        {mode === "edit" ? (
          <div
            style={{
              display: "flex",
              width: "100%",
              height: "100%",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "0.82rem",
            }}
          >
            {/* Line Numbers Gutter */}
            <div
              style={{
                width: 42,
                background: t.bgSidebar,
                borderRight: "1px solid " + t.border,
                padding: "12px 0",
                color: t.textFaint,
                textAlign: "right",
                paddingRight: 10,
                userSelect: "none",
                boxSizing: "border-box",
                lineHeight: 1.5,
                transition: t.transition,
              }}
            >
              {(content.split("\n").length > 0
                ? content.split("\n")
                : [""]
              ).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Editor textarea */}
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: t.text,
                padding: 12,
                resize: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.82rem",
                lineHeight: 1.5,
                transition: t.transition,
              }}
            />
          </div>
        ) : (
          <div
            style={{
              flex: 1,
              padding: "24px 32px",
              overflowY: "auto",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {renderMarkdown(content)}
          </div>
        )}
      </div>
    </div>
  )
}
