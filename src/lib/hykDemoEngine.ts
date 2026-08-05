// HYK takeover engine — pure cinematic system crash
// No narrative, no commands, no shell output.

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
const rand = (min: number, max: number) => Math.random() * (max - min) + min
const randInt = (min: number, max: number) => Math.floor(rand(min, max + 1))
const chance = (p: number) => Math.random() < p

let running = false
let stormCounter = 0

function dispatchPhase(phase: string) {
  window.dispatchEvent(new CustomEvent("hyk-breach-phase", { detail: { phase } }))
}

function dispatchPopup(title: string, body: string[], duration: number) {
  window.dispatchEvent(
    new CustomEvent("hyk-demo-popup", {
      detail: { title, body, duration },
    }),
  )
}

function spawnCrashTerminal() {
  const id = ++stormCounter
  ;(window as any).spawnWindow?.(
    "terminal",
    {
      title: `Terminal ${id}`,
      hostname: "",
      visualOnly: true,
    },
    { force: true, position: "cascade" },
  )
}

async function runTerminalStorm() {
  const terminalCount = randInt(5, 8)
  for (let i = 0; i < terminalCount; i++) {
    spawnCrashTerminal()

    if (chance(0.85)) dispatchPhase("gpu-distortion")
    if (chance(0.7)) dispatchPhase("desktop-instability")
    if (chance(0.55)) dispatchPhase("browser-move")
    if (chance(0.35)) dispatchPhase("browser-resize")
    if (chance(0.5)) dispatchPhase("flash-screen")
    if (chance(0.2)) dispatchPhase("logo-flash")

    await wait(rand(180, 420))
  }
}

async function runInstabilityBurst() {
  const burstCount = randInt(8, 14)
  for (let i = 0; i < burstCount; i++) {
    dispatchPhase("gpu-distortion")
    if (chance(0.6)) dispatchPhase("desktop-instability")
    if (chance(0.5)) dispatchPhase("browser-move")
    if (chance(0.3)) dispatchPhase("browser-resize")
    if (chance(0.25)) dispatchPhase("flash-screen")
    if (chance(0.2)) dispatchPhase("logo-flash")
    await wait(rand(40, 120))
  }
}

async function runFinalCountdown() {
  for (let seconds = 5; seconds >= 0; seconds--) {
    dispatchPopup("SYSTEM FAILURE", ["Rebooting system...", String(seconds)], 1000)
    await wait(1000)
  }
}

export function startHykDemo() {
  if (running) return
  running = true

  ;(async function run() {
    // Let the browser corruption ramp up before the terminal storm.
    await wait(rand(500, 900))
    await runInstabilityBurst()
    await runTerminalStorm()
    await runInstabilityBurst()
    await runFinalCountdown()

    running = false
    window.location.reload()
  })().catch(() => {
    running = false
  })
}

export function stopHykDemo() {
  running = false
}

window.addEventListener("hyk-demo-start", () => startHykDemo())

;(window as any).startHykDemo = startHykDemo
;(window as any).stopHykDemo = stopHykDemo
