import { useState, useRef, useEffect, KeyboardEvent, useCallback } from "react"
import { buildTerminalProjectFilesystem } from "@/lib/projectFilesystem"

type Line = { type: "input" | "output" | "error" | "warning" | "blank"; text: string }

// Demo asks for Linux-style prompt: [one4all ~]$
const DEFAULT_HOSTNAME = "Houssam@YK"

const { fs: projectFs, contents: projectContents } =
  buildTerminalProjectFilesystem()

const FS: Record<string, Record<string, string>> = {
  "~": {
    "Projects/": "directory",
    "Gallery/": "directory",
    "???/": "directory",
    ".bashrc": "file",
    ".gitconfig": "file",
  },
  ...projectFs,
  "~/Gallery": {
    "DebuGGers/": "directory",
    "BlackWave/": "directory",
    "WorkSphere/": "directory",
  },
  "~/Gallery/DebuGGers": {
    "debuggers_1.png": "file",
    "debuggers_2.png": "file",
    "debuggers_3.png": "file",
    "debuggers_4.png": "file",
    "debuggers_5.png": "file",
  },
  "~/Gallery/BlackWave": {
    "blackwave_1.png": "file",
    "blackwave_2.png": "file",
    "blackwave_3.png": "file",
    "blackwave_4.png": "file",
    "blackwave_5.png": "file",
    "blackwave_6.png": "file",
    "blackwave_7.png": "file",
  },
  "~/Gallery/WorkSphere": {
    "worksphere_1.png": "file",
    "worksphere_2.png": "file",
    "worksphere_3.png": "file",
    "worksphere_4.png": "file",
  },
}

const FILE_CONTENTS: Record<string, string> = {
  ".bashrc":
    "# ~/.bashrc\nexport PATH=$PATH:~/.local/bin\nalias ll='ls -la'\nalias gs='git status'",
  ".gitconfig":
    "[user]\n  name = Houssam YAKHLAF\n  email = yakhlafhoussam@gmail.com\n[core]\n  editor = nvim",
  ...projectContents,
  "~/Gallery/DebuGGers/debuggers_1.png":
    "Album: DebuGGers\nFile: debuggers_1.png\nIndex: 1 of 5\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/DebuGGers/debuggers_2.png":
    "Album: DebuGGers\nFile: debuggers_2.png\nIndex: 2 of 5\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/DebuGGers/debuggers_3.png":
    "Album: DebuGGers\nFile: debuggers_3.png\nIndex: 3 of 5\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/DebuGGers/debuggers_4.png":
    "Album: DebuGGers\nFile: debuggers_4.png\nIndex: 4 of 5\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/DebuGGers/debuggers_5.png":
    "Album: DebuGGers\nFile: debuggers_5.png\nIndex: 5 of 5\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/BlackWave/blackwave_1.png":
    "Album: BlackWave\nFile: blackwave_1.png\nIndex: 1 of 7\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/BlackWave/blackwave_2.png":
    "Album: BlackWave\nFile: blackwave_2.png\nIndex: 2 of 7\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/BlackWave/blackwave_3.png":
    "Album: BlackWave\nFile: blackwave_3.png\nIndex: 3 of 7\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/BlackWave/blackwave_4.png":
    "Album: BlackWave\nFile: blackwave_4.png\nIndex: 4 of 7\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/BlackWave/blackwave_5.png":
    "Album: BlackWave\nFile: blackwave_5.png\nIndex: 5 of 7\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/BlackWave/blackwave_6.png":
    "Album: BlackWave\nFile: blackwave_6.png\nIndex: 6 of 7\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/BlackWave/blackwave_7.png":
    "Album: BlackWave\nFile: blackwave_7.png\nIndex: 7 of 7\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/WorkSphere/worksphere_1.png":
    "Album: WorkSphere\nFile: worksphere_1.png\nIndex: 1 of 4\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/WorkSphere/worksphere_2.png":
    "Album: WorkSphere\nFile: worksphere_2.png\nIndex: 2 of 4\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/WorkSphere/worksphere_3.png":
    "Album: WorkSphere\nFile: worksphere_3.png\nIndex: 3 of 4\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
  "~/Gallery/WorkSphere/worksphere_4.png":
    "Album: WorkSphere\nFile: worksphere_4.png\nIndex: 4 of 4\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.",
}


/**
 * Tokenize a shell command line, respecting single and double quotes.
 * Examples:
 *   'cat README.md'           -> ['cat', 'README.md']
 *   'cat "Live Demo.url"'     -> ['cat', 'Live Demo.url']
 *   "cat 'Live Demo.url'"     -> ['cat', 'Live Demo.url']
 *   'cd ..'                   -> ['cd', '..']
 */
