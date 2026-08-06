/**
 * HYK Article State
 *
 * Determines which scenario to show based on the relationship between
 * Firestore (hykViewed) and LocalStorage (hykViewed).
 *
 * States:
 *   "normal"               — not yet viewed, show the real HYK article
 *   "already-viewed"       — viewed normally: FS=true, LS=true
 *   "localstorage-cheat"   — FS=true, LS=false (key exists, value false)
 *   "localstorage-deleted" — FS=true, LS key missing entirely
 *   "bypass-success"       — LS = "HYK"
 *   "bypass-fail"          — LS = "hyk"
 */

export type HykArticleState =
  | "normal"
  | "already-viewed"
  | "localstorage-cheat"
  | "localstorage-deleted"
  | "bypass-success"
  | "bypass-fail"

const STORAGE_KEY = "HYK_STORAGE"

/**
 * Reads the raw LocalStorage state for hykViewed.
 * Can be a top-level key "hykViewed" or nested inside JSON HYK_STORAGE.
 */
export function getRawLocalHykViewedValue(): string | null {
  try {
    const topLevel = window.localStorage.getItem("hykViewed")
    if (topLevel !== null) return topLevel

    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed = JSON.parse(raw)
      const val = parsed?.hyk?.viewed
      if (val !== undefined && val !== null) {
        return String(val)
      }
    }
  } catch {}
  return null
}

/**
 * Derives the HYK article state from:
 *   - firestoreBlocked: true if the feed API returned 403 (Firestore says hykViewed=true)
 *   - localValue:       the LocalStorage value string (or null if missing)
 */
export function getHykArticleState(
  firestoreBlocked: boolean,
  localValue: string | null,
): HykArticleState {
  if (localValue === "HYK") {
    return "bypass-success"
  }
  if (localValue === "hyk") {
    return "bypass-fail"
  }

  if (!firestoreBlocked) {
    return "normal"
  }

  // Firestore says viewed=true — now check LocalStorage value
  if (localValue === "true") {
    return "already-viewed"
  }
  if (localValue === "false") {
    return "localstorage-cheat"
  }
  // localValue === null → key was deleted (or any other random text)
  return "localstorage-deleted"
}

/**
 * Convenience: reads LocalStorage and returns the current HYK article state
 * given whether the feed API blocked access.
 */
export function resolveHykArticleState(
  firestoreBlocked: boolean,
): HykArticleState {
  const local = getRawLocalHykViewedValue()
  return getHykArticleState(firestoreBlocked, local)
}

