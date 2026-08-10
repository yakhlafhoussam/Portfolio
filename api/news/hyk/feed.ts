import type { VercelRequest, VercelResponse } from "@vercel/node"
import { findVisitor } from "../../lib/visitor.js"
import { getPublishedNews } from "../../lib/news.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { fingerprint } = req.body || {}

  if (!fingerprint) {
    return res.status(400).json({ error: "Missing fingerprint" })
  }

  try {
    const visitor = await findVisitor(fingerprint)
    if (visitor && visitor.news?.hykViewed === true) {
      return res.status(403).json({ error: "Something went wrong." })
    }

    const list = await getPublishedNews()
    return res.status(200).json(list)
  } catch (error) {
    console.error("Error fetching secure news feed:", error)
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) })
  }
}
