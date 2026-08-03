import resumePdf from "@/assets/documents/Houssam_YAKHLAF_CV.pdf"
import { useTheme } from "@/context/ThemeContext"

export default function Resume() {
  const t = useTheme()
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: t.bg,
        transition: t.transition,
      }}
    >
      <iframe
        src={resumePdf}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
        title="Resume"
      />
    </div>
  )
}
