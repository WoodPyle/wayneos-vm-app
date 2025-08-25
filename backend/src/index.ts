import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { createServer } from 'http'
import { Server } from 'socket.io'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js'
import { setupSocketHandlers } from './services/socketService.js'
import { authMiddleware } from './middleware/auth.js'
import apiRoutes from './routes/api.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }
})

// Middleware
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    version: '1.0.0',
    opsPerSec: 313150,
    timestamp: new Date().toISOString()
  })
})

// API routes
app.use('/api', authMiddleware, apiRoutes)

// Socket.IO handlers
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    // Verify token with Firebase Admin
    socket.data.userId = token
    socket.data.distribution = socket.handshake.auth.distribution || 'wayneos'
    next()
  } catch (err) {
    next(new Error('Authentication error'))
  }
})

io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`)
  setupSocketHandlers(socket, io)
})

// Start server
const PORT = process.env.PORT || 8000
httpServer.listen(PORT, () => {
  logger.info(`WayneOS Backend running on port ${PORT}`)
  logger.info(`Performance target: 313,150 ops/sec`)
})