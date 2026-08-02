import { useState, useRef, useEffect, KeyboardEvent } from "react"

type Line = { type: "input" | "output" | "error" | "blank"; text: string }

const HOSTNAME = "hyk@localhost"

const FS: Record<string, Record<string, string>> = {
  "~": {
    "projects/":    "directory",
    "experience/":  "directory",
    "gallery/":     "directory",
    "???/":         "directory",
    ".bashrc":      "file",
    ".gitconfig":   "file",
  },
  "~/projects": {
    "neural-canvas/": "directory",
    "void-sync/":     "directory",
    "spectral/":      "directory",
    "kernel-drift/":  "directory",
  },
  "~/experience": {
    "meridian-systems.md":  "file",
    "university-ml-lab.md": "file",
    "freelance.md":         "file",
  },
  "~/gallery": {
    "workspace.jpg":     "file",
    "debugging-2am.jpg": "file",
    "hardware.jpg":      "file",
    "neural-canvas-47.png": "file",
  },
}

const FILE_CONTENTS: Record<string, string> = {
  ".bashrc": "# ~/.bashrc\nexport PATH=$PATH:~/.local/bin\nalias ll='ls -la'\nalias gs='git status'",
  ".gitconfig": "[user]\n  name = HYK\n  email = hyk@localhost\n[core]\n  editor = nvim",
  "meridian-systems.md": "# Meridian Systems\nRole: Software Engineering Intern\nPeriod: May 2024 — Aug 2024\nReduced deploy pipeline by 34%.",
  "university-ml-lab.md": "# University ML Lab\nRole: Research Assistant\nPeriod: Sep 2023 — Apr 2024\nLoRA adapter training. NeurIPS workshop paper.",
  "freelance.md": "# Independent\nRole: Freelance Developer\nPeriod: Jun 2022 — Aug 2023\n6 clients. 100% on-time delivery.",
}

