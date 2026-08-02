import { useState, useMemo } from "react"
import { PROJECTS, EXPERIENCE, EDUCATION } from "@/content/data"
import { useTheme } from "@/context/ThemeContext"

type Section = "projects" | "experience" | "education"
type FileExplorerProps = {
  section: Section
  openWindow?: (appId: any, params?: any) => void
}

/* ── File type icons (SVGs) ── */
function FolderIcon() {
  return (
    <svg width="40" height="34" viewBox="0 0 44 38" fill="none">
      <path
        d="M2 8C2 5.8 3.8 4 6 4H17L20 8H38C40.2 8 42 9.8 42 12V32C42 34.2 40.2 36 38 36H6C3.8 36 2 34.2 2 32V8Z"
        fill="#3b82f6"
        fillOpacity="0.85"
      />
      <path
        d="M2 12H42V32C42 34.2 40.2 36 38 36H6C3.8 36 2 34.2 2 32V12Z"
        fill="#4f46e5"
      />
    </svg>
  )
}

function FileTextIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(30, 41, 59, 0.5)" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function FileImageIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#f472b6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="rgba(80, 20, 50, 0.4)" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  )
}

function FileCodeIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" fill="rgba(60, 40, 10, 0.4)" />
      <polyline points="14 2 14 8 20 8" />
      <path d="M8 13a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1V9.5A1.5 1.5 0 0 0 9.5 8h-.5" />
      <path d="M8 15a1 1 0 0 0 1 1h1a1 1 0 0 1 1 1v1.5A1.5 1.5 0 0 1 9.5 20h-.5" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" fill="rgba(10, 50, 30, 0.4)" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

type FileItem = {
  name: string
  type: "file" | "folder" | "url" | "image" | "json" | "markdown"
  content?: string
  url?: string
  imageSrc?: string
  children?: FileItem[]
}

const col: React.CSSProperties = { display: "flex", flexDirection: "column", overflow: "hidden" }
const row: React.CSSProperties = { display: "flex", alignItems: "center", gap: 8 }

function Tag({ label }: { label: string }) {
  const t = useTheme()
  return (
    <span
      style={{
        background: t.isDark ? "rgba(74,222,128,0.1)" : "rgba(22,163,74,0.08)",
        color: t.isDark ? "#4ade80" : "#16a34a",
        border: t.isDark ? "1px solid rgba(74,222,128,0.2)" : "1px solid rgba(22,163,74,0.15)",
        borderRadius: 4,
        padding: "1px 7px",
        fontSize: "0.7rem",
        fontFamily: "'JetBrains Mono', monospace",
        whiteSpace: "nowrap",
        transition: t.transition,
      }}
    >
      {label}
    </span>
  )
}

