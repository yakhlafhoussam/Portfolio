import { useState } from "react"
import BootScreen from "./components/BootScreen"
import Desktop from "./components/Desktop"

type Phase = "boot" | "transitioning" | "desktop"

export default function App() {
  const [phase, setPhase] = useState<Phase>("boot")

  const handleBootComplete = () => {
    setPhase("transitioning")
    setTimeout(() => setPhase("desktop"), 50)
  }

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {(phase === "boot" || phase === "transitioning") && (
        <BootScreen onComplete={handleBootComplete} />
      )}
      {(phase === "transitioning" || phase === "desktop") && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            opacity: phase === "desktop" ? 1 : 0,
            transition: "opacity 0.9s ease",
          }}
        >
          <Desktop />
        </div>
      )}
    </div>
  )
}
