import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { storageManager } from "../lib/storage"

export async function initVisitor(): Promise<void> {
  try {
    const fp = await FingerprintJS.load()
    const result = await fp.get()
    const fingerprint = result.visitorId

    const response = await fetch("/api/visitor/init", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fingerprint }),
    })

    if (!response.ok) return

    const data = await response.json()
    const dbHykViewed: boolean = data.hykViewed ?? false

    // ── LocalStorage lifecycle ───────────────────────────────────────────────
    //
    // Case 1: db.hykViewed === false  AND  storage is missing
    //   → First-time visitor. Create the default HYK localStorage.
    //      This is the ONLY moment automatic creation is allowed.
    //
    // Case 2: db.hykViewed === true  AND  storage is missing
    //   → User already read the article (possibly on another device or after
    //      clearing storage). The missing storage is intentionally interpreted
    //      as a bypass attempt — leave localStorage completely untouched.
    //
    // Case 3 & 4: db.hykViewed === true  AND  storage exists
    //   → Preserve whatever is there. Theme changes are handled separately.
    //      Never inject hykViewed into an existing object.
    //
    // Case 5: User opens & reads the HYK article again
    //   → Handled inside Browser.tsx via storageManager.update({ hyk: { viewed: true } }).
    //      That is the ONLY other place allowed to write hyk state.
    //
    const storageExists = storageManager.readRaw() !== null

    if (!dbHykViewed && !storageExists) {
      // Case 1 — brand-new visitor
      storageManager.initializeForNewVisitor()
    }
    // All other cases: do nothing. Storage is preserved exactly as-is.

  } catch (error) {
    console.error("Visitor service initialization failed:", error)
  }
}
