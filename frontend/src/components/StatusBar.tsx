import { useAuthStore } from '../stores/authStore'
import { useState, useEffect } from 'react'

interface StatusBarProps {
  opsPerSec: number
}

export default function StatusBar({ opsPerSec }: StatusBarProps) {
  const { logout, distribution } = useAuthStore()
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const distributionNames: Record<string, string> = {
    'wayneos': 'WayneOS Base',
    'wayneos-top': 'TOP Automotive',
    'wayneos-sspb': 'SS-PB Healthcare',
    'wayneos-financial': 'Financial Modeling',
    'wayneos-enterprise': 'Enterprise Edition'
  }

  return (
    <div className="bg-wayneos-secondary/80 backdrop-blur border-t border-wayneos-accent/50 px-4 py-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => window.location.href = '/'}
            className="flex items-center space-x-2 hover:bg-wayneos-accent/20 px-3 py-1 rounded transition-colors"
          >
            <span>Claude</span>
          </button>
          <button className="flex items-center space-x-2 hover:bg-wayneos-accent/20 px-3 py-1 rounded transition-colors">
            <span>System</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-2 hover:bg-wayneos-accent/20 px-3 py-1 rounded transition-colors"
          >
            <span>Logout</span>
          </button>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-wayneos-accent">
            {distributionNames[distribution] || distribution}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-green-400">⚡</span>
            <span className="font-mono">{opsPerSec.toLocaleString()}</span>
          </div>
          <div className="font-mono">
            {formatTime(time)}
          </div>
        </div>
      </div>
    </div>
  )
}