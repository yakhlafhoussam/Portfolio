import { useCallback, useEffect, useRef, useState } from "react"
import glitchSound from "@/assets/sound/glitch.mp3"

type TakeoverPhase = "idle" | "freeze" | "sound" | "flicker" | "browser-shake" | "open-terminal" | "terminal-typing" | "gpu-distortion" | "browser-resize" | "close-terminal" | "wallpaper-glitch" | "icon-flicker" | "desktop-instability" | "browser-move" | "focus-terminal" | "flash-screen" | "focus-browser" | "logo-flash" | "breach-message" | "screen-black" | "reload" | "finished"

export function useHykExperience() {
  const [showStarted, setShowStarted] = useState(false)
  const [takeoverActive, setTakeoverActive] = useState(false)
  const [takeoverPhase, setTakeoverPhase] = useState<TakeoverPhase>("idle")
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const countdownRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const timerRefs = useRef<number[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const showStartedRef = useRef(false)

  const cleanupCountdown = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    countdownRef.current = null
  }, [])

  const dispatchBreachPhase = useCallback((phase: string) => {
    window.dispatchEvent(
      new CustomEvent("hyk-breach-phase", { detail: { phase } }),
    )
  }, [])

  const dispatchCountdownState = useCallback(
    (active: boolean) => {
      window.dispatchEvent(
        new CustomEvent("hyk-breach-countdown", { detail: { active } }),
      )
    },
    [],
  )

  const clearTakeoverTimers = useCallback(() => {
    timerRefs.current.forEach((id) => window.clearTimeout(id))
    timerRefs.current = []
  }, [])

  const finishTakeover = useCallback(() => {
    clearTakeoverTimers()
    setTakeoverActive(false)
    setTakeoverPhase("finished")
    dispatchBreachPhase("finished")
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
  }, [clearTakeoverTimers, dispatchBreachPhase])

  const startShow = useCallback(async () => {
    if (showStartedRef.current) return
    showStartedRef.current = true
    setShowStarted(true)
    setTakeoverActive(true)
    setTakeoverPhase("freeze")
    cleanupCountdown()
    setRemainingTime(0)
    dispatchCountdownState(false)
    dispatchBreachPhase("freeze")

    if (!audioRef.current) {
      audioRef.current = new Audio(glitchSound)
      audioRef.current.preload = "auto"
    }
    audioRef.current.currentTime = 0

    timerRefs.current.push(
      window.setTimeout(() => {
        void audioRef.current?.play().catch(() => {})
        dispatchBreachPhase("sound")
      }, 200),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("flicker")
      }, 300),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("browser-shake")
      }, 600),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("open-terminal")
      }, 1000),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("terminal-typing")
      }, 1300),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("gpu-distortion")
      }, 2000),
    )
    // Start the demo engine (terminals + richer corruption) in parallel with GPU distortion
    timerRefs.current.push(
      window.setTimeout(() => {
        window.dispatchEvent(new CustomEvent("hyk-demo-start"))
      }, 2000),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("browser-resize")
      }, 3000),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("close-terminal")
      }, 3500),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("wallpaper-glitch")
      }, 3800),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("icon-flicker")
      }, 4200),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("desktop-instability")
      }, 4500),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("browser-move")
      }, 4800),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("focus-terminal")
      }, 5200),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("flash-screen")
      }, 5500),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("logo-flash")
      }, 6000),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("focus-browser")
      }, 6200),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("breach-message")
      }, 6500),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        setTakeoverPhase("screen-black")
        dispatchBreachPhase("screen-black")
      }, 7000),
    )
    timerRefs.current.push(
      window.setTimeout(() => {
        dispatchBreachPhase("reload")
      }, 7500),
    )
  }, [cleanupCountdown, dispatchBreachPhase, dispatchCountdownState])

  const resetCountdown = useCallback(() => {
    cleanupCountdown()
    setRemainingTime(null)
    dispatchCountdownState(false)
  }, [cleanupCountdown, dispatchCountdownState])

  const startCountdown = useCallback(() => {
    if (showStartedRef.current) return
    cleanupCountdown()
    const initialValue = 10
    countdownRef.current = initialValue
    setRemainingTime(initialValue)
    dispatchCountdownState(true)

    intervalRef.current = window.setInterval(() => {
      setRemainingTime((current) => {
        if (current === null) return null
        if (current <= 1) {
          cleanupCountdown()
          void startShow()
          return 0
        }
        const next = current - 1
        countdownRef.current = next
        return next
      })
    }, 1000)
  }, [cleanupCountdown, startShow])

  const forceStartShow = useCallback(() => {
    if (showStartedRef.current) return
    void startShow()
  }, [startShow])

  useEffect(() => {
    const handleEscape = () => {
      if (!showStartedRef.current) {
        forceStartShow()
      }
    }

    window.addEventListener("hyk-breach-escape", handleEscape)

    return () => {
      window.removeEventListener("hyk-breach-escape", handleEscape)
      cleanupCountdown()
      finishTakeover()
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [cleanupCountdown, finishTakeover, forceStartShow])

  return {
    showStarted,
    takeoverActive,
    takeoverPhase,
    remainingTime,
    countdownActive:
      remainingTime !== null && remainingTime > 0 && !showStarted,
    startShow,
    startCountdown,
    resetCountdown,
    forceStartShow,
  }
}
