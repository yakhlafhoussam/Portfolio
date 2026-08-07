import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import path from "node:path"
import fs from "node:fs"

// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  const siteUrl = env.VITE_SITE_URL?.replace(/\/$/, "") ?? ""

  return {
    plugins: [
      react(),
      tailwindcss(),
      // ── Inject VITE_SITE_URL into dist files at build time ────────────────
      {
        name: "seo-inject",
        apply: "build",
        closeBundle() {
          const outDir = "dist"

          // ── index.html — inject URL-dependent meta tags before </head> ────
          const htmlPath = path.join(outDir, "index.html")
          if (fs.existsSync(htmlPath)) {
            const seoTags = [
              `    <link rel="canonical" href="${siteUrl}/" />`,
              `    <meta property="og:type" content="website" />`,
              `    <meta property="og:url" content="${siteUrl}/" />`,
              `    <meta property="og:title" content="HYK — Houssam YAKHLAF · Full-Stack Developer" />`,
              `    <meta property="og:description" content="Explore the portfolio of Houssam YAKHLAF — a Full-Stack Developer from Morocco. Projects, skills, and experience through a virtual desktop environment." />`,
              `    <meta property="og:image" content="${siteUrl}/og-image.png" />`,
              `    <meta property="og:image:width" content="1200" />`,
              `    <meta property="og:image:height" content="630" />`,
              `    <meta property="og:site_name" content="HYK Portfolio" />`,
              `    <meta property="og:locale" content="en_US" />`,
              `    <meta name="twitter:card" content="summary_large_image" />`,
              `    <meta name="twitter:url" content="${siteUrl}/" />`,
              `    <meta name="twitter:title" content="HYK — Houssam YAKHLAF · Full-Stack Developer" />`,
              `    <meta name="twitter:description" content="Explore the portfolio of Houssam YAKHLAF — a Full-Stack Developer from Morocco. Projects, skills, and experience through a virtual desktop environment." />`,
              `    <meta name="twitter:image" content="${siteUrl}/og-image.png" />`,
            ].join("\n")

            const html = fs
              .readFileSync(htmlPath, "utf-8")
              .replace("</head>", `${seoTags}\n  </head>`)
            fs.writeFileSync(htmlPath, html)
          }

          // ── sitemap.xml — replace placeholder ─────────────────────────────
          const sitemapPath = path.join(outDir, "sitemap.xml")
          if (fs.existsSync(sitemapPath)) {
            const content = fs
              .readFileSync(sitemapPath, "utf-8")
              .replace(/__VITE_SITE_URL__/g, siteUrl)
            fs.writeFileSync(sitemapPath, content)
          }

          // ── robots.txt — replace placeholder ──────────────────────────────
          const robotsPath = path.join(outDir, "robots.txt")
          if (fs.existsSync(robotsPath)) {
            const content = fs
              .readFileSync(robotsPath, "utf-8")
              .replace(/__VITE_SITE_URL__/g, siteUrl)
            fs.writeFileSync(robotsPath, content)
          }
        },
      },
    ],
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: 5173,
    },
  }
})
