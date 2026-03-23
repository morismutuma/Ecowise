import { useState, useEffect } from 'react'
import { Bell, TrendingUp, Zap, Leaf } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'
import CircularGauge from '../components/CircularGauge'

const CATEGORY_ICONS = { heating:'🌡️', kitchen:'🍳', entertainment:'📺', lighting:'💡', charging:'🔌', other:'⚡' }

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/dashboard/').then(r => setData(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-60">
      <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )
  if (!data) return <p className="text-gray-500 text-center mt-10">Failed to load data.</p>

  const { total_kwh_today, estimated_cost_today, alert_threshold, appliances, unread_notifications, trend } = data
  const estimatedKES = (estimated_cost_today).toFixed(2)
  const maxTrend = Math.max(...trend.map(t => t.kwh), alert_threshold, 0.1)

  return (
    <div className="space-y-4 animate-fade-in">

      {/* Notification banner */}
      {unread_notifications > 0 && (
        <button onClick={() => navigate('/settings')} className="w-full p-3.5 flex items-center gap-3 text-left rounded-2xl"
          style={{background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.25)'}}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{background: 'rgba(234,179,8,0.2)'}}>
            <Bell size={15} className="text-yellow-400" />
          </div>
          <div className="flex-1">
            <p className="text-yellow-200 text-sm font-medium">{unread_notifications} unread alert{unread_notifications > 1 ? 's' : ''}</p>
            <p className="text-yellow-500/60 text-xs">Tap to view notifications</p>
          </div>
          <span className="text-yellow-400">→</span>
        </button>
      )}

      {/* Main gauge card */}
      <div className="rounded-2xl p-5" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.15)', backdropFilter: 'blur(10px)'}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-bold text-white text-lg">Energy Today</h2>
            <p className="text-green-500/70 text-xs">{new Date().toLocaleDateString('en-KE',{weekday:'long',month:'short',day:'numeric'})}</p>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)'}}>
            <Leaf size={11} className="text-green-400" />
            <span className="text-green-400 text-xs font-medium">Live</span>
          </div>
        </div>

        <div className="flex items-center justify-around">
          <CircularGauge value={total_kwh_today} max={alert_threshold} label="Consumption" />
          <div className="space-y-3">
            <div className="rounded-xl p-3.5 min-w-[115px]" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)'}}>
              <p className="text-xs text-gray-400 mb-1">Est. Cost</p>
              <p className="font-display font-bold text-white text-lg">KES {estimatedKES}</p>
            </div>
            <div className="rounded-xl p-3.5" style={{background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)'}}>
              <p className="text-xs text-gray-400 mb-1">Devices</p>
              <p className="font-display font-bold text-white text-lg">{appliances.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-day trend */}
      <div className="rounded-2xl p-4" style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(34,197,94,0.12)'}}>
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={14} className="text-green-400" />
          <h3 className="font-display font-medium text-white text-sm">7-Day Trend</h3>
        </div>
        <div className="flex items-end gap-1.5 h-14">
          {trend.map((t, i) => {
            const h = Math.max((t.kwh / maxTrend) * 100, 4)
            const isToday = i === trend.length - 1
            return (
              <div key={t.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full rounded-t-sm transition-all duration-700"
                  style={{height: `${h}%`, background: isToday ? 'linear-gradient(to top, #16a34a, #22c55e)' : 'rgba(34,197,94,0.2)'}} />
                <span className="text-[9px] text-gray-600">
                  {new Date(t.date+'T00:00').toLocaleDateString('en-US',{weekday:'short'})[0]}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Top consumers */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display font-semibold text-white">Top Consumers</h3>
          <button onClick={() => navigate('/appliances')} className="text-xs text-green-400 hover:text-green-300">View all →</button>
        </div>

        {appliances.length === 0 ? (
          <div className="rounded-2xl p-8 text-center" style={{background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)'}}>
            <p className="text-gray-500 text-sm">No appliances yet.</p>
            <button onClick={() => navigate('/appliances')} className="mt-3 px-5 py-2 rounded-xl text-sm font-medium text-white"
              style={{background: 'linear-gradient(135deg, #16a34a, #22c55e)'}}>
              Add your first device
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {appliances.slice(0,5).map(a => {
              const pct = Math.min((a.daily_kwh / alert_threshold) * 100, 100)
              const barColor = a.usage_level === 'high' ? '#ef4444' : a.usage_level === 'medium' ? '#eab308' : '#22c55e'
              return (
                <div key={a.id} className="flex items-center gap-3 p-3.5 rounded-xl"
                  style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{background: 'rgba(255,255,255,0.06)'}}>
                    {CATEGORY_ICONS[a.category] || '⚡'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white truncate">{a.name}</span>
                      <span className="text-xs text-gray-400 ml-2 flex-shrink-0">{a.daily_kwh.toFixed(3)} kWh</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{background: 'rgba(255,255,255,0.08)'}}>
                      <div className="h-full rounded-full transition-all duration-700" style={{width: `${pct}%`, background: barColor}} />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
