export interface StorageState {
  theme: "light" | "dark"
  hyk: {
    viewed: boolean
    [key: string]: any
  }
  browser?: {
    [key: string]: any
  }
  desktop?: {
    [key: string]: any
  }
  window?: {
    [key: string]: any
  }
  accessibility?: {
    [key: string]: any
  }
  events?: {
    [key: string]: any
  }
  [key: string]: any
}

const STORAGE_KEY = "HYK_STORAGE"

// The default that is ONLY written for brand-new visitors
// (db.hykViewed === false AND storage is absent).
const DEFAULT_STORAGE: StorageState = {
  theme: "dark",
  hyk: {
    viewed: false,
  },
}

export const storageManager = {
  // ─── Raw read ────────────────────────────────────────────────────────────────
  // Returns the parsed object if it exists, or null.
  // NEVER writes anything. NEVER auto-initialises.
  readRaw(): StorageState | null {
    try {
      if (typeof window === "undefined") return null
      const data = window.localStorage.getItem(STORAGE_KEY)
      if (!data) return null
      return JSON.parse(data) as StorageState
    } catch {
      return null
    }
  },

  // ─── Safe read ───────────────────────────────────────────────────────────────
  // Returns the stored object when present.
  // When missing, returns a safe in-memory default WITHOUT writing anything —
  // the caller is responsible for deciding whether to persist it.
  read(): StorageState {
    return this.readRaw() ?? { ...DEFAULT_STORAGE }
  },

  // ─── First-visit initialisation ──────────────────────────────────────────────
  // Called ONLY by the visitor service when:
  //   db.hykViewed === false  AND  HYK_STORAGE is absent
  // This is the ONLY place that writes the default HYK state.
  initializeForNewVisitor(): void {
    try {
      if (typeof window === "undefined") return
      if (window.localStorage.getItem(STORAGE_KEY) !== null) {
        // Storage already exists — never overwrite.
        return
      }
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STORAGE))
    } catch (e) {
      console.error("StorageManager: failed to initialise for new visitor:", e)
    }
  },

  // ─── Theme-only update ───────────────────────────────────────────────────────
  // Updates ONLY the theme field.
  // If storage is missing it creates a minimal record with just the theme
  // (no hyk field written) so the HYK state is never accidentally reset.
  updateTheme(theme: "light" | "dark"): void {
    try {
      if (typeof window === "undefined") return
      const existing = this.readRaw()
      if (existing) {
        // Merge: keep everything, change only theme.
        existing.theme = theme
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing))
      } else {
        // Storage absent — write a minimal record with just the theme.
        // hyk is intentionally omitted so bypass detection stays intact.
        const minimal: Partial<StorageState> & { theme: "light" | "dark" } = { theme }
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(minimal))
      }
    } catch (e) {
      console.error("StorageManager: failed to update theme:", e)
    }
  },

  // ─── General update ──────────────────────────────────────────────────────────
  // Merges a partial object or runs an updater function.
  // Should NOT be used to touch hyk during startup/init — use the visitor
  // service for that. Safe for use after the article is read.
  update(
    updater: Partial<StorageState> | ((prev: StorageState) => StorageState),
  ): StorageState {
    try {
      if (typeof window === "undefined") return this.read()
      const current = this.read()
      let next: StorageState

      if (typeof updater === "function") {
        next = updater(current)
      } else {
        next = {
          ...current,
          ...updater,
          // Deep-merge hyk if caller provided it
          ...(updater.hyk
            ? {
                hyk: {
                  ...current.hyk,
                  ...updater.hyk,
                },
              }
            : {}),
        }
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    } catch (e) {
      console.error("StorageManager: failed to update storage:", e)
      return this.read()
    }
  },

  // ─── Hard reset ──────────────────────────────────────────────────────────────
  // Only used by explicit user-triggered actions (e.g. easter egg cleanup).
  reset(): void {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(DEFAULT_STORAGE),
        )
      }
    } catch (e) {
      console.error("StorageManager: failed to reset storage:", e)
    }
  },
}
