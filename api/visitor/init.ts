import type { VercelRequest, VercelResponse } from "@vercel/node"
import { findVisitor, createVisitor, recordVisit } from "../lib/visitor"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { fingerprint } = req.body || {}

  if (!fingerprint) {
    return res.status(400).json({ error: "Missing fingerprint" })
  }

  try {
    // 1. Resolve client IP
    let ip = ""
    const xForwardedFor = req.headers["x-forwarded-for"]
    if (xForwardedFor) {
      ip = Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor.split(",")[0].trim()
    } else {
      ip = req.socket.remoteAddress || ""
    }

    // Normalize local host formats
    let cleanIp = ip
    if (cleanIp === "::1" || cleanIp === "::ffff:127.0.0.1") {
      cleanIp = "127.0.0.1"
    }

    // Check if the IP is loopback or private IPv4/IPv6 address
    const isLocal =
      !cleanIp ||
      cleanIp === "127.0.0.1" ||
      cleanIp.startsWith("10.") ||
      cleanIp.startsWith("192.168.") ||
      cleanIp.startsWith("172.16.") ||
      cleanIp.startsWith("172.17.") ||
      cleanIp.startsWith("172.18.") ||
      cleanIp.startsWith("172.19.") ||
      cleanIp.startsWith("172.2") ||
      cleanIp.startsWith("172.30.") ||
      cleanIp.startsWith("172.31.") ||
      cleanIp.startsWith("fe80:")

    // 2. Lookup geographic and ISP details
    let geoData = {
      ip: cleanIp,
      country: "Local Development",
      region: "Local Development",
      city: "Local Development",
      timezone: "Local Development",
      isp: "Local Development",
    }

    if (!isLocal) {
      try {
        const geoRes = await fetch(`https://ipapi.co/${cleanIp}/json/`, {
          headers: { "User-Agent": "hyk-portfolio-api" },
        })
        if (geoRes.ok) {
          const raw = await geoRes.json()
          if (!raw.error) {
            geoData = {
              ip: cleanIp,
              country: raw.country_name || "",
              region: raw.region || "",
              city: raw.city || "",
              timezone: raw.timezone || "",
              isp: raw.org || "",
            }
          }
        }
      } catch (e) {
        console.error("Failed to fetch geo information for IP:", cleanIp, e)
      }
    }

    // 3. Process database registration / record visit
    const existing = await findVisitor(fingerprint)

    if (existing) {
      await recordVisit(fingerprint)
      return res.status(200).json({
        exists: true,
        hykViewed: existing.news?.hykViewed ?? false,
      })
    } else {
      const created = await createVisitor({
        fingerprint,
        ...geoData,
      })
      return res.status(200).json({
        exists: false,
        hykViewed: created.news?.hykViewed ?? false,
      })
    }
  } catch (error) {
    console.error("Error in /api/visitor/init handler:", error)
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) })
  }
}
