import type { VercelRequest, VercelResponse } from "@vercel/node"
import { getPublishedNews } from "../../lib/news"

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const list = await getPublishedNews()
    return res.status(200).json(list)
  } catch (error) {
    console.error("Error fetching published news:", error)
    return res
      .status(500)
      .json({ error: "Internal server error", details: String(error) })
  }
}
