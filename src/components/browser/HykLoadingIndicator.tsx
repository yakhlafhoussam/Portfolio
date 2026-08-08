import { useTheme } from "@/context/ThemeContext"
import "./HykLoadingIndicator.css"

type Props = {
  /** compact: inline section loader · centered: full content-area loader */
  variant?: "compact" | "centered"
}

export default function HykLoadingIndicator({
  variant = "compact",
}: Props) {
  const t = useTheme()

  return (
    <div
      className={`hyk-loading-indicator hyk-loading-indicator--${variant}`}
      data-theme={t.isDark ? "dark" : "light"}
      role="status"
      aria-label="Loading"
    >
      <span className="hyk-loading-indicator__word" aria-hidden="true">
        <span className="hyk-loading-indicator__letter">H</span>
        <span className="hyk-loading-indicator__letter">Y</span>
        <span className="hyk-loading-indicator__letter">K</span>
      </span>
    </div>
  )
}