function processCommand(cmd: string, cwd: string): { output: Line[]; nextCwd?: string } {
  const parts = cmd.trim().split(/\s+/)
  const bin = parts[0]
  const args = parts.slice(1)

  if (!bin) return { output: [{ type: "blank", text: "" }] }

  switch (bin) {
    case "clear":
      return { output: [{ type: "blank", text: "__CLEAR__" }] }

    case "pwd":
      return { output: [{ type: "output", text: cwd.replace("~", "/home/hyk") }] }

    case "whoami":
      return { output: [{ type: "output", text: "hyk" }] }

    case "uname": {
      if (args[0] === "-a") {
        return { output: [{ type: "output", text: "Linux localhost 6.8.0-hyk #1 SMP x86_64 GNU/Linux" }] }
      }
      return { output: [{ type: "output", text: "Linux" }] }
    }

    case "echo":
      return { output: [{ type: "output", text: args.join(" ") }] }

    case "date":
      return { output: [{ type: "output", text: new Date().toString() }] }

    case "ls": {
      const dir = FS[cwd] ?? {}
      const long = args.includes("-la") || args.includes("-l")
      if (long) {
        const lines: Line[] = [
          { type: "output", text: `total ${Object.keys(dir).length}` },
        ]
        for (const name of Object.keys(dir)) {
          const isDir = name.endsWith("/")
          lines.push({
            type: "output",
            text: `${isDir ? "d" : "-"}rwxr-xr-x  hyk  hyk  ${isDir ? "4096" : "  256"} Jul 31 02:17 ${name}`,
          })
        }
        return { output: lines }
      }
      const text = Object.keys(dir).join("  ")
      return { output: [{ type: "output", text: text || "(empty)" }] }
    }

    case "cd": {
      const target = args[0] ?? "~"
      if (target === "~" || target === "") {
        return { output: [], nextCwd: "~" }
      }
      if (target === "..") {
        const parent = cwd.split("/").slice(0, -1).join("/") || "~"
        return { output: [], nextCwd: parent }
      }
      if (target === "???") {
        return {
          output: [
            { type: "error", text: "cd: ???: Permission denied" },
            { type: "error", text: "[errno: EPERM] Access restricted." },
          ],
        }
      }
      const fullPath = `${cwd}/${target.replace("/", "")}`
      const normalised = fullPath.replace("~//", "~/").replace(/\/$/, "")
      if (FS[normalised] !== undefined) {
        return { output: [], nextCwd: normalised }
      }
      return { output: [{ type: "error", text: `cd: ${target}: No such file or directory` }] }
    }

    case "cat": {
      const file = args[0]
      if (!file) return { output: [{ type: "error", text: "cat: missing operand" }] }
      const content = FILE_CONTENTS[file]
      if (!content) {
        return { output: [{ type: "error", text: `cat: ${file}: No such file or directory` }] }
      }
      return {
        output: content.split("\n").map(line => ({ type: "output" as const, text: line })),
      }
    }

    case "sudo": {
      if (args.join(" ").includes("rm -rf")) {
        return { output: [{ type: "error", text: "sudo: Permission denied. Nice try." }] }
      }
      return { output: [{ type: "error", text: `sudo: ${args[0]}: command not found` }] }
    }

    case "git":
      return { output: [{ type: "output", text: "fatal: not a git repository (use 'cd' into a project first)" }] }

    case "nvim":
    case "vim":
    case "nano":
      return { output: [{ type: "error", text: `${bin}: GUI not available in this terminal. Use the editor application.` }] }

    case "htop":
    case "top":
      return { output: [{ type: "error", text: "Some processes are not visible here. By design." }] }

    case "help":
      return {
        output: [
          { type: "output", text: "Available commands:" },
          { type: "output", text: "  ls [-la]    list directory contents" },
          { type: "output", text: "  cd [dir]    change directory" },
          { type: "output", text: "  pwd         print working directory" },
          { type: "output", text: "  cat [file]  print file contents" },
          { type: "output", text: "  echo [...]  print arguments" },
          { type: "output", text: "  whoami      current user" },
          { type: "output", text: "  uname -a    system info" },
          { type: "output", text: "  date        current date" },
          { type: "output", text: "  clear       clear terminal" },
          { type: "output", text: "  help        this message" },
        ],
      }

    default:
      return { output: [{ type: "error", text: `${bin}: command not found` }] }
  }
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "HYK OS  —  v1.0.0-stable" },
    { type: "output", text: 'Type "help" for available commands.' },
    { type: "blank", text: "" },
  ])
  const [input, setInput] = useState("")
  const [cwd, setCwd] = useState("~")
  const [history, setHistory] = useState<string[]>([])
  const [histIdx, setHistIdx] = useState(-1)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const submit = () => {
    const cmd = input.trim()
    const prompt: Line = { type: "input", text: `${HOSTNAME}:${cwd}$ ${cmd}` }

    if (!cmd) {
      setLines(l => [...l, prompt, { type: "blank", text: "" }])
      setInput("")
      return
    }

    const { output, nextCwd } = processCommand(cmd, cwd)

    if (output[0]?.text === "__CLEAR__") {
      setLines([])
    } else {
      setLines(l => [...l, prompt, ...output, { type: "blank", text: "" }])
    }

    if (nextCwd !== undefined) setCwd(nextCwd)
    setHistory(h => [cmd, ...h])
    setHistIdx(-1)
    setInput("")
  }

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      submit()
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      const idx = Math.min(histIdx + 1, history.length - 1)
      setHistIdx(idx)
      setInput(history[idx] ?? "")
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      const idx = Math.max(histIdx - 1, -1)
      setHistIdx(idx)
      setInput(idx === -1 ? "" : history[idx])
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      style={{
        flex: 1,
        background: "#141416",
        padding: "12px 16px",
        overflowY: "auto",
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "0.82rem",
        lineHeight: 1.6,
        color: "#e0e0e0",
        cursor: "text",
      }}
    >
      {lines.map((line, i) => {
        if (line.type === "blank") return <div key={i} style={{ height: "0.4em" }} />
        return (
          <div
            key={i}
            style={{
              color:
                line.type === "input"
                  ? "rgba(255,255,255,0.85)"
                  : line.type === "error"
                  ? "#f87171"
                  : "rgba(255,255,255,0.55)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {line.type === "input" && (
              <span style={{ color: "#4ade80" }}>{line.text.split("$")[0]}$</span>
            )}
            {line.type === "input"
              ? <span>{" " + line.text.split("$ ").slice(1).join("$ ")}</span>
              : line.text}
          </div>
        )
      })}

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
        <span style={{ color: "#4ade80", marginRight: 4, whiteSpace: "nowrap" }}>
          {HOSTNAME}:{cwd}$
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          autoFocus
          spellCheck={false}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e0e0e0",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            caretColor: "#4ade80",
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
