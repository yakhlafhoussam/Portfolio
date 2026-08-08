import { PROJECTS } from "@/content/data"
import portfolioImg from "@/assets/screenshots/portfolio.png"

export type VirtualFileType = "markdown" | "json" | "url" | "image" | "file"

export type VirtualFile = {
  kind: "file"
  name: string
  fileType: VirtualFileType
  content?: string
  url?: string
  imageSrc?: string
}

export type VirtualDir = {
  kind: "dir"
  name: string
  children: VirtualNode[]
}

export type VirtualNode = VirtualFile | VirtualDir

export type ExplorerFileItem = {
  name: string
  type: "file" | "folder" | "url" | "image" | "json" | "markdown"
  content?: string
  url?: string
  imageSrc?: string
  children?: ExplorerFileItem[]
}

const PROJECT_README: Record<string, string> = {
  "debuggers-lms": `# DebuGGers

DebuGGers is a personal learning platform and course application built around programming courses and lessons.

A modern e-learning platform designed to help developers master programming through structured video courses, multilingual support (EN/FR/AR), lesson progress tracking, downloadable resources, personal notes, and an intuitive dashboard for both learners and instructors.

## Features
- Structured programming courses and lessons
- Multiple playlists
- Lesson search
- Multilingual support (EN / FR / AR)
- Course progress tracking
- Personal notes
- Lesson completion tracking
- Course author / instructor profiles

## Technologies
- Vue.js
- Python
- React
- Angular
- HTML
- CSS
- Tailwind
- JavaScript

## Details
- Year: 2026
- Status: Open
- GitHub: https://github.com/yakhlafhoussam/Frontend_Master.git
- Demo: https://yakhlafhoussam.github.io/Frontend_Master/`,
  blackwave: `# BlackWave

A cyberpunk-inspired simulation of an underground digital marketplace built for educational purposes. BlackWave recreates a fictional dark-web ecosystem featuring anonymous communities, virtual cryptocurrency transactions, reputation systems, digital marketplaces, and moderation tools through an immersive cinematic interface.

## Technologies
- Laravel 12
- Blade
- HTML
- CSS
- Tailwind CSS
- JavaScript
- PostgreSQL
- Docker
- Docker Compose

## Details
- Year: 2026
- Status: Completed
- GitHub: https://github.com/yakhlafhoussam/BlackWave.git`,
  easycoloc: `# EasyColoc

EasyColoc is a web application for managing shared housing and colocation. It helps roommates organize shared living, track common expenses, and settle balances automatically.

## Features
- Create and manage colocations
- Manage members
- Invite users through token / email
- Add and remove expenses
- Categorize expenses
- Calculate balances
- Display who owes whom
- Record payments
- Manage reputation
- Filter expenses by month
- Global administration and statistics

## Technologies
- PHP
- Laravel
- MySQL
- PostgreSQL
- Eloquent
- MVC
- UML
- Blade
- Tailwind CSS
- Git / GitHub

## Details
- Year: 2026
- Status: Completed
- GitHub: https://github.com/yakhlafhoussam/EasyColoc-croisse-2.git`,
  workspace: `# WorkSphere

A virtual collaborative workspace inspired by modern productivity platforms, providing project organization, team management, real-time communication, shared workspaces, and desktop-inspired collaboration tools.

## Technologies
- React
- TypeScript
- Firebase
- Tailwind CSS

## Details
- Year: 2025
- Status: Completed
- GitHub: https://github.com/yakhlafhoussam/Brief-Soutenance-Crois-e-1-WorkSphere---Virtual-Workspace-.git`,
}

function screenshotPrefix(projectId: string): string {
  if (projectId === "workspace") return "worksphere"
  if (projectId === "debuggers-lms") return "debuggers"
  return projectId
}

function file(
  name: string,
  fileType: VirtualFileType,
  opts: { content?: string; url?: string; imageSrc?: string } = {},
): VirtualFile {
  return { kind: "file", name, fileType, ...opts }
}

function dir(name: string, children: VirtualNode[]): VirtualDir {
  return { kind: "dir", name, children }
}

function buildScreenshotsFolder(
  project: (typeof PROJECTS)[0],
): VirtualDir {
  const previewImg = project.image || portfolioImg
  const prefix = screenshotPrefix(project.id)
  const shots: VirtualNode[] =
    project.screenshots && project.screenshots.length > 0
      ? project.screenshots.map((src, idx) =>
          file(`${prefix}_${idx + 1}.png`, "image", { imageSrc: src }),
        )
      : [file("home.png", "image", { imageSrc: previewImg })]

  return dir("Screenshots", shots)
}

