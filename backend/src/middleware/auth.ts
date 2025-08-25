import { Request, Response, NextFunction } from 'express'
import admin from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json'

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID
  })
}

export interface AuthRequest extends Request {
  user?: admin.auth.DecodedIdToken
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const decodedToken = await admin.auth().verifyIdToken(token)
    req.user = decodedToken
    next()
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({ error: 'Unauthorized' })
  }
}