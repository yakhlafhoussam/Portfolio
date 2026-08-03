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

const DEFAULT_STORAGE: StorageState = {
  theme: "light",
  hyk: {
    viewed: false,
  },
}

export const storageManager = {
  initialize(): void {
    try {
      if (
        typeof window !== "undefined" &&
        !window.localStorage.getItem(STORAGE_KEY)
      ) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(DEFAULT_STORAGE),
        )
      }
    } catch (e) {
      console.error("StorageManager: failed to initialize storage:", e)
    }
  },

  read(): StorageState {
    try {
      if (typeof window === "undefined") return DEFAULT_STORAGE
      const data = window.localStorage.getItem(STORAGE_KEY)
      if (!data) {
        this.initialize()
        const initialized = window.localStorage.getItem(STORAGE_KEY)
        return initialized ? JSON.parse(initialized) : DEFAULT_STORAGE
      }
      return JSON.parse(data) as StorageState
    } catch (e) {
      console.error(
        "StorageManager: failed to read storage, returning default:",
        e,
      )
      return DEFAULT_STORAGE
    }
  },

  update(
    updater: Partial<StorageState> | ((prev: StorageState) => StorageState),
  ): StorageState {
    try {
      if (typeof window === "undefined") return DEFAULT_STORAGE
      const current = this.read()
      let next: StorageState

      if (typeof updater === "function") {
        next = updater(current)
      } else {
        next = {
          ...current,
          ...updater,
          // Support merging for nested fields like hyk if specified
          hyk: {
            ...current.hyk,
            ...(updater.hyk || {}),
          },
        }
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    } catch (e) {
      console.error("StorageManager: failed to update storage:", e)
      return DEFAULT_STORAGE
    }
  },

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
