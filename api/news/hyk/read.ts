import type { VercelRequest, VercelResponse } from "@vercel/node"
import { findVisitor } from "../../lib/visitor.js"
import { getNewsById } from "../../lib/news.js"
import { db } from "../../lib/firebase.js"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { fingerprint, articleId } = req.body || {}

  if (!fingerprint || !articleId) {
    return res.status(400).json({ error: "Missing fingerprint or articleId" })
  }

  try {
    const visitor = await findVisitor(fingerprint)
    if (!visitor) {
      return res.status(404).json({ error: "Visitor not found" })
    }

    const article = await getNewsById(articleId)
    if (!article) {
      return res.status(404).json({ error: "Article not found" })
    }

    await db.collection("visitors").doc(fingerprint).update({
      "news.hykViewed": true,
    })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Error marking article as read:", error)
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) })
  }
}
