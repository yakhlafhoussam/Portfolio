import { useCallback, useEffect, useRef, useState } from "react"

export function useHykExperience() {
  const [showStarted, setShowStarted] = useState(false)
  const [remainingTime, setRemainingTime] = useState<number | null>(null)
  const countdownRef = useRef<number | null>(null)
  const intervalRef = useRef<number | null>(null)
  const showStartedRef = useRef(false)

  const cleanupCountdown = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    countdownRef.current = null
  }, [])

  const startShow = useCallback(async () => {
    if (showStartedRef.current) return
    showStartedRef.current = true
    setShowStarted(true)
    cleanupCountdown()
    setRemainingTime(0)
    console.log("[HYK] startShow() called")
    alert("HYK SHOW STARTED")
  }, [cleanupCountdown])

  const resetCountdown = useCallback(() => {
    cleanupCountdown()
    setRemainingTime(null)
  }, [cleanupCountdown])

  const startCountdown = useCallback(() => {
    if (showStartedRef.current) return
    console.log("[HYK] startCountdown() called")
    cleanupCountdown()
    const initialValue = 10
    countdownRef.current = initialValue
    setRemainingTime(initialValue)
    console.log("[HYK] countdown value", initialValue)

    intervalRef.current = window.setInterval(() => {
      setRemainingTime((current) => {
        if (current === null) return null
        if (current <= 1) {
          console.log("[HYK] countdown value", 0)
          cleanupCountdown()
          void startShow()
          return 0
        }
        const next = current - 1
        countdownRef.current = next
        console.log("[HYK] countdown value", next)
        return next
      })
    }, 1000)
  }, [cleanupCountdown, startShow])

  const forceStartShow = useCallback(() => {
    if (showStartedRef.current) return
    console.log("[HYK] forceStartShow() called")
    void startShow()
  }, [startShow])

  useEffect(() => {
    return () => {
      cleanupCountdown()
    }
  }, [cleanupCountdown])

  return {
    showStarted,
    remainingTime,
    countdownActive:
      remainingTime !== null && remainingTime > 0 && !showStarted,
    startShow,
    startCountdown,
    resetCountdown,
    forceStartShow,
  }
}
