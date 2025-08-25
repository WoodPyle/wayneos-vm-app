import { useEffect, useState } from 'react'
import ClaudeTerminal from '../components/ClaudeTerminal'
import StatusBar from '../components/StatusBar'
import { useAuthStore } from '../stores/authStore'

export default function DesktopPage() {
  const { distribution } = useAuthStore()
  const [opsPerSec, setOpsPerSec] = useState(313150)

  useEffect(() => {
    // Simulate ops/sec fluctuation
    const interval = setInterval(() => {
      setOpsPerSec(313150 + Math.floor(Math.random() * 10000) - 5000)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-wayneos-primary to-wayneos-terminal">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-6xl h-full">
          <div className="bg-wayneos-terminal/80 backdrop-blur rounded-lg shadow-2xl h-full flex flex-col">
            <div className="bg-wayneos-secondary/50 px-4 py-2 rounded-t-lg flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <h2 className="text-sm font-mono">Claude Code Terminal - {distribution}</h2>
              <div className="text-xs text-wayneos-accent font-mono">
                {opsPerSec.toLocaleString()} ops/sec
              </div>
            </div>
            <div className="flex-1 p-4">
              <ClaudeTerminal />
            </div>
          </div>
        </div>
      </div>
      <StatusBar opsPerSec={opsPerSec} />
    </div>
  )
}