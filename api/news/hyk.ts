import type { VercelRequest, VercelResponse } from "@vercel/node"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { getFirestore } from "firebase-admin/firestore"

if (getApps().length === 0) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  })
}

const db = getFirestore()

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    await db.collection("test").add({
      message: "Hello from Vercel",
      createdAt: new Date(),
    })

    return res.status(200).json({
      status: "success",
      message: "Firestore connected",
    })
  } catch (error) {
    console.error(error)

    return res.status(500).json({
      status: "error",
      error: String(error),
    })
  }
}
