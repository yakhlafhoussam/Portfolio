/**
 * HYK Article State
 *
 * Determines which scenario to show based on the relationship between
 * Firestore (hykViewed) and LocalStorage (hykViewed).
 *
 * States:
 *   "normal"             — not yet viewed, show the real HYK article
 *   "already-viewed"     — viewed normally: FS=true, LS=true
 *   "localstorage-cheat" — FS=true, LS=false (key exists, value false)
 *   "localstorage-deleted" — FS=true, LS key missing entirely
 */

export type HykArticleState =
  | "normal"
  | "already-viewed"
  | "localstorage-cheat"
  | "localstorage-deleted"

const STORAGE_KEY = "HYK_STORAGE"

/**
 * Reads the raw LocalStorage state for hyk.viewed.
 * Returns:
 *   - true   → key exists and hyk.viewed === true
 *   - false  → key exists but hyk.viewed !== true
 *   - null   → key does not exist at all
 */
function readLocalHykViewed(): boolean | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw === null) return null
    const parsed = JSON.parse(raw)
    return parsed?.hyk?.viewed === true ? true : false
  } catch {
    return null
  }
}

/**
 * Derives the HYK article state from:
 *   - firestoreBlocked: true if the feed API returned 403 (Firestore says hykViewed=true)
 *   - localViewed:      the LocalStorage value (true | false | null=missing)
 */
export function getHykArticleState(
  firestoreBlocked: boolean,
  localViewed: boolean | null,
): HykArticleState {
  if (!firestoreBlocked) {
    return "normal"
  }
  // Firestore says viewed=true — now check LocalStorage
  if (localViewed === true) {
    return "already-viewed"
  }
  if (localViewed === false) {
    return "localstorage-cheat"
  }
  // localViewed === null → key was deleted
  return "localstorage-deleted"
}

/**
 * Convenience: reads LocalStorage and returns the current HYK article state
 * given whether the feed API blocked access.
 */
export function resolveHykArticleState(
  firestoreBlocked: boolean,
): HykArticleState {
  const local = readLocalHykViewed()
  return getHykArticleState(firestoreBlocked, local)
}
