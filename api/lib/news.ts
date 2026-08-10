import { db } from "./firebase.js"
import { Timestamp } from "firebase-admin/firestore"

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NewsPreview {
  id: string
  title: string
  summary: string
  category: string
  readingTime: string
  cover: string
  miniImage: string
  publishedAt: string | null
  author: string
  date: string
}

export interface NewsDoc {
  id: string
  title: string
  summary: string
  category: string
  readingTime: string
  cover: string
  miniImage: string
  content: Array<{ type: "paragraph" | "heading"; text: string }>
  published: boolean
  publishedAt: string | Timestamp | null
  author: string
  date: string
}

export interface NewsArticle extends NewsDoc {}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toISOString(value: unknown): string | null {
  if (!value) return null
  if (value instanceof Timestamp) return value.toDate().toISOString()
  if (typeof value === "string") return value
  return null
}

// ─── Service ──────────────────────────────────────────────────────────────────

export async function getPublishedNews(): Promise<NewsPreview[]> {
  const querySnap = await db
    .collection("news")
    .where("published", "==", true)
    .orderBy("publishedAt", "desc")
    .get()

  const list: NewsPreview[] = []

  querySnap.forEach((doc) => {
    const data = doc.data() as NewsDoc
    list.push({
      id: data.id || doc.id,
      title: data.title,
      summary: data.summary,
      category: data.category,
      readingTime: data.readingTime,
      cover: data.cover,
      miniImage: data.miniImage,
      publishedAt: toISOString(data.publishedAt),
      author: data.author,
      date: data.date,
    })
  })

  return list
}

export async function getNewsById(id: string): Promise<NewsArticle | null> {
  const docSnap = await db.collection("news").doc(id).get()
  if (!docSnap.exists) return null
  const data = docSnap.data() as NewsDoc
  if (!data.published) return null
  return {
    ...data,
    id: data.id || id,
    publishedAt: toISOString(data.publishedAt),
  } as NewsArticle
}