function tokenize(cmd: string): string[] {
  const tokens: string[] = []
  let current = ""
  let i = 0
  while (i < cmd.length) {
    const ch = cmd[i]
    if (ch === '"' || ch === "'") {
      // Consume until matching quote (no escape handling needed for our use case)
      const quote = ch
      i++
      while (i < cmd.length && cmd[i] !== quote) {
        current += cmd[i]
        i++
      }
      i++ // skip closing quote
    } else if (ch === " " || ch === "\t") {
      if (current.length > 0) {
        tokens.push(current)
        current = ""
      }
      i++
    } else {
      current += ch
      i++
    }
  }
  if (current.length > 0) tokens.push(current)
  return tokens
}

function processCommand(
  cmd: string,
  cwd: string,
): { output: Line[]; nextCwd?: string } {
  const parts = tokenize(cmd.trim())
  const bin = parts[0]
  const args = parts.slice(1)

  if (!bin) return { output: [{ type: "blank", text: "" }] }

  switch (bin) {
    case "clear":
      return { output: [{ type: "blank", text: "__CLEAR__" }] }

    case "pwd":
      return {
        output: [{ type: "output", text: cwd.replace("~", "/home/houssam") }],
      }

    case "whoami":
      return { output: [{ type: "output", text: "HYK" }] }

    case "uname": {
      if (args[0] === "-a") {
        return {
          output: [
            {
              type: "output",
              text: "Linux localhost 6.8.0-houssam #1 SMP x86_64 GNU/Linux", /* */
            },
          ],
        }
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
            text: `${isDir ? "d" : "-"}rwxr-xr-x  houssam  houssam  ${
              isDir ? "4096" : "  256"
            } Jul 31 02:17 ${name}`,
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
      return {
        output: [
          { type: "error", text: `cd: ${target}: No such file or directory` },
        ],
      }
    }

    case "cat": {
      const file = args[0]
      if (!file)
        return { output: [{ type: "error", text: "cat: missing operand" }] }
      const cwdKey = `${cwd}/${file}`.replace(/\/+/g, "/").replace("~//", "~/")
      const content = FILE_CONTENTS[cwdKey] ?? FILE_CONTENTS[file]
      if (!content) {
        return {
          output: [
            { type: "error", text: `cat: ${file}: No such file or directory` },
          ],
        }
      }
      return {
        output: content
          .split("\n")
          .map((line) => ({ type: "output" as const, text: line })),
      }
    }

    case "sudo": {
      if (args.join(" ").includes("rm -rf")) {
        return {
          output: [
            { type: "error", text: "sudo: Permission denied. Nice try." },
          ],
        }
      }
      return {
        output: [
          { type: "error", text: `sudo: ${args[0]}: command not found` },
        ],
      }
    }

    case "git":
      return {
        output: [
          {
            type: "output",
            text: "fatal: not a git repository (use 'cd' into a project first)",
          },
        ],
      }

    case "nvim":
    case "vim":
    case "nano":
      return {
        output: [
          {
            type: "error",
            text: `${bin}: GUI not available in this terminal. Use the editor application.`,
          },
        ],
      }

    case "htop":
    case "top":
      return {
        output: [
          {
            type: "error",
            text: "Some processes are not visible here. By design.",
          },
        ],
      }

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

type CinematicAction =
  | { type: "command"; text: string }
  | { type: "output"; text: string }
  | { type: "error"; text: string }
  | { type: "warning"; text: string }
  | { type: "pause"; duration?: number }
  | { type: "blank" }

type TerminalProps = {
  autoCommands?: string[]
  demoLines?: string[]           // Legacy: for backward compatibility
  cinematicActions?: CinematicAction[]  // New: cinematic story script (no parser)
  visualOnly?: boolean
  demoAppend?: boolean
  hostname?: string
  storyId?: string
}

export default function Terminal({ autoCommands, demoLines, cinematicActions, visualOnly, demoAppend, hostname, storyId }: TerminalProps = {}) {
  if (import.meta.env.DEV) {
    console.debug("[DEBUG] Terminal mount", { hostname, demoLines, cinematicActions, demoAppend })
  }
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
  const autoRef = useRef({ started: false, commandIndex: 0, charIndex: 0, timeouts: [] as number[] })
  const cwdRef = useRef(cwd)
  const storyCompleteRef = useRef(false)
  
  // Cinematic or demo mode: story-driven, no parser
  const cinematicMode = !!cinematicActions?.length
  const demoMode = !!demoLines?.length
  const isActive = cinematicMode || demoMode

  if (visualOnly) {
    return (
      <div
        style={{
          flex: 1,
          background: "#090b0a",
          padding: 0,
          overflow: "hidden",
          fontFamily: "'JetBrains Mono', monospace",
          color: "#7ee8a0",
        }}
      >
        <div
          style={{
            height: 22,
            flex: 0,
            background: "linear-gradient(180deg,#1c1f1f,#141616)",
            display: "flex",
            alignItems: "center",
            gap: 5,
            padding: "0 8px",
            borderBottom: "1px solid rgba(80,255,140,0.12)",
          }}
        >
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#ff5f57" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#28c840" }} />
          <span
            style={{
              marginLeft: 6,
              fontSize: "10px",
              color: "rgba(126,232,160,0.7)",
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {hostname || "terminal"}
          </span>
        </div>
        <div
          style={{
            height: "calc(100% - 22px)",
            background:
              "radial-gradient(ellipse at top, rgba(70,255,140,0.07), transparent 60%), #090b0a",
            opacity: 0.95,
          }}
        />
      </div>
    )
  }

  useEffect(() => {
    cwdRef.current = cwd
  }, [cwd])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [lines])

  const submit = useCallback(
    (cmdOverride?: string) => {
      const cmd = (cmdOverride ?? input).trim()
      const prompt: Line = { type: "input", text: `[${hostname ?? DEFAULT_HOSTNAME} ${cwd}]$ ${cmd}` }

      if (!cmd) {
        setLines((l) => [...l, prompt, { type: "blank", text: "" }])
        setInput("")
        return
      }

      const { output, nextCwd } = processCommand(cmd, cwd)

      if (output[0]?.text === "__CLEAR__") {
        setLines([])
      } else {
        setLines((l) => [...l, prompt, ...output, { type: "blank", text: "" }])
      }

      if (nextCwd !== undefined) setCwd(nextCwd)
      setHistory((h) => [cmd, ...h])
      setHistIdx(-1)
      setInput("")
    },
    [cwd, input],
  )

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (isActive) {
      e.preventDefault()
      return
    }

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

  useEffect(() => {
    if (!autoCommands || autoCommands.length === 0) return
    if (autoRef.current.started) return

    autoRef.current.started = true
    autoRef.current.timeouts = []

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      autoRef.current.timeouts.push(id)
    }

    const typeCommand = (command: string, onComplete: () => void) => {
      let charIndex = 0
      const typeNext = () => {
        if (charIndex > command.length) {
          schedule(() => {
            submit(command)
            onComplete()
          }, 280)
          return
        }
        setInput(command.slice(0, charIndex))
        charIndex += 1
        schedule(typeNext, 80)
      }
      typeNext()
    }

    const runNextCommand = (index: number) => {
      if (index >= autoCommands.length) return
      typeCommand(autoCommands[index], () => runNextCommand(index + 1))
    }

    schedule(() => runNextCommand(0), 500)

    return () => {
      autoRef.current.timeouts.forEach((id) => window.clearTimeout(id))
      autoRef.current.timeouts = []
    }
  }, [autoCommands, submit])

  // Cinematic mode: story-scripted actions, no parser execution
  useEffect(() => {
    if (!cinematicActions || cinematicActions.length === 0) return
    const localRef = { timeouts: [] as number[] }

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      localRef.timeouts.push(id)
    }

    const typeCommand = (command: string) => {
      return new Promise<void>((resolve) => {
        let i = 0
        const charTick = () => {
          if (i > command.length) {
            // Add command prompt line (typed, not submitted)
            const promptLine: Line = {
              type: "input",
              text: `[${hostname ?? "CodeYou"} ~]$ ${command}`,
            }
            setLines((l) => [...l, promptLine])
            resolve()
            return
          }
          setInput(command.slice(0, i))
          i++
          schedule(charTick, Math.floor(Math.random() * (22 - 9) + 9))
        }
        charTick()
      })
    }

    const run = async () => {
      for (const action of cinematicActions) {
        switch (action.type) {
          case "command":
            // Type command character by character, then add to lines
            await typeCommand(action.text)
            setInput("")
            await new Promise<void>((r) => schedule(() => r(), 420))
            break

          case "output":
            // Add output directly (never parsed, never generates fake errors)
            setLines((l) => [...l, { type: "output", text: action.text }])
            await new Promise<void>((r) => schedule(() => r(), 200))
            break

          case "error":
            // Add error line directly (script-defined error, not from parser)
            setLines((l) => [...l, { type: "error", text: action.text }])
            await new Promise<void>((r) => schedule(() => r(), 200))
            break

          case "warning":
            // Add warning line
            setLines((l) => [...l, { type: "warning", text: action.text }])
            await new Promise<void>((r) => schedule(() => r(), 200))
            break

          case "blank":
            // Add blank line for spacing
            setLines((l) => [...l, { type: "blank", text: "" }])
            await new Promise<void>((r) => schedule(() => r(), 100))
            break

          case "pause":
            // Pause for specified duration (default 600ms)
            await new Promise<void>((r) => schedule(() => r(), action.duration ?? 600))
            break
        }
      }
    }

    run().then(() => {
      if (storyId && !storyCompleteRef.current) {
        storyCompleteRef.current = true
        window.dispatchEvent(
          new CustomEvent("hyk-terminal-scene-finished", {
            detail: { storyId },
          }),
        )
      }
    })

    return () => {
      localRef.timeouts.forEach((id) => window.clearTimeout(id))
      localRef.timeouts = []
    }
  }, [cinematicActions, hostname, storyId])

  // Legacy demo mode: backward compatibility with string-based demoLines
  // (This remains for backward compatibility if older demos use demoLines format)
  useEffect(() => {
    if (!demoLines || demoLines.length === 0 || cinematicActions?.length) return
    const localRef = { timeouts: [] as number[] }

    const schedule = (fn: () => void, delay: number) => {
      const id = window.setTimeout(fn, delay)
      localRef.timeouts.push(id)
    }

    const demoSubmit = (command: string) => {
      const prompt: Line = {
        type: "input",
        text: `[${hostname ?? DEFAULT_HOSTNAME} ${cwdRef.current}]$ ${command}`,
      }
      const { output, nextCwd } = processCommand(command, cwdRef.current)

      if (output[0]?.text === "__CLEAR__") {
        setLines([])
      } else {
        setLines((l) => [...l, prompt, ...output, { type: "blank", text: "" }])
      }

      if (nextCwd !== undefined) {
        setCwd(nextCwd)
      }
      setHistory((h) => [command, ...h])
      setHistIdx(-1)
      setInput("")
    }

    const typeAndSubmit = (line: string) => {
      return new Promise<void>((resolve) => {
        let i = 0
        const charTick = () => {
          if (i > line.length) {
            demoSubmit(line)
            resolve()
            return
          }
          setInput(line.slice(0, i))
          i++
          schedule(charTick, Math.floor(Math.random() * (22 - 9) + 9))
        }
        charTick()
      })
    }

    const run = async () => {
      for (let idx = 0; idx < demoLines.length; idx++) {
        const raw = demoLines[idx]
        if (raw === "pause") {
          await new Promise<void>((r) => schedule(() => r(), 600))
          continue
        }
        if (raw.startsWith("OUT:")) {
          const out = raw.replace(/^OUT:\s?/, "")
          setLines((l) => [...l, { type: "output", text: out }, { type: "blank", text: "" }])
          await new Promise<void>((r) => schedule(() => r(), 360))
          continue
        }
        await typeAndSubmit(raw)
        await new Promise<void>((r) => schedule(() => r(), 420))
      }
    }

    run()

    return () => {
      localRef.timeouts.forEach((id) => window.clearTimeout(id))
      localRef.timeouts = []
    }
  }, [demoLines, hostname])

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
        if (line.type === "blank")
          return <div key={i} style={{ height: "0.4em" }} />
        return (
          <div
            key={i}
            style={{
              color:
                line.type === "input"
                  ? "rgba(255,255,255,0.85)"
                  : line.type === "error"
                    ? "#f87171"
                    : line.type === "warning"
                      ? "#fbbf24"
                      : "rgba(255,255,255,0.55)",
              whiteSpace: "pre-wrap",
              wordBreak: "break-all",
            }}
          >
            {line.type === "input" && (
              <span style={{ color: "#4ade80" }}>
                {line.text.split("$")[0]}$
              </span>
            )}
            {line.type === "input" ? (
              <span>{" " + line.text.split("$ ").slice(1).join("$ ")}</span>
            ) : (
              line.text
            )}
          </div>
        )
      })}

      {/* Input row */}
      <div style={{ display: "flex", alignItems: "center", marginTop: 2 }}>
        <span
          style={{ color: "#4ade80", marginRight: 4, whiteSpace: "nowrap" }}
        >
          [{hostname ?? DEFAULT_HOSTNAME} {cwd}]$
        </span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => {
            if (!isActive) setInput(e.target.value)
          }}
          onKeyDown={handleKey}
          disabled={isActive}
          autoFocus={!isActive}
          spellCheck={false}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e0e0e0",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "0.82rem",
            caretColor: isActive ? "transparent" : "#4ade80",
            opacity: isActive ? 0.65 : 1,
            cursor: isActive ? "not-allowed" : "text",
          }}
        />
      </div>
      <div ref={bottomRef} />
    </div>
  )
}
