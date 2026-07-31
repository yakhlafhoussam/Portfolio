export default function Resume() {
  const h = { color: "#e2e2e2", fontWeight: 600 } as const
  const dim = { color: "rgba(255,255,255,0.38)", fontSize: "0.78rem" } as const
  const section = {
    borderTop: "1px solid rgba(255,255,255,0.07)",
    paddingTop: 18,
    marginTop: 18,
  } as const

  return (
    <div
      style={{
        flex: 1,
        background: "#1a1a1e",
        overflowY: "auto",
        display: "flex",
        justifyContent: "center",
        padding: "28px 20px",
      }}
    >
      {/* PDF-like paper */}
      <div
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#242428",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 8,
          padding: "40px 48px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          fontFamily: "'Inter', sans-serif",
          color: "rgba(255,255,255,0.62)",
          fontSize: "0.82rem",
          lineHeight: 1.6,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <h1 style={{ ...h, fontSize: "1.5rem", margin: "0 0 4px", letterSpacing: "0.04em" }}>
            HYK
          </h1>
          <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}>
            hyk@proton.me · github.com/hyk · linkedin.com/in/hyk
          </div>
        </div>

        {/* Summary */}
        <div style={section}>
          <SectionLabel>Summary</SectionLabel>
          <p style={{ margin: 0, lineHeight: 1.7 }}>
            Software engineer focused on systems engineering, ML infrastructure, and browser-based
            creative technology. Comfortable across the stack, with a preference for correctness and
            craftsmanship over speed. Open to full-time roles and research collaborations.
          </p>
        </div>

        {/* Experience */}
        <div style={section}>
          <SectionLabel>Experience</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ResumeJob
              role="Software Engineering Intern"
              company="Meridian Systems"
              period="May 2024 — Aug 2024"
              location="San Francisco, CA"
              items={[
                "Reduced deployment pipeline time by 34% via parallelisation and incremental artifact caching",
                "Shipped a monitoring dashboard aggregating 12 previously separate alert sources",
                "Wrote Go services for internal observability tooling used by 40+ engineers",
              ]}
            />
            <ResumeJob
              role="Research Assistant"
              company="University ML Lab"
              period="Sep 2023 — Apr 2024"
              location="Remote"
              items={[
                "Implemented LoRA adapter training pipelines for 1B–70B scale language models",
                "Ran ablation studies across model configurations; co-authored a NeurIPS workshop paper",
              ]}
            />
            <ResumeJob
              role="Freelance Developer"
              company="Independent"
              period="Jun 2022 — Aug 2023"
              location="Remote"
              items={[
                "Delivered 6 web applications for clients in e-commerce, media, and fintech",
                "100% on-time delivery; consistent 5-star client ratings",
              ]}
            />
          </div>
        </div>

        {/* Projects */}
        <div style={section}>
          <SectionLabel>Selected Projects</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <ResumeProject
              name="neural-canvas"
              desc="AI generative art tool using diffusion models and a custom post-processing pipeline."
              stack="Python · PyTorch · FastAPI · React"
            />
            <ResumeProject
              name="spectral"
              desc="Zero-dependency audio visualisation library. WebGPU + Web Audio API. 8kb gzip."
              stack="TypeScript · WebGPU · WASM"
            />
            <ResumeProject
              name="kernel-drift"
              desc="Rust-based system performance monitor with gRPC API and TUI dashboard."
              stack="Rust · Tokio · gRPC · Linux perf_events"
            />
          </div>
        </div>

        {/* Education */}
        <div style={section}>
          <SectionLabel>Education</SectionLabel>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 4 }}>
            <div>
              <span style={{ ...h, fontSize: "0.85rem" }}>B.Sc. Computer Science</span>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.78rem" }}> · State University</span>
            </div>
            <span style={dim}>2021 — 2025 · GPA 3.9</span>
          </div>
        </div>

        {/* Skills */}
        <div style={section}>
          <SectionLabel>Skills</SectionLabel>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <SkillRow label="Languages" value="TypeScript, Python, Rust, Go, C++" />
            <SkillRow label="Frontend"  value="React, WebGPU, Canvas API, Web Audio" />
            <SkillRow label="Backend"   value="Node.js, FastAPI, Tokio, gRPC, Redis" />
            <SkillRow label="Infra"     value="Kubernetes, Terraform, Prometheus, Docker" />
            <SkillRow label="ML"        value="PyTorch, HuggingFace, CUDA, LoRA, W&B" />
          </div>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        color: "#4ade80",
        fontSize: "0.68rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        marginBottom: 12,
      }}
    >
      {children}
    </div>
  )
}

function ResumeJob({
  role, company, period, location, items,
}: {
  role: string; company: string; period: string; location: string; items: string[]
}) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 4, marginBottom: 4 }}>
        <div>
          <span style={{ color: "#e2e2e2", fontWeight: 600, fontSize: "0.85rem" }}>{role}</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.8rem" }}> — {company}</span>
        </div>
        <span style={{ color: "rgba(255,255,255,0.35)", fontSize: "0.75rem", fontFamily: "'JetBrains Mono', monospace" }}>
          {period}
        </span>
      </div>
      <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 3 }}>
        {items.map((item, i) => (
          <li key={i} style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.8rem" }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

function ResumeProject({ name, desc, stack }: { name: string; desc: string; stack: string }) {
  return (
    <div>
      <span style={{ color: "#e2e2e2", fontWeight: 600, fontSize: "0.83rem", fontFamily: "'JetBrains Mono', monospace" }}>
        {name}
      </span>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.8rem" }}> — {desc}</span>
      <div style={{ color: "rgba(255,255,255,0.25)", fontSize: "0.75rem", marginTop: 2, fontFamily: "'JetBrains Mono', monospace" }}>
        {stack}
      </div>
    </div>
  )
}

function SkillRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", gap: 12 }}>
      <span
        style={{
          color: "rgba(255,255,255,0.3)",
          fontSize: "0.78rem",
          minWidth: 80,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {label}
      </span>
      <span style={{ color: "rgba(255,255,255,0.58)", fontSize: "0.8rem" }}>{value}</span>
    </div>
  )
}
