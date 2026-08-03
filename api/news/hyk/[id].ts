import type { VercelRequest, VercelResponse } from "@vercel/node"
import { getNewsById } from "../../lib/news"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  const { id } = req.query
  const articleId = Array.isArray(id) ? id[0] : id

  if (!articleId) {
    return res.status(400).json({ error: "Missing article id" })
  }

  try {
    const article = await getNewsById(articleId)
    if (!article) {
      return res.status(404).json({ error: "Article not found" })
    }
    return res.status(200).json(article)
  } catch (error) {
    console.error(`Error fetching article ${articleId}:`, error)
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) })
  }
}
