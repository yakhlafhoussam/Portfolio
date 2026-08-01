export default function Trash() {
  return (
    <div
      style={{
        flex: 1,
        backgroundColor: "#1a1a1e",
        color: "#ffffff",
        display: "flex",
        flexDirection: "column",
        padding: "24px 32px",
        fontFamily: "'Inter', sans-serif",
        userSelect: "none",
      }}
    >
      <h1 style={{ fontSize: "1.4rem", fontWeight: 600, margin: 0, color: "rgba(255,255,255,0.9)" }}>Trash</h1>
      <hr style={{ border: "none", borderTop: "1px solid rgba(255, 255, 255, 0.08)", margin: "16px 0 32px 0" }} />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "rgba(255, 255, 255, 0.3)",
          gap: 16,
        }}
      >
        <svg
          width="52"
          height="52"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ opacity: 0.7 }}
        >
          <path d="M3 6h18" />
          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
        <span style={{ fontSize: "0.92rem", fontWeight: 400, letterSpacing: "0.01em" }}>This folder is empty.</span>
      </div>
    </div>
  )
}
