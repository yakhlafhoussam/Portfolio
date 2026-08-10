import { db } from "./firebase.js"
import { FieldValue } from "firebase-admin/firestore"

export interface VisitorInput {
  fingerprint: string
  ip: string
  country: string
  region: string
  city: string
  timezone: string
  isp: string
}

export interface VisitorDoc extends VisitorInput {
  firstVisit: string
  lastVisit: string
  visitCount: number
  news: {
    hykViewed: boolean
  }
}

export async function findVisitor(
  fingerprint: string,
): Promise<VisitorDoc | null> {
  const docRef = db.collection("visitors").doc(fingerprint)
  const docSnap = await docRef.get()
  if (!docSnap.exists) return null
  return docSnap.data() as VisitorDoc
}

export async function createVisitor(input: VisitorInput): Promise<VisitorDoc> {
  const now = new Date().toISOString()
  const newDoc: VisitorDoc = {
    ...input,
    firstVisit: now,
    lastVisit: now,
    visitCount: 1,
    news: {
      hykViewed: false,
    },
  }
  await db.collection("visitors").doc(input.fingerprint).set(newDoc)
  return newDoc
}

export async function recordVisit(fingerprint: string): Promise<void> {
  const now = new Date().toISOString()
  const docRef = db.collection("visitors").doc(fingerprint)
  await docRef.update({
    lastVisit: now,
    visitCount: FieldValue.increment(1),
  })
}
