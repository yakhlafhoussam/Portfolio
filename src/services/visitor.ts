import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { storageManager } from "../lib/storage"

export async function initVisitor(): Promise<void> {
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    const fingerprint = result.visitorId

    const response = await fetch("/api/visitor/init", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fingerprint }),
    })

    if (response.ok) {
      const data = await response.json()

      // Read current local value
      let localValue: string | null = null
      try {
        const topLevel = window.localStorage.getItem("hykViewed")
        if (topLevel !== null) {
          localValue = topLevel
        } else {
          const raw = window.localStorage.getItem("HYK_STORAGE")
          if (raw !== null) {
            const parsed = JSON.parse(raw)
            const val = parsed?.hyk?.viewed
            if (val !== undefined && val !== null) {
              localValue = String(val)
            }
          }
        }
      } catch {}

      // If the user has set a special bypass code (HYK or hyk) or is in a cheat/deleted state,
      // we do NOT restore the normal "viewed = true" state yet.
      const isSpecialOrCheated =
        localValue === "HYK" ||
        localValue === "hyk" ||
        localValue === "false" ||
        localValue === null

      const shouldSkipRestore = data.hykViewed === true && isSpecialOrCheated

      if (!shouldSkipRestore) {
        storageManager.update({
          hyk: {
            viewed: data.hykViewed ?? false,
          },
        })
      }
    }
  } catch (error) {
    console.error("Visitor service initialization failed:", error)
  }
}
