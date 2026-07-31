import { useState } from "react"

type Props = {
  content?: string
  title?: string
}

export default function TextEditor({ content: initialContent = "", title = "untitled.txt" }: Props) {
  const [content, setContent] = useState(initialContent)
  const [mode, setMode] = useState<"edit" | "preview">(title.endsWith(".md") ? "preview" : "edit")

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
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: 600,
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              paddingBottom: 6,
              margin: "18px 0 10px",
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
              color: "#e2e2e2",
              fontSize: "1.2rem",
              fontWeight: 600,
              margin: "14px 0 8px",
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
              color: "#d2d2d2",
              fontSize: "1.05rem",
              fontWeight: 500,
              margin: "12px 0 6px",
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
              color: "rgba(255,255,255,0.75)",
              fontSize: "0.82rem",
              marginLeft: 16,
              marginBottom: 4,
              lineHeight: 1.5,
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
            color: "rgba(255,255,255,0.75)",
            fontSize: "0.82rem",
            lineHeight: 1.6,
            margin: "6px 0",
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
        background: "#1e1e1e",
        overflow: "hidden",
        height: "100%",
      }}
    >
      {/* Editor top bar */}
      <div
        style={{
          height: 36,
          background: "#252526",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          userSelect: "none",
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: "0.72rem",
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {title}
        </span>
        {title.endsWith(".md") && (
          <div
            style={{
              display: "flex",
              background: "rgba(0,0,0,0.2)",
              borderRadius: 4,
              padding: 2,
            }}
          >
            <button
              onClick={() => setMode("edit")}
              style={{
                background: mode === "edit" ? "rgba(255,255,255,0.08)" : "transparent",
                color: mode === "edit" ? "#4ade80" : "rgba(255,255,255,0.4)",
                border: "none",
                borderRadius: 3,
                padding: "2px 8px",
                fontSize: "0.68rem",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
              }}
            >
              Edit
            </button>
            <button
              onClick={() => setMode("preview")}
              style={{
                background: mode === "preview" ? "rgba(255,255,255,0.08)" : "transparent",
                color: mode === "preview" ? "#4ade80" : "rgba(255,255,255,0.4)",
                border: "none",
                borderRadius: 3,
                padding: "2px 8px",
                fontSize: "0.68rem",
                cursor: "pointer",
                fontFamily: "'Inter', sans-serif",
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
                background: "#1e1e1e",
                borderRight: "1px solid rgba(255,255,255,0.03)",
                padding: "12px 0",
                color: "rgba(255,255,255,0.18)",
                textAlign: "right",
                paddingRight: 10,
                userSelect: "none",
                boxSizing: "border-box",
                lineHeight: 1.5,
              }}
            >
              {(content.split("\n").length > 0 ? content.split("\n") : [""]).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            {/* Editor textarea */}
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              style={{
                flex: 1,
                background: "transparent",
                border: "none",
                outline: "none",
                color: "#e2e2e2",
                padding: 12,
                resize: "none",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "0.82rem",
                lineHeight: 1.5,
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
