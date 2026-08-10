import { useTheme } from "../../context/ThemeContext"

type Props = {
  onBack: () => void
  onHome: () => void
  onRecents: () => void
  canGoBack: boolean
}

export default function MobileNavBar({ onBack, onHome, onRecents, canGoBack }: Props) {
  const t = useTheme()

  return (
    <div
      style={{
        height: 52,
        background: t.isDark ? "rgba(15,15,18,0.72)" : "rgba(245,245,247,0.72)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid " + t.border,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10006,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        userSelect: "none",
      }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        style={{
          background: "none",
          border: "none",
          cursor: canGoBack ? "pointer" : "default",
          opacity: canGoBack ? 0.85 : 0.25,
          padding: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.text,
          transition: "opacity 0.2s ease, transform 0.1s ease",
        }}
        onMouseDown={(e) => {
          if (canGoBack) e.currentTarget.style.transform = "scale(0.85)"
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Home Button */}
      <button
        onClick={onHome}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          opacity: 0.85,
          padding: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.text,
          transition: "opacity 0.2s ease, transform 0.1s ease",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.85)"
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <circle cx="12" cy="12" r="9" />
        </svg>
      </button>

      {/* Recents Button */}
      <button
        onClick={onRecents}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          opacity: 0.85,
          padding: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: t.text,
          transition: "opacity 0.2s ease, transform 0.1s ease",
        }}
        onMouseDown={(e) => {
          e.currentTarget.style.transform = "scale(0.85)"
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = "scale(1)"
        }}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      </button>
    </div>
  )
}
