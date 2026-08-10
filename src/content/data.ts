import debuggers_1 from "@/assets/screenshots/debuggers/debuggers_1.png"
import debuggers_2 from "@/assets/screenshots/debuggers/debuggers_2.png"
import debuggers_3 from "@/assets/screenshots/debuggers/debuggers_3.png"
import debuggers_4 from "@/assets/screenshots/debuggers/debuggers_4.png"
import debuggers_5 from "@/assets/screenshots/debuggers/debuggers_5.png"

import blackwave_1 from "@/assets/screenshots/blackwave/blackwave_1.png"
import blackwave_2 from "@/assets/screenshots/blackwave/blackwave_2.png"
import blackwave_3 from "@/assets/screenshots/blackwave/blackwave_3.png"
import blackwave_4 from "@/assets/screenshots/blackwave/blackwave_4.png"
import blackwave_5 from "@/assets/screenshots/blackwave/blackwave_5.png"
import blackwave_6 from "@/assets/screenshots/blackwave/blackwave_6.png"
import blackwave_7 from "@/assets/screenshots/blackwave/blackwave_7.png"

import worksphere_1 from "@/assets/screenshots/worksphere/worksphere_1.png"
import worksphere_2 from "@/assets/screenshots/worksphere/worksphere_2.png"
import worksphere_3 from "@/assets/screenshots/worksphere/worksphere_3.png"
import worksphere_4 from "@/assets/screenshots/worksphere/worksphere_4.png"

export const PROJECTS = [
  {
    id: "debuggers-lms",
    name: "DebuGGers",
    description:
      "A modern e-learning platform designed to help developers master programming through structured video courses, multilingual support (EN/FR/AR), lesson progress tracking, downloadable resources, personal notes, and an intuitive dashboard for both learners and instructors.",
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
    image: debuggers_1,
    screenshots: [
      debuggers_1,
      debuggers_2,
      debuggers_3,
      debuggers_4,
      debuggers_5,
    ],
  },

  {
    id: "blackwave",
    name: "BlackWave",
    description:
      "A cyberpunk-inspired simulation of an underground digital marketplace built for educational purposes. BlackWave recreates a fictional dark-web ecosystem featuring anonymous communities, virtual cryptocurrency transactions, reputation systems, digital marketplaces, and moderation tools through an immersive cinematic interface.",
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
    image: blackwave_1,
    screenshots: [
      blackwave_1,
      blackwave_2,
      blackwave_3,
      blackwave_4,
      blackwave_5,
      blackwave_6,
      blackwave_7,
    ],
  },

  {
    id: "easycoloc",
    name: "EasyColoc",
    description:
      "A shared-house management platform that helps roommates manage common expenses, calculate balances automatically, simplify reimbursements, handle invitations, monitor financial reputation, and organize shared living through an automated debt settlement system.",
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
    screenshots: [] as string[],
  },

  {
    id: "workspace",
    name: "WorkSphere",
    description:
      "A virtual collaborative workspace inspired by modern productivity platforms, providing project organization, team management, real-time communication, shared workspaces, and desktop-inspired collaboration tools.",
    technologies: [
      "React",
      "TypeScript",
      "Firebase",
      "Tailwind CSS",
    ],
    github:
      "https://github.com/yakhlafhoussam/Brief-Soutenance-Crois-e-1-WorkSphere---Virtual-Workspace-.git",
    demo: "https://yakhlafhoussam.github.io/Brief-Soutenance-Crois-e-1-WorkSphere---Virtual-Workspace-/",
    year: "2025",
    status: "Completed",
    image: worksphere_1,
    screenshots: [
      worksphere_1,
      worksphere_2,
      worksphere_3,
      worksphere_4,
    ],
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
    institution: "Université Cadi Ayyad",
    degree: "Bachelor's Degree",
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
