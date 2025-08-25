import { Router } from 'express'
import { AuthRequest } from '../middleware/auth.js'
import { logger } from '../utils/logger.js'

const router = Router()

// Get user profile
router.get('/profile', async (req: AuthRequest, res) => {
  try {
    res.json({
      uid: req.user?.uid,
      email: req.user?.email,
      distribution: req.query.distribution || 'wayneos'
    })
  } catch (error) {
    logger.error('Profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get system status
router.get('/status', async (req: AuthRequest, res) => {
  try {
    res.json({
      status: 'operational',
      opsPerSec: 313150,
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      distribution: req.query.distribution || 'wayneos'
    })
  } catch (error) {
    logger.error('Status error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get available distributions
router.get('/distributions', async (req: AuthRequest, res) => {
  try {
    res.json([
      {
        id: 'wayneos',
        name: 'WayneOS Base',
        description: 'Full AI-native OS experience',
        agents: 16,
        features: ['Natural language control', 'All agents', 'Full capabilities']
      },
      {
        id: 'wayneos-top',
        name: 'TOP Automotive',
        description: 'TanOak franchise management',
        agents: 11,
        features: ['Invoice reconciliation', 'Inventory tracking', 'Payroll management']
      },
      {
        id: 'wayneos-sspb',
        name: 'SS-PB Healthcare',
        description: 'Healthcare staffing platform',
        agents: 6,
        features: ['Shift scheduling', 'Credential verification', 'Compliance tracking']
      },
      {
        id: 'wayneos-financial',
        name: 'Financial Modeling',
        description: 'Reconciliation & analysis',
        agents: 8,
        features: ['Account reconciliation', 'Report generation', 'Trend analysis']
      },
      {
        id: 'wayneos-enterprise',
        name: 'Enterprise Edition',
        description: 'Full business transformation',
        agents: 16,
        features: ['All features', 'Enterprise support', 'Custom integrations']
      }
    ])
  } catch (error) {
    logger.error('Distributions error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router