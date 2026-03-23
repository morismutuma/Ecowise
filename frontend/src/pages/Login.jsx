import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const { login, getSavedUsername } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = getSavedUsername()
    if (saved) { setForm(f => ({ ...f, username: saved })); setRemember(true) }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.username.trim()) return setError('Please enter your username.')
    if (!form.password) return setError('Please enter your password.')
    setError(''); setLoading(true)
    try {
      await login(form.username.trim(), form.password, remember)
      navigate('/')
    } catch (err) {
      const status = err.response?.status
      const detail = err.response?.data?.detail
      if (status === 401 || detail?.toLowerCase().includes('no active account')) {
        setError('Username or password is incorrect.')
      } else if (!err.response) {
        setError('Cannot connect to server. Make sure the backend is running on port 8000.')
      } else {
        setError(detail || 'Login failed. Please try again.')
      }
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 max-w-md mx-auto relative overflow-hidden"
      style={{background: 'linear-gradient(135deg, #020c04 0%, #0a1f0d 50%, #061209 100%)'}}>

      {/* Background glow orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none" style={{background: 'radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)', top: '-80px'}} />
      <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full pointer-events-none" style={{background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)'}} />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="absolute rounded-full animate-pulse-slow"
            style={{
              width: `${4 + i * 2}px`, height: `${4 + i * 2}px`,
              background: 'rgba(34,197,94,0.3)',
              left: `${10 + i * 15}%`, top: `${15 + i * 12}%`,
              animationDelay: `${i * 0.8}s`
            }} />
        ))}
      </div>

      {/* Logo */}
      <div className="flex flex-col items-center mb-8 z-10">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-3"
          style={{background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 0 40px rgba(34,197,94,0.35)'}}>
          <Leaf size={28} className="text-white" fill="white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-white">EcoWise</h1>
        <p className="text-green-400 text-sm mt-1 tracking-wide">Smart Energy Monitor</p>
      </div>

      <div className="w-full z-10 rounded-2xl p-6" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.15)', backdropFilter: 'blur(20px)'}}>
        <h2 className="font-display font-semibold text-xl text-white mb-1">Sign in</h2>
        <p className="text-gray-500 text-sm mb-5">Monitor your home energy usage</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Username</label>
            <input className="input-field" placeholder="your username" autoComplete="username"
              value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
          </div>
          <div>
            <label className="label">Password</label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} className="input-field pr-11"
                placeholder="••••••••" autoComplete="current-password"
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <div onClick={() => setRemember(r => !r)}
              className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${remember ? 'border-green-500' : 'border-dark-400 bg-dark-600'}`}
              style={remember ? {background: '#22c55e'} : {}}>
              {remember && <span className="text-white text-[10px] font-bold">✓</span>}
            </div>
            <span className="text-sm text-gray-400">Remember my username</span>
          </label>

          {error && <div className="rounded-xl p-3 text-red-300 text-sm" style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)'}}>{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all"
            style={{background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)'}}>
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Sign In →'}
          </button>
        </form>
      </div>

      <p className="text-gray-500 text-sm mt-6 z-10">
        Don't have an account?{' '}
        <Link to="/register" className="text-green-400 hover:text-green-300 font-medium">Create one</Link>
      </p>
    </div>
  )
}
