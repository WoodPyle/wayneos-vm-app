import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import { useNavigate } from 'react-router-dom'

const distributions = [
  { id: 'wayneos', name: 'WayneOS Base', description: 'Full AI-native OS experience' },
  { id: 'wayneos-top', name: 'TOP Automotive', description: 'TanOak franchise management' },
  { id: 'wayneos-sspb', name: 'SS-PB Healthcare', description: 'Healthcare staffing platform' },
  { id: 'wayneos-financial', name: 'Financial Modeling', description: 'Reconciliation & analysis' },
  { id: 'wayneos-enterprise', name: 'Enterprise Edition', description: 'Full business transformation' },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [selectedDist, setSelectedDist] = useState('wayneos')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { login, setDistribution } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    
    try {
      setDistribution(selectedDist)
      await login(email, password)
      navigate('/desktop')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-wayneos-primary to-wayneos-secondary">
      <div className="bg-wayneos-primary/90 backdrop-blur-lg p-8 rounded-lg shadow-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">WayneOS</h1>
          <p className="text-gray-400">AI-Native Operating System</p>
          <p className="text-xs text-wayneos-accent mt-2">313,150 ops/sec</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-wayneos-terminal border border-wayneos-accent rounded focus:outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-wayneos-terminal border border-wayneos-accent rounded focus:outline-none focus:border-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Distribution</label>
            <select
              value={selectedDist}
              onChange={(e) => setSelectedDist(e.target.value)}
              className="w-full px-4 py-2 bg-wayneos-terminal border border-wayneos-accent rounded focus:outline-none focus:border-blue-400"
            >
              {distributions.map(dist => (
                <option key={dist.id} value={dist.id}>
                  {dist.name} - {dist.description}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="text-red-400 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-wayneos-accent hover:bg-wayneos-secondary transition-colors rounded font-medium disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login to WayneOS'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>Demo Credentials:</p>
          <p>demo@wayneos.ai / demo123</p>
        </div>
      </div>
    </div>
  )
}