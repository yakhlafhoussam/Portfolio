import { useTheme } from "../../context/ThemeContext"

type Props = {
  title: string
  isDark: boolean
  onToggleTheme: () => void
  children: React.ReactNode
}

const ThemeToggleIcon = ({
  isDark,
  onToggle,
}: {
  isDark: boolean
  onToggle: () => void
}) => {
  const t = useTheme()
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        width: 32,
        height: 32,
        borderRadius: 8,
        border: "none",
        background: "transparent",
        color: t.text,
        transition: "background 0.2s ease",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = t.isDark
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.06)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      title="Toggle Theme"
    >
      {isDark ? (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : (
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      )}
    </button>
  )
}

export default function MobileAppView({ title, isDark, onToggleTheme, children }: Props) {
  const t = useTheme()

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        background: t.bg,
        transition: t.transition,
        animation: "appOpen 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes appOpen {
          from { transform: scale(0.96) translateY(20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Mobile App Header */}
      <div
        style={{
          height: 44,
          background: t.titleBarBgFocused,
          borderBottom: "1px solid " + t.border,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 12px",
          flexShrink: 0,
          transition: t.transition,
          userSelect: "none",
        }}
      >
        <span
          style={{
            color: t.titleTextFocused,
            fontSize: "0.82rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {title}
        </span>

        <ThemeToggleIcon isDark={isDark} onToggle={onToggleTheme} />
      </div>

      {/* App Content */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {children}
      </div>
    </div>
  )
}
