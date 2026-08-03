export const PROJECTS = [
  {
    id: "neural-canvas",
    name: "neural-canvas",
    description:
      "An AI-powered generative art tool that transforms textual prompts into layered visual compositions. Built on diffusion models with a custom post-processing pipeline for style transfer, depth-aware compositing, and resolution upscaling.",
    technologies: [
      "Python",
      "PyTorch",
      "FastAPI",
      "React",
      "WebGL",
      "Canvas API",
    ],
    github: "https://github.com/hyk/neural-canvas",
    demo: "https://neural-canvas.dev",
    year: "2024",
    status: "Active",
    image:
      "https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=760&h=380&fit=crop&auto=format",
  },
  {
    id: "void-sync",
    name: "void-sync",
    description:
      "Real-time collaboration engine built on CRDTs and WebSockets. Allows concurrent editing of shared state with conflict-free resolution, persistent session recovery, and optional end-to-end encryption.",
    technologies: [
      "TypeScript",
      "Node.js",
      "WebSocket",
      "CRDTs",
      "Redis",
      "PostgreSQL",
    ],
    github: "https://github.com/hyk/void-sync",
    demo: null,
    year: "2024",
    status: "Beta",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=760&h=380&fit=crop&auto=format",
  },
  {
    id: "spectral",
    name: "spectral",
    description:
      "Zero-dependency audio visualization library for the browser. Renders frequency spectrums, waveforms, and 3D spectrograms in real-time using the Web Audio API and WebGPU. 8kb gzipped.",
    technologies: ["TypeScript", "Web Audio API", "WebGPU", "Canvas", "WASM"],
    github: "https://github.com/hyk/spectral",
    demo: "https://spectral.hyk.dev",
    year: "2023",
    status: "Stable",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=760&h=380&fit=crop&auto=format",
  },
  {
    id: "kernel-drift",
    name: "kernel-drift",
    description:
      "System performance monitor written in Rust. Tracks CPU, memory, I/O, and network metrics at sub-millisecond precision. Exposes a gRPC API and includes a terminal dashboard with historical sparklines.",
    technologies: ["Rust", "gRPC", "Tokio", "TUI", "Linux perf_events"],
    github: "https://github.com/hyk/kernel-drift",
    demo: null,
    year: "2023",
    status: "Stable",
    image: null,
  },
]

export const EXPERIENCE = [
  {
    id: "meridian-2024",
    company: "Meridian Systems",
    role: "Software Engineering Intern",
    period: "May 2024 — Aug 2024",
    location: "San Francisco, CA",
    description:
      "Built internal tooling for the infrastructure team. Reduced deployment pipeline time by 34% by parallelizing build steps and introducing incremental artifact caching. Shipped a monitoring dashboard that aggregated 12 previously separate alert sources into a single interface.",
    technologies: ["Go", "Kubernetes", "Terraform", "Prometheus", "React"],
    type: "internship",
  },
  {
    id: "ml-lab-2023",
    company: "University ML Lab",
    role: "Research Assistant",
    period: "Sep 2023 — Apr 2024",
    location: "Remote",
    description:
      "Contributed to research on efficient fine-tuning of large language models. Implemented LoRA adapter training pipelines and ran ablation studies across model scales from 1B to 70B. Co-authored one workshop paper submitted to NeurIPS.",
    technologies: ["Python", "PyTorch", "HuggingFace", "CUDA", "W&B"],
    type: "research",
  },
  {
    id: "freelance-2022",
    company: "Independent",
    role: "Freelance Developer",
    period: "Jun 2022 — Aug 2023",
    location: "Remote",
    description:
      "Developed and delivered web applications for clients across e-commerce, media, and fintech domains. Maintained a 100% on-time delivery record.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Stripe", "Vercel"],
    type: "freelance",
  },
]

export const EDUCATION = [
  {
    id: "bsc",
    institution: "State University",
    degree: "B.Sc. Computer Science",
    period: "2021 — 2025",
    gpa: "3.9 / 4.0",
    relevant: [
      "Data Structures & Algorithms",
      "Operating Systems",
      "Computer Networks",
      "Machine Learning",
      "Distributed Systems",
      "Compilers",
    ],
  },
  {
    id: "cert-ml",
    institution: "Coursera / DeepLearning.AI",
    degree: "Machine Learning Specialization",
    period: "2023",
    gpa: null,
    relevant: [
      "Supervised Learning",
      "Unsupervised Learning",
      "Reinforcement Learning",
    ],
  },
  {
    id: "cert-rust",
    institution: "Linux Foundation",
    degree: "Introduction to Rust",
    period: "2023",
    gpa: null,
    relevant: ["Memory Safety", "Concurrency", "Systems Programming"],
  },
]

export const GALLERY_IMAGES = [
  {
    id: "g1",
    src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=900&h=600&fit=crop&auto=format",
    alt: "Workspace with multiple monitors",
    caption: "The usual setup",
  },
  {
    id: "g2",
    src: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=900&h=600&fit=crop&auto=format",
    alt: "Code on a screen",
    caption: "2am debugging session",
  },
  {
    id: "g3",
    src: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&h=600&fit=crop&auto=format",
    alt: "Circuit board closeup",
    caption: "From a hardware project",
  },
  {
    id: "g4",
    src: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=900&h=600&fit=crop&auto=format",
    alt: "Notebook and coffee",
    caption: "System design sketches",
  },
  {
    id: "g5",
    src: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=900&h=600&fit=crop&auto=format",
    alt: "Programming on laptop",
    caption: "Building spectral",
  },
  {
    id: "g6",
    src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=900&h=600&fit=crop&auto=format",
    alt: "Abstract tech visualization",
    caption: "neural-canvas output #47",
  },
]
