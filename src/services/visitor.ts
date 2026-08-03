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
      storageManager.update({
        hyk: {
          viewed: data.hykViewed ?? false,
        },
      })
    }
  } catch (error) {
    console.error("Visitor service initialization failed:", error)
  }
}