/* ── Helper to build folder structures for projects ── */
const buildProjectFiles = (project: typeof PROJECTS[0]): FileItem[] => {
  const files: FileItem[] = [
    {
      name: "README.md",
      type: "markdown",
      content: `# ${project.name}

${project.description}

## Technologies
${project.technologies.map(t => `- ${t}`).join("\n")}

## Details
- Year: ${project.year}
- Status: ${project.status}
`
    },
    {
      name: "Technologies.json",
      type: "json",
      content: JSON.stringify(project.technologies, null, 2)
    },
    {
      name: "GitHub.url",
      type: "url",
      url: project.github
    }
  ]

  if (project.demo) {
    files.push({
      name: "Live Demo.url",
      type: "url",
      url: project.demo
    })
  }

  // Preview Image
  const previewImg = project.image || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&h=600&fit=crop&auto=format"
  files.push({
    name: "Preview.png",
    type: "image",
    imageSrc: previewImg
  })

  // Screenshots Subfolder
  const screenshotsList: FileItem[] = [
    {
      name: "home.png",
      type: "image",
      imageSrc: previewImg
    }
  ]

  // Add extra mockup screenshots based on project
  if (project.id === "neural-canvas") {
    screenshotsList.push(
      { name: "canvas.png", type: "image", imageSrc: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&h=600&fit=crop&auto=format" },
      { name: "details.png", type: "image", imageSrc: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&h=600&fit=crop&auto=format" }
    )
  } else if (project.id === "void-sync") {
    screenshotsList.push(
      { name: "editor.png", type: "image", imageSrc: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=900&h=600&fit=crop&auto=format" }
    )
  } else if (project.id === "spectral") {
    screenshotsList.push(
      { name: "visualizer.png", type: "image", imageSrc: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=900&h=600&fit=crop&auto=format" }
    )
  } else {
    screenshotsList.push(
      { name: "terminal.png", type: "image", imageSrc: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=900&h=600&fit=crop&auto=format" }
    )
  }

  files.push({
    name: "Screenshots",
    type: "folder",
    children: screenshotsList
  })

  return files
}

/* ── Projects Explorer ── */
function ProjectsExplorer({
  openWindow,
  currentPath,
  setCurrentPath
}: {
  openWindow?: (appId: any, params?: any) => void
  currentPath: string[]
  setCurrentPath: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const t = useTheme()
  const [selectedItem, setSelectedItem] = useState<string | null>(null)

  // Construct virtual folder structure
  const displayItems = useMemo((): FileItem[] => {
    if (currentPath.length === 0) {
      // Root level: show project folders + Archive
      const rootFolders: FileItem[] = PROJECTS.map(p => ({
        name: p.name,
        type: "folder",
        children: buildProjectFiles(p)
      }))
      rootFolders.push({
        name: "Archive",
        type: "folder",
        children: [
          {
            name: "restricted.tar.gz",
            type: "file",
            content: "Classification restricted. [EPERM: 0x4F]\n\nUnauthorized decryption attempt logged."
          }
        ]
      })
      return rootFolders
    }

    if (currentPath.length === 1) {
      const projId = currentPath[0]
      if (projId === "Archive") {
        return [
          {
            name: "restricted.tar.gz",
            type: "file",
            content: "Classification restricted. [EPERM: 0x4F]\n\nUnauthorized decryption attempt logged."
          }
        ]
      }
      const project = PROJECTS.find(p => p.name === projId)
      if (project) {
        return buildProjectFiles(project)
      }
    }

    if (currentPath.length === 2) {
      const [projId, subFolder] = currentPath
      if (projId === "Archive") return []
      const project = PROJECTS.find(p => p.name === projId)
      if (project) {
        const files = buildProjectFiles(project)
        const folder = files.find(f => f.name === subFolder && f.type === "folder")
        if (folder && folder.children) {
          return folder.children
        }
      }
    }

    return []
  }, [currentPath])

  const handleItemClick = (e: React.MouseEvent, name: string) => {
    e.stopPropagation()
    setSelectedItem(name)
  }

  const handleItemDoubleClick = (item: FileItem) => {
    if (item.type === "folder") {
      setCurrentPath(prev => [...prev, item.name])
      setSelectedItem(null)
    } else if (item.type === "url" && item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer")
    } else if (item.type === "markdown" || item.type === "json" || item.type === "file") {
      if (openWindow) {
        openWindow("editor", { content: item.content, title: item.name })
      }
    } else if (item.type === "image" && item.imageSrc) {
      if (openWindow) {
        openWindow("gallery", { imageSrc: item.imageSrc })
      }
    }
  }

  const renderItemIcon = (item: FileItem) => {
    switch (item.type) {
      case "folder": return <FolderIcon />
      case "markdown": return <FileTextIcon />
      case "json": return <FileCodeIcon />
      case "image": return <FileImageIcon />
      case "url": return <LinkIcon />
      default: return <FileTextIcon />
    }
  }

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", transition: t.transition }}>
      {/* Sidebar */}
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: t.bgSidebar,
          borderRight: "1px solid " + t.border,
          ...col,
          transition: t.transition,
        }}
      >
        <div
          style={{
            padding: "10px 14px 6px",
            color: t.textFaint,
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: t.transition,
          }}
        >
          Navigation
        </div>

        {/* All Projects / Root Sidebar button */}
        <div
          onClick={() => {
            setCurrentPath([])
            setSelectedItem(null)
          }}
          style={{
            padding: "7px 14px",
            cursor: "default",
            background: currentPath.length === 0
              ? (t.isDark ? "rgba(74,222,128,0.08)" : "rgba(37,99,235,0.08)")
              : "transparent",
            borderLeft: currentPath.length === 0
              ? (t.isDark ? "2px solid #4ade80" : "2px solid #2563eb")
              : "2px solid transparent",
            display: "flex",
            alignItems: "center",
            gap: 8,
            transition: t.transition,
          }}
          onMouseEnter={e => {
            if (currentPath.length !== 0) e.currentTarget.style.background = t.bgHover
          }}
          onMouseLeave={e => {
            if (currentPath.length !== 0) e.currentTarget.style.background = "transparent"
          }}
        >
          <FolderIcon />
          <span style={{ color: currentPath.length === 0 ? t.text : t.textMuted, fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace", transition: t.transition }}>
            All Projects
          </span>
        </div>

        {/* Individual Project Sidebar buttons */}
        {PROJECTS.map(p => {
          const isActive = currentPath[0] === p.name
          return (
            <div
              key={p.id}
              onClick={() => {
                setCurrentPath([p.name])
                setSelectedItem(null)
              }}
              style={{
                padding: "7px 14px",
                cursor: "default",
                background: isActive
                  ? (t.isDark ? "rgba(74,222,128,0.08)" : "rgba(37,99,235,0.08)")
                  : "transparent",
                borderLeft: isActive
                  ? (t.isDark ? "2px solid #4ade80" : "2px solid #2563eb")
                  : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: t.transition,
              }}
              onMouseEnter={e => {
                if (!isActive) e.currentTarget.style.background = t.bgHover
              }}
              onMouseLeave={e => {
                if (!isActive) e.currentTarget.style.background = "transparent"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 16 14" fill="none">
                <path
                  d="M1 3C1 2.2 1.6 1.5 2.4 1.5H6.5L7.5 3H13.6C14.4 3 15 3.7 15 4.5V11.5C15 12.3 14.4 13 13.6 13H2.4C1.6 13 1 12.3 1 11.5V3Z"
                  fill={t.isDark ? "#4a9eff" : "#2563eb"}
                  fillOpacity="0.75"
                />
              </svg>
              <span
                style={{
                  color: isActive ? t.text : t.textMuted,
                  fontSize: "0.78rem",
                  fontFamily: "'JetBrains Mono', monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  transition: t.transition,
                }}
              >
                {p.name}
              </span>
            </div>
          )
        })}

        {/* Sidebar Archive */}
        <div
          onClick={() => {
            setCurrentPath(["Archive"])
            setSelectedItem(null)
          }}
          style={{
            padding: "7px 14px",
            cursor: "default",
            marginTop: "auto",
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: currentPath[0] === "Archive" ? t.bgHover : "transparent",
            borderLeft: currentPath[0] === "Archive" ? "2px solid " + t.borderStrong : "2px solid transparent",
            transition: t.transition,
          }}
          onMouseEnter={e => {
            if (currentPath[0] !== "Archive") e.currentTarget.style.background = t.bgHover
          }}
          onMouseLeave={e => {
            if (currentPath[0] !== "Archive") e.currentTarget.style.background = "transparent"
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 14" fill="none">
            <path
              d="M1 3C1 2.2 1.6 1.5 2.4 1.5H6.5L7.5 3H13.6C14.4 3 15 3.7 15 4.5V11.5C15 12.3 14.4 13 13.6 13H2.4C1.6 13 1 12.3 1 11.5V3Z"
              fill={t.isDark ? "#555" : "#888"}
            />
          </svg>
          <span style={{ color: t.textFaint, fontSize: "0.8rem", fontFamily: "'JetBrains Mono', monospace", transition: t.transition }}>
            Archive
          </span>
        </div>
      </div>

      {/* Main Folder Grid */}
      <div
        onClick={() => setSelectedItem(null)}
        style={{
          flex: 1,
          padding: "20px 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
          gap: 16,
          alignContent: "start",
          overflowY: "auto",
          background: t.bg,
          transition: t.transition,
        }}
      >
        {displayItems.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", color: t.textFaint, fontSize: "0.8rem", marginTop: 40, fontFamily: "'JetBrains Mono', monospace", transition: t.transition }}>
            Empty Folder
          </div>
        ) : (
          displayItems.map(item => {
            const isSelected = selectedItem === item.name
            return (
              <div
                key={item.name}
                onClick={e => handleItemClick(e, item.name)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 6px",
                  borderRadius: 6,
                  cursor: "default",
                  background: isSelected
                    ? (t.isDark ? "rgba(59, 130, 246, 0.16)" : "rgba(37, 99, 235, 0.12)")
                    : "transparent",
                  border: isSelected
                    ? (t.isDark ? "1px solid rgba(59, 130, 246, 0.4)" : "1px solid rgba(37, 99, 235, 0.3)")
                    : "1px solid transparent",
                  transition: t.transition,
                  minWidth: 84,
                  maxWidth: 110,
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = t.bgHover
                    e.currentTarget.style.borderColor = t.border
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.background = "transparent"
                    e.currentTarget.style.borderColor = "transparent"
                  }
                }}
              >
                <div style={{ pointerEvents: "none" }}>{renderItemIcon(item)}</div>
                <span
                  style={{
                    color: isSelected ? t.text : t.textMuted,
                    fontSize: "0.74rem",
                    fontFamily: "'JetBrains Mono', monospace",
                    textAlign: "center",
                    wordBreak: "break-word",
                    maxWidth: "100%",
                    lineHeight: 1.3,
                    userSelect: "none",
                    transition: t.transition,
                  }}
                >
                  {item.name}
                </span>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

/* ── Experience Explorer (Original Details Layout) ── */
function ExperienceExplorer() {
  const t = useTheme()
  const [selected, setSelected] = useState(EXPERIENCE[0].id)
  const item = EXPERIENCE.find(e => e.id === selected)

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: t.bg, transition: t.transition }}>
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: t.bgSidebar,
          borderRight: "1px solid " + t.border,
          ...col,
          transition: t.transition,
        }}
      >
        <div
          style={{
            padding: "10px 14px 6px",
            color: t.textFaint,
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: t.transition,
          }}
        >
          Experience
        </div>
        {EXPERIENCE.map(e => {
          const isActive = selected === e.id
          return (
            <div
              key={e.id}
              onClick={() => setSelected(e.id)}
              style={{
                padding: "8px 14px",
                cursor: "default",
                background: isActive
                  ? (t.isDark ? "rgba(167,139,250,0.08)" : "rgba(124,58,237,0.08)")
                  : "transparent",
                borderLeft: isActive
                  ? (t.isDark ? "2px solid #a78bfa" : "2px solid #7c3aed")
                  : "2px solid transparent",
                transition: t.transition,
              }}
              onMouseEnter={ev => {
                if (!isActive) ev.currentTarget.style.background = t.bgHover
              }}
              onMouseLeave={ev => {
                if (!isActive) ev.currentTarget.style.background = "transparent"
              }}
            >
              <div style={{ color: isActive ? t.text : t.textMuted, fontSize: "0.79rem", fontWeight: 500, transition: t.transition }}>
                {e.company}
              </div>
              <div style={{ color: t.textFaint, fontSize: "0.72rem", marginTop: 1, transition: t.transition }}>
                {e.period.split(" — ")[0]}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, ...col, overflowY: "auto", padding: "24px 28px" }}>
        {item && (
          <div style={{ ...col, gap: 18 }}>
            <div>
              <div style={{ ...row, gap: 10, flexWrap: "wrap", justifyContent: "space-between" }}>
                <h2 style={{ margin: 0, color: t.text, fontWeight: 600, fontSize: "1.1rem", transition: t.transition }}>
                  {item.role}
                </h2>
                <span style={{ color: t.textFaint, fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace", transition: t.transition }}>
                  {item.period}
                </span>
              </div>
              <div style={{ color: t.isDark ? "#a78bfa" : "#7c3aed", fontSize: "0.85rem", marginTop: 4, transition: t.transition }}>
                {item.company} · {item.location}
              </div>
            </div>

            <p style={{ color: t.textMuted, fontSize: "0.85rem", lineHeight: 1.7, margin: 0, transition: t.transition }}>
              {item.description}
            </p>

            <div>
              <div style={{ color: t.textFaint, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8, transition: t.transition }}>
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

/* ── Education Explorer (Original Details Layout) ── */
function EducationExplorer() {
  const t = useTheme()
  const [selected, setSelected] = useState(EDUCATION[0].id)
  const item = EDUCATION.find(e => e.id === selected)

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden", background: t.bg, transition: t.transition }}>
      <div
        style={{
          width: 200,
          flexShrink: 0,
          background: t.bgSidebar,
          borderRight: "1px solid " + t.border,
          ...col,
          transition: t.transition,
        }}
      >
        <div
          style={{
            padding: "10px 14px 6px",
            color: t.textFaint,
            fontSize: "0.68rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            transition: t.transition,
          }}
        >
          Education
        </div>
        {EDUCATION.map(e => {
          const isActive = selected === e.id
          return (
            <div
              key={e.id}
              onClick={() => setSelected(e.id)}
              style={{
                padding: "8px 14px",
                cursor: "default",
                background: isActive
                  ? (t.isDark ? "rgba(251,191,36,0.08)" : "rgba(217,119,6,0.08)")
                  : "transparent",
                borderLeft: isActive
                  ? (t.isDark ? "2px solid #fbbf24" : "2px solid #d97706")
                  : "2px solid transparent",
                transition: t.transition,
              }}
              onMouseEnter={ev => {
                if (!isActive) ev.currentTarget.style.background = t.bgHover
              }}
              onMouseLeave={ev => {
                if (!isActive) ev.currentTarget.style.background = "transparent"
              }}
            >
              <div style={{ color: isActive ? t.text : t.textMuted, fontSize: "0.79rem", fontWeight: 500, transition: t.transition }}>
                {e.degree}
              </div>
              <div style={{ color: t.textFaint, fontSize: "0.72rem", marginTop: 1, transition: t.transition }}>
                {e.period}
              </div>
            </div>
          )
        })}
      </div>

      <div style={{ flex: 1, ...col, overflowY: "auto", padding: "24px 28px" }}>
        {item && (
          <div style={{ ...col, gap: 18 }}>
            <div>
              <h2 style={{ margin: 0, color: t.text, fontWeight: 600, fontSize: "1.1rem", transition: t.transition }}>
                {item.degree}
              </h2>
              <div style={{ color: t.isDark ? "#fbbf24" : "#d97706", fontSize: "0.85rem", marginTop: 4, transition: t.transition }}>
                {item.institution} · {item.period}
              </div>
              {item.gpa && (
                <div style={{ color: t.textMuted, fontSize: "0.78rem", marginTop: 4, fontFamily: "'JetBrains Mono', monospace", transition: t.transition }}>
                  GPA: {item.gpa}
                </div>
              )}
            </div>

            {item.relevant.length > 0 && (
              <div>
                <div style={{ color: t.textFaint, fontSize: "0.7rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 8, transition: t.transition }}>
                  Relevant Coursework
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {item.relevant.map(r => (
                    <span
                      key={r}
                      style={{
                        background: t.isDark ? "rgba(251,191,36,0.08)" : "rgba(217,119,6,0.06)",
                        color: t.isDark ? "rgba(251,191,36,0.8)" : "#d97706",
                        border: t.isDark ? "1px solid rgba(251,191,36,0.18)" : "1px solid rgba(217,119,6,0.15)",
                        borderRadius: 4,
                        padding: "2px 8px",
                        fontSize: "0.75rem",
                        transition: t.transition,
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

/* ── Toolbar with Interactive Breadcrumbs and Back Button ── */
function Toolbar({
  path,
  currentPath,
  setCurrentPath
}: {
  path: string
  currentPath: string[]
  setCurrentPath: React.Dispatch<React.SetStateAction<string[]>>
}) {
  const t = useTheme()
  const canGoBack = currentPath.length > 0

  const handleBackClick = () => {
    if (canGoBack) {
      setCurrentPath(prev => prev.slice(0, -1))
    }
  }

  const handleBreadcrumbClick = (index: number) => {
    if (index === -1) {
      setCurrentPath([])
    } else {
      setCurrentPath(prev => prev.slice(0, index + 1))
    }
  }

  return (
    <div
      style={{
        height: 36,
        flexShrink: 0,
        background: t.bgToolbar,
        borderBottom: "1px solid " + t.border,
        display: "flex",
        alignItems: "center",
        padding: "0 12px",
        gap: 8,
        userSelect: "none",
        transition: t.transition,
      }}
    >
      {/* Back button */}
      <button
        disabled={!canGoBack}
        onClick={handleBackClick}
        style={{
          background: "transparent",
          border: "none",
          cursor: canGoBack ? "pointer" : "default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 4,
          borderRadius: 4,
          color: canGoBack ? t.text : t.textFaint,
          transition: t.transition,
        }}
        onMouseEnter={e => {
          if (canGoBack) e.currentTarget.style.background = t.bgHover
        }}
        onMouseLeave={e => {
          if (canGoBack) e.currentTarget.style.background = "transparent"
        }}
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </button>

      {/* Forward placeholder icon */}
      <div style={{ color: t.textFaint, padding: 4, transition: t.transition }}>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </div>

      {/* Path Breadcrumbs Display */}
      <div
        style={{
          flex: 1,
          background: t.bgInput,
          border: "1px solid " + t.border,
          borderRadius: 4,
          padding: "3px 10px",
          color: t.textMuted,
          fontSize: "0.75rem",
          fontFamily: "'JetBrains Mono', monospace",
          marginLeft: 6,
          display: "flex",
          alignItems: "center",
          gap: 4,
          transition: t.transition,
        }}
      >
        <span style={{ color: t.textFaint, transition: t.transition }}>~/desktop/</span>
        
        {/* Main section tag (e.g. projects) */}
        <span
          onClick={() => handleBreadcrumbClick(-1)}
          style={{
            color: currentPath.length === 0 ? t.textMuted : (t.isDark ? "#4ade80" : "#16a34a"),
            cursor: "pointer",
            transition: t.transition,
          }}
          onMouseEnter={e => e.currentTarget.style.textDecoration = "underline"}
          onMouseLeave={e => e.currentTarget.style.textDecoration = "none"}
        >
          {path}
        </span>

        {currentPath.map((seg, i) => {
          const isLast = i === currentPath.length - 1
          return (
            <div key={seg} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: t.textFaint, transition: t.transition }}>/</span>
              <span
                onClick={() => !isLast && handleBreadcrumbClick(i)}
                style={{
                  color: isLast ? t.text : (t.isDark ? "#3b82f6" : "#2563eb"),
                  cursor: isLast ? "default" : "pointer",
                  transition: t.transition,
                }}
                onMouseEnter={e => {
                  if (!isLast) e.currentTarget.style.textDecoration = "underline"
                }}
                onMouseLeave={e => {
                  if (!isLast) e.currentTarget.style.textDecoration = "none"
                }}
              >
                {seg}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FileExplorer({ section, openWindow }: FileExplorerProps) {
  const t = useTheme()
  const [currentPath, setCurrentPath] = useState<string[]>([])

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", background: t.bg, transition: t.transition }}>
      <Toolbar path={section} currentPath={currentPath} setCurrentPath={setCurrentPath} />
      {section === "projects" && (
        <ProjectsExplorer
          openWindow={openWindow}
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
      )}
      {section === "experience" && <ExperienceExplorer />}
      {section === "education" && <EducationExplorer />}
    </div>
  )
}
