import { useState, useEffect } from 'react'
import { Bell, DollarSign, Zap, Check, Trash2, CheckCheck } from 'lucide-react'
import api from '../utils/api'

export default function Settings() {
  const [settings, setSettings] = useState({ cost_per_kwh: 0.12, alert_threshold_kwh: 5.0 })
  const [notifications, setNotifications] = useState([])
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/settings/'), api.get('/notifications/')])
      .then(([s, n]) => { setSettings(s.data); setNotifications(n.data) })
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    await api.put('/settings/', settings)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const markAllRead = async () => {
    await api.post('/notifications/mark_all_read/')
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
  }

  const deleteNotif = async (id) => {
    await api.delete(`/notifications/${id}/`)
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  if (loading) return (
    <div className="flex justify-center mt-20">
      <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <h2 className="font-display font-bold text-xl text-white">Settings</h2>
        <p className="text-gray-500 text-sm">Configure your energy preferences</p>
      </div>

      {/* Energy settings */}
      <div className="card p-5 space-y-4">
        <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
          <DollarSign size={15} className="text-primary-400" /> Cost & Alerts
        </h3>

        <div>
          <label className="label">Cost per kWh ($)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">KES</span>
            <input
              type="number" step="0.01" min="0"
              className="input-field pl-8"
              value={settings.cost_per_kwh}
              onChange={e => setSettings(s => ({ ...s, cost_per_kwh: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Average Kenya Power rate is ~KES 20/kWh</p>
        </div>

        <div>
          <label className="label">Alert threshold (kWh/day)</label>
          <div className="relative">
            <Zap size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-yellow-400" />
            <input
              type="number" step="0.5" min="0.5"
              className="input-field pl-9"
              value={settings.alert_threshold_kwh}
              onChange={e => setSettings(s => ({ ...s, alert_threshold_kwh: parseFloat(e.target.value) || 0 }))}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1">Appliances exceeding this will trigger a warning</p>
        </div>

        <button
          onClick={handleSave}
          className={`btn-primary w-full flex items-center justify-center gap-2 transition-all duration-300 ${saved ? 'bg-primary-600' : ''}`}
        >
          {saved ? <><Check size={15} /> Saved!</> : 'Save Settings'}
        </button>
      </div>

      {/* Notifications */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-white text-sm flex items-center gap-2">
            <Bell size={15} className="text-yellow-400" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-yellow-500 text-dark-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </h3>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-xs text-primary-400 hover:text-primary-300">
              <CheckCheck size={13} /> Mark all read
            </button>
          )}
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={28} className="text-dark-400 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No notifications yet</p>
            <p className="text-gray-600 text-xs mt-1">Alerts will appear when appliances exceed your threshold</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.slice(0, 20).map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
                  n.is_read
                    ? 'bg-dark-600/50 border-dark-500/50'
                    : 'bg-yellow-900/20 border-yellow-800/40'
                }`}
              >
                <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.is_read ? 'bg-dark-400' : 'bg-yellow-400'}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${n.is_read ? 'text-gray-400' : 'text-gray-200'}`}>
                    {n.message}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(n.created_at).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <button
                  onClick={() => deleteNotif(n.id)}
                  className="text-dark-400 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* App info */}
      <div className="card p-4 text-center">
        <div className="text-2xl mb-2">⚡</div>
        <p className="font-display font-semibold text-white text-sm">EcoWise v1.0</p>
        <p className="text-gray-600 text-xs mt-1">Smart Energy Monitor · Built with Django + React</p>
      </div>
    </div>
  )
}
