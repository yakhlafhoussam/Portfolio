import { initializeApp, getApps, cert } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

const projectId = process.env.FIREBASE_PROJECT_ID?.trim().replace(/^["']|["']$/g, "")
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL?.trim().replace(/^["']|["']$/g, "")
const privateKey = process.env.FIREBASE_PRIVATE_KEY
  ? process.env.FIREBASE_PRIVATE_KEY.trim()
      .replace(/^["']|["']$/g, "")
      .replace(/\\n/g, "\n")
  : undefined

if (getApps().length === 0) {
  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    })
  } else {
    initializeApp()
  }
}

export const db = getFirestore()
export default db
