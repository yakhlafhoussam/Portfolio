import debuggersImg from "@/assets/screenshots/debuggers.png"
import blackwaveImg from "@/assets/screenshots/blackwave.png"

export const PROJECTS = [
  {
    id: "debuggers-lms",
    name: "DebuGGers",
    description:
      "A Learning Management System developed for DebuGGers, providing course management, authentication, video lessons, and educational resources through a modern web platform.",
    technologies: [
      "HTML",
      "CSS",
      "Tailwind",
      "JS",
    ],
    github: "https://github.com/yakhlafhoussam/Frontend_Master.git",
    demo: "https://yakhlafhoussam.github.io/Frontend_Master/",
    year: "2026",
    status: "Open",
    image: debuggersImg,
  },

  {
    id: "blackwave",
    name: "BlackWave",
    description:
      "A modern full-stack web application focused on delivering a clean user experience with responsive design and scalable architecture.",
    technologies: [
      "Laravel 12",
      "Blade",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "JavaScript",
      "PostgreSQL",
      "Docker",
      "Docker Compose",
    ],
    github: "https://github.com/yakhlafhoussam/BlackWave.git",
    demo: null,
    year: "2026",
    status: "Completed",
    image: blackwaveImg,
  },

  {
    id: "easycoloc",
    name: "EasyColoc",
    description:
      "A collaborative housing platform designed to simplify roommate matching and shared accommodation management through an intuitive interface.",
    technologies: [
      "Laravel 12",
      "Blade",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "JavaScript",
      "PostgreSQL",
      "Docker",
      "Docker Compose",
    ],
    github:
      "https://github.com/yakhlafhoussam/EasyColoc-croisse-2.git",
    demo: null,
    year: "2026",
    status: "Completed",
    image: null,
  },

  {
    id: "workspace",
    name: "WorkSphere",
    description:
      "A virtual collaborative workspace that brings together task management, communication, and productivity tools in one unified environment.",
    technologies: [
      "React",
      "TypeScript",
      "Firebase",
      "Tailwind CSS",
    ],
    github:
      "https://github.com/yakhlafhoussam/Brief-Soutenance-Crois-e-1-WorkSphere---Virtual-Workspace-.git",
    demo: null,
    year: "2025",
    status: "Completed",
    image: null,
  },
]

export const EXPERIENCE = [
  {
    id: "glorvia-2026",
    company: "Glorvia Media Agency",
    role: "Full Stack Developer Intern",
    period: "May 2026 — Jul 2026",
    location: "Hybrid • Oujda, Morocco",
    description:
      "Completed a two-month internship through YouCode Safi. Worked on enterprise web applications using Spring Boot, Angular, PostgreSQL, Docker, JWT authentication, REST APIs, and collaborative software development practices.",
    technologies: [
      "Spring Boot",
      "Angular",
      "PostgreSQL",
      "Docker",
      "JWT",
    ],
    type: "internship",
  },
]

export const EDUCATION = [
  {
    id: "youcode",
    institution: "YouCode Safi",
    degree: "Software Engineering & Artificial Intelligence",
    period: "2025 — Present",
    gpa: null,
    relevant: [
      "Java",
      "TypeScript",
      "JavaScript",
      "C",
      "PHP",
      "HTML5",
      "CSS3",
      "SQL",
      "Angular",
      "Vue.js",
      "Tailwind CSS",
      "Bootstrap",
      "Laravel",
      "Spring Boot",
      "REST APIs",
      "JWT",
      "JPA",
      "PostgreSQL",
      "MySQL",
      "Firebase",
      "Figma",
      "Draw.io",
      "AWS",
      "Vercel",
      "GitHub Pages",
      "CI/CD",
      "Docker",
      "Docker Compose",
      "Git",
      "GitHub",
      "Linux",
      "Nginx",
      "Postman",
    ],
  },

  {
    id: "uca",
    institution: "Cadi Ayyad University",
    degree: "English Studies",
    period: "2024 — Present",
    gpa: null,
    relevant: [
      "Communication",
      "Academic English",
    ],
  },

  {
    id: "bac",
    institution: "Lycée Mohammed Belahcen El Ouazzani",
    degree: "Baccalaureate in Physical Sciences",
    period: "2023 — 2024",
    gpa: null,
    relevant: [
      "Mathematics",
      "Physics",
    ],
  },
]

export interface GalleryImage {
  id: string
  src: string
  alt?: string
  caption: string
}

export const GALLERY_IMAGES: GalleryImage[] = []