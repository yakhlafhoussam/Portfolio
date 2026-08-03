/**
 * ThemeContext.tsx
 *
 * Shared theme state for the HYK desktop environment.
 * Consumed by all applications and window chrome.
 */
import { createContext, useContext } from "react"

export type Theme = "light" | "dark"

export type ThemeTokens = {
  isDark: boolean

  // ─── Surfaces ────────────────────────────────────────────────────────────────
  bg: string // Main content background
  bgSidebar: string // Sidebar / secondary panel
  bgToolbar: string // Toolbar / top bar inside window
  bgInput: string // Input fields, address bars
  bgHover: string // Subtle hover overlay

  // ─── Text ────────────────────────────────────────────────────────────────────
  text: string // Primary body text
  textMuted: string // Secondary / muted text
  textFaint: string // Placeholder / disabled text

  // ─── Borders ─────────────────────────────────────────────────────────────────
  border: string // Standard divider
  borderStrong: string // Focused / active element border

  // ─── Window chrome ───────────────────────────────────────────────────────────
  windowBg: string
  titleBarBg: string
  titleBarBgFocused: string
  titleText: string
  titleTextFocused: string
  windowBorder: string
  windowBorderFocused: string
  windowShadow: string
  windowShadowFocused: string

  // ─── Color transition helper ──────────────────────────────────────────────────
  transition: string
}

const DARK: ThemeTokens = {
  isDark: true,

  bg: "#1a1a1e",
  bgSidebar: "#1e1e21",
  bgToolbar: "#252528",
  bgInput: "rgba(0,0,0,0.25)",
  bgHover: "rgba(255,255,255,0.04)",

  text: "#e2e2e2",
  textMuted: "rgba(255,255,255,0.55)",
  textFaint: "rgba(255,255,255,0.28)",

  border: "rgba(255,255,255,0.06)",
  borderStrong: "rgba(255,255,255,0.12)",

  windowBg: "#222225",
  titleBarBg: "#232326",
  titleBarBgFocused: "#2c2c2f",
  titleText: "rgba(255,255,255,0.35)",
  titleTextFocused: "rgba(255,255,255,0.85)",
  windowBorder: "rgba(255,255,255,0.08)",
  windowBorderFocused: "rgba(74,222,128,0.28)",
  windowShadow: "0 24px 64px rgba(0,0,0,0.7), 0 4px 16px rgba(0,0,0,0.4)",
  windowShadowFocused:
    "0 28px 72px rgba(0,0,0,0.85), 0 0 16px rgba(74,222,128,0.06)",

  transition:
    "background-color 280ms ease-in-out, color 280ms ease-in-out, border-color 280ms ease-in-out, box-shadow 280ms ease-in-out",
}

const LIGHT: ThemeTokens = {
  isDark: false,

  bg: "#f5f5f7",
  bgSidebar: "#ebebed",
  bgToolbar: "#e8e8ea",
  bgInput: "rgba(0,0,0,0.06)",
  bgHover: "rgba(0,0,0,0.04)",

  text: "#1c1c1e",
  textMuted: "rgba(0,0,0,0.55)",
  textFaint: "rgba(0,0,0,0.30)",

  border: "rgba(0,0,0,0.08)",
  borderStrong: "rgba(0,0,0,0.14)",

  windowBg: "#ffffff",
  titleBarBg: "#f0f0f2",
  titleBarBgFocused: "#e8e8ea",
  titleText: "rgba(0,0,0,0.35)",
  titleTextFocused: "rgba(0,0,0,0.80)",
  windowBorder: "rgba(0,0,0,0.10)",
  windowBorderFocused: "rgba(37,99,235,0.35)",
  windowShadow: "0 16px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.08)",
  windowShadowFocused:
    "0 20px 56px rgba(0,0,0,0.18), 0 0 12px rgba(37,99,235,0.08)",

  transition:
    "background-color 280ms ease-in-out, color 280ms ease-in-out, border-color 280ms ease-in-out, box-shadow 280ms ease-in-out",
}

export function getTheme(isDark: boolean): ThemeTokens {
  return isDark ? DARK : LIGHT
}

export const ThemeContext = createContext<ThemeTokens>(DARK)

export function useTheme(): ThemeTokens {
  return useContext(ThemeContext)
}
