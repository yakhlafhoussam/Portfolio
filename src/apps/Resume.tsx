import resumePdf from "@/assets/documents/Houssam_YAKHLAF_CV.pdf"

export default function Resume() {
  return (
    <div style={{ width: "100%", height: "100%", background: "#1a1a1e" }}>
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
