import { useTheme } from "../../context/ThemeContext"
import type { AppId } from "../desktop/Desktop"
import folderSvg from "@/assets/icons/folder.svg"
import trashSvg from "@/assets/icons/trash.svg"
import terminalSvg from "@/assets/icons/terminal.svg"
import browserSvg from "@/assets/icons/browser.svg"
import profileSvg from "@/assets/icons/profile.svg"
import pdfSvg from "@/assets/icons/pdf.svg"
import graduationSvg from "@/assets/icons/graduation.svg"
import briefcaseSvg from "@/assets/icons/briefcase.svg"

type Props = {
  recentApps: AppId[]
  onSelectApp: (appId: AppId) => void
  onCloseApp: (appId: AppId) => void
  onClearAll: () => void
  onCloseOverlay: () => void
}

const APP_INFO: Record<AppId, { label: string; icon: string }> = {
  profile: { label: "Profile", icon: profileSvg },
  projects: { label: "Projects", icon: folderSvg },
  experience: { label: "Experience", icon: briefcaseSvg },
  education: { label: "Education", icon: graduationSvg },
  gallery: { label: "Gallery", icon: folderSvg },
  resume: { label: "Resume.pdf", icon: pdfSvg },
  browser: { label: "Browser", icon: browserSvg },
  terminal: { label: "Terminal", icon: terminalSvg },
  recycle: { label: "Trash", icon: trashSvg },
  editor: { label: "Editor", icon: pdfSvg },
}

export default function MobileRecentApps({
  recentApps,
  onSelectApp,
  onCloseApp,
  onClearAll,
  onCloseOverlay,
}: Props) {
  const t = useTheme()

  return (
    <div
      onClick={onCloseOverlay}
      style={{
        position: "fixed",
        inset: 0,
        background: t.isDark ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.4)",
        backdropFilter: "blur(18px)",
        zIndex: 10003,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        animation: "fadeIn 0.22s ease-out",
      }}
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes cardSlideUp {
          from { transform: translateY(40px) scale(0.95); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
      `}</style>

      {/* Main card list container */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 30,
          animation: "cardSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {recentApps.length === 0 ? (
          <div
            style={{
              color: t.textMuted,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            No recent apps
          </div>
        ) : (
          <>
            {/* Horizontal card scroller */}
            <div
              style={{
                display: "flex",
                gap: 20,
                overflowX: "auto",
                width: "100%",
                padding: "10px 40px",
                boxSizing: "border-box",
                scrollSnapType: "x mandatory",
                scrollbarWidth: "none",
              }}
            >
              {recentApps.map((appId) => {
                const info = APP_INFO[appId] || { label: "App", icon: folderSvg }
                return (
                  <div
                    key={appId}
                    style={{
                      flexShrink: 0,
                      width: 200,
                      height: 320,
                      background: t.isDark
                        ? "rgba(30, 30, 35, 0.85)"
                        : "rgba(255, 255, 255, 0.9)",
                      border: "1px solid " + t.border,
                      borderRadius: 16,
                      boxShadow: t.isDark
                        ? "0 20px 40px rgba(0,0,0,0.4)"
                        : "0 15px 30px rgba(0,0,0,0.06)",
                      display: "flex",
                      flexDirection: "column",
                      overflow: "hidden",
                      scrollSnapAlign: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => onSelectApp(appId)}
                  >
                    {/* Card header */}
                    <div
                      style={{
                        padding: "12px 14px",
                        borderBottom: "1px solid " + t.border,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        background: t.isDark
                          ? "rgba(255,255,255,0.02)"
                          : "rgba(0,0,0,0.02)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <img
                          src={info.icon}
                          alt=""
                          style={{ width: 16, height: 16, objectFit: "contain" }}
                        />
                        <span
                          style={{
                            fontSize: "0.78rem",
                            fontWeight: 600,
                            color: t.text,
                          }}
                        >
                          {info.label}
                        </span>
                      </div>
                      {/* Close individual app button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onCloseApp(appId)
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: t.textFaint,
                          padding: 4,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        >
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </div>

                    {/* Card snapshot simulation */}
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 16,
                        background: t.isDark
                          ? "radial-gradient(circle, rgba(255,255,255,0.02) 0%, transparent 100%)"
                          : "radial-gradient(circle, rgba(0,0,0,0.02) 0%, transparent 100%)",
                      }}
                    >
                      <img
                        src={info.icon}
                        alt=""
                        style={{
                          width: 48,
                          height: 48,
                          objectFit: "contain",
                          opacity: 0.8,
                        }}
                      />
                      <span
                        style={{
                          fontSize: "0.75rem",
                          color: t.textMuted,
                          fontWeight: 500,
                        }}
                      >
                        Active Session
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Clear All button */}
            <button
              onClick={onClearAll}
              style={{
                background: t.isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                border: "1px solid " + t.border,
                borderRadius: 20,
                padding: "8px 18px",
                color: t.text,
                fontSize: "0.76rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = t.bgHover
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = t.isDark
                  ? "rgba(255,255,255,0.06)"
                  : "rgba(0,0,0,0.05)"
              }}
            >
              Clear All
            </button>
          </>
        )}
      </div>
    </div>
  )
}
