import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Leaf, Eye, EyeOff } from 'lucide-react'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', email: '', password: '', password2: '' })
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.username.trim()) return setError('Username is required.')
    if (!form.password) return setError('Password is required.')
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    if (form.password !== form.password2) return setError('Passwords do not match.')
    setLoading(true)
    try {
      await register(form)
      navigate('/')
    } catch (err) {
      const data = err.response?.data
      if (data?.username) setError(`Username: ${data.username[0]}`)
      else if (data?.password) setError(`Password: ${data.password[0]}`)
      else if (data?.email) setError(`Email: ${data.email[0]}`)
      else if (!err.response) setError('Cannot connect to server. Make sure backend is running on port 8000.')
      else setError(Object.values(data || {}).flat().join(' ') || 'Registration failed.')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-10 max-w-md mx-auto relative overflow-hidden"
      style={{background: 'linear-gradient(135deg, #020c04 0%, #0a1f0d 50%, #061209 100%)'}}>

      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none" style={{background: 'radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%)', top: '-80px'}} />

      <div className="flex flex-col items-center mb-6 z-10">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-2"
          style={{background: 'linear-gradient(135deg, #15803d, #22c55e)', boxShadow: '0 0 30px rgba(34,197,94,0.3)'}}>
          <Leaf size={24} className="text-white" fill="white" />
        </div>
        <h1 className="font-display font-bold text-2xl text-white">EcoWise</h1>
      </div>

      <div className="w-full z-10 rounded-2xl p-6" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.15)', backdropFilter: 'blur(20px)'}}>
        <h2 className="font-display font-semibold text-xl text-white mb-1">Create account</h2>
        <p className="text-gray-500 text-sm mb-4">Start your energy saving journey</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">First name</label>
              <input className="input-field" placeholder="John" autoComplete="given-name" value={form.first_name} onChange={set('first_name')} />
            </div>
            <div>
              <label className="label">Last name</label>
              <input className="input-field" placeholder="Doe" autoComplete="family-name" value={form.last_name} onChange={set('last_name')} />
            </div>
          </div>
          <div>
            <label className="label">Username <span className="text-red-400">*</span></label>
            <input className="input-field" placeholder="johndoe" autoComplete="username" value={form.username} onChange={set('username')} />
          </div>
          <div>
            <label className="label">Email</label>
            <input type="email" className="input-field" placeholder="john@example.com" autoComplete="email" value={form.email} onChange={set('email')} />
          </div>
          <div>
            <label className="label">Password <span className="text-red-400">*</span></label>
            <div className="relative">
              <input type={showPass ? 'text' : 'password'} className="input-field pr-11"
                placeholder="At least 6 characters" autoComplete="new-password"
                value={form.password} onChange={set('password')} />
              <button type="button" onClick={() => setShowPass(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div>
            <label className="label">Confirm password <span className="text-red-400">*</span></label>
            <input type={showPass ? 'text' : 'password'} className="input-field"
              placeholder="••••••••" autoComplete="new-password"
              value={form.password2} onChange={set('password2')} />
            {form.password2 && form.password !== form.password2 && <p className="text-red-400 text-xs mt-1">Passwords do not match</p>}
            {form.password2 && form.password === form.password2 && form.password.length >= 6 && <p className="text-green-400 text-xs mt-1">✓ Passwords match</p>}
          </div>

          {error && <div className="rounded-xl p-3 text-red-300 text-sm" style={{background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)'}}>{error}</div>}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white transition-all mt-1"
            style={{background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 4px 20px rgba(34,197,94,0.3)'}}>
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account →'}
          </button>
        </form>
      </div>

      <p className="text-gray-500 text-sm mt-5 z-10">
        Already have an account?{' '}
        <Link to="/login" className="text-green-400 hover:text-green-300 font-medium">Sign in</Link>
      </p>
    </div>
  )
}