function buildSharedRootFiles(
  project: (typeof PROJECTS)[0],
): VirtualNode[] {
  const previewImg = project.image || portfolioImg
  const readme =
    PROJECT_README[project.id] ??
    `# ${project.name}\n\n${project.description}`

  const root: VirtualNode[] = [
    file("README.md", "markdown", { content: readme }),
    file("Technologies.json", "json", {
      content: JSON.stringify(project.technologies, null, 2),
    }),
    file("GitHub.url", "url", { url: project.github }),
    file("Preview.png", "image", { imageSrc: previewImg }),
    buildScreenshotsFolder(project),
  ]

  if (project.demo) {
    root.splice(3, 0, file("Live Demo.url", "url", { url: project.demo }))
  }

  return root
}

// All project filesystems use only the curated shared root files.
// No real repository internals are exposed in the virtual portfolio filesystem.
// See buildSharedRootFiles() for the canonical structure:
//   README.md, Technologies.json, GitHub.url, Live Demo.url (if any), Preview.png, Screenshots/

export function getProjectFilesystem(projectId: string): VirtualNode[] {
  const project = PROJECTS.find((p) => p.id === projectId)
  if (!project) return []
  // All projects use only the curated shared root files.
  return buildSharedRootFiles(project)
}

export function virtualNodesToFileItems(
  nodes: VirtualNode[],
): ExplorerFileItem[] {
  return nodes.map((node) => {
    if (node.kind === "dir") {
      return {
        name: node.name,
        type: "folder",
        children: virtualNodesToFileItems(node.children),
      }
    }
    return {
      name: node.name,
      type: node.fileType,
      content: node.content,
      url: node.url,
      imageSrc: node.imageSrc,
    }
  })
}

export function resolveProjectExplorerPath(path: string[]): VirtualNode[] {
  if (path.length === 0) return []
  const project = PROJECTS.find((p) => p.name === path[0])
  if (!project) return []

  let nodes = getProjectFilesystem(project.id)
  for (let i = 1; i < path.length; i++) {
    const segment = path[i]
    const folder = nodes.find(
      (node) => node.kind === "dir" && node.name === segment,
    )
    if (!folder || folder.kind !== "dir") return []
    nodes = folder.children
  }
  return nodes
}

function imageTerminalContent(
  projectName: string,
  fileName: string,
  index: number,
  total: number,
): string {
  return `Project: ${projectName}\nFile: ${fileName}\nIndex: ${index} of ${total}\nType: image/png\nCaption: Project Screenshot\n\nOpen the Gallery application to view this image.`
}

function urlTerminalContent(url: string): string {
  return `URL: ${url}`
}

function walkTerminalTree(
  dirPath: string,
  nodes: VirtualNode[],
  fs: Record<string, Record<string, string>>,
  contents: Record<string, string>,
  projectName?: string,
): void {
  fs[dirPath] = {}

  for (const node of nodes) {
    if (node.kind === "dir") {
      fs[dirPath][`${node.name}/`] = "directory"
      walkTerminalTree(
        `${dirPath}/${node.name}`,
        node.children,
        fs,
        contents,
        projectName,
      )
      continue
    }

    fs[dirPath][node.name] = "file"

    if (node.content) {
      contents[`${dirPath}/${node.name}`] = node.content
    } else if (node.url) {
      contents[`${dirPath}/${node.name}`] = urlTerminalContent(node.url)
    } else if (node.fileType === "image" && node.imageSrc) {
      const siblings = nodes.filter((n) => n.kind === "file" && n.fileType === "image")
      const index = siblings.findIndex((n) => n.kind === "file" && n.name === node.name) + 1
      contents[`${dirPath}/${node.name}`] = imageTerminalContent(
        projectName ?? "Project",
        node.name,
        index,
        siblings.length,
      )
    }
  }
}

export function buildTerminalProjectFilesystem(): {
  fs: Record<string, Record<string, string>>
  contents: Record<string, string>
} {
  const fs: Record<string, Record<string, string>> = {
    "~/Projects": {},
  }
  const contents: Record<string, string> = {}

  for (const project of PROJECTS) {
    fs["~/Projects"][`${project.name}/`] = "directory"
    walkTerminalTree(
      `~/Projects/${project.name}`,
      getProjectFilesystem(project.id),
      fs,
      contents,
      project.name,
    )
  }

  return { fs, contents }
}
