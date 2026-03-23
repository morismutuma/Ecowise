import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const PRESETS = [
  { name: 'Heater',        watt_rating: 2000, category: 'heating',       daily_hours: 4  },
  { name: 'Air Conditioner', watt_rating: 1500, category: 'heating',     daily_hours: 6  },
  { name: 'Refrigerator',  watt_rating: 150,  category: 'kitchen',       daily_hours: 24 },
  { name: 'Microwave',     watt_rating: 1200, category: 'kitchen',       daily_hours: 0.5},
  { name: 'Kettle',        watt_rating: 2200, category: 'kitchen',       daily_hours: 0.25},
  { name: 'TV (LED 55")',  watt_rating: 120,  category: 'entertainment', daily_hours: 5  },
  { name: 'Desktop PC',   watt_rating: 300,  category: 'entertainment',  daily_hours: 8  },
  { name: 'LED Bulb',     watt_rating: 10,   category: 'lighting',       daily_hours: 6  },
  { name: 'Phone Charger',watt_rating: 20,   category: 'charging',       daily_hours: 2  },
  { name: 'Laptop',       watt_rating: 65,   category: 'charging',       daily_hours: 8  },
]

const CATEGORIES = ['heating','kitchen','entertainment','lighting','charging','other']

export default function ApplianceModal({ appliance, onSave, onClose }) {
  const [form, setForm] = useState({
    name: '', category: 'other', watt_rating: '', daily_hours: '1', is_active: true,
  })
  const [error, setError] = useState('')

  useEffect(() => {
    if (appliance) setForm({
      name: appliance.name, category: appliance.category,
      watt_rating: appliance.watt_rating, daily_hours: appliance.daily_hours,
      is_active: appliance.is_active,
    })
  }, [appliance])

  const handlePreset = (preset) => {
    setForm(f => ({ ...f, name: preset.name, watt_rating: preset.watt_rating, category: preset.category, daily_hours: preset.daily_hours }))
  }

  const handleSubmit = () => {
    if (!form.name || !form.watt_rating) return setError('Name and wattage are required.')
    if (isNaN(form.watt_rating) || form.watt_rating <= 0) return setError('Enter a valid wattage.')
    setError('')
    onSave({ ...form, watt_rating: parseFloat(form.watt_rating), daily_hours: parseFloat(form.daily_hours) })
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-end justify-center z-50" onClick={onClose}>
      <div className="bg-dark-700 border border-dark-400 rounded-t-3xl w-full max-w-md p-6 pb-10 animate-slide-up" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display font-semibold text-white text-lg">
            {appliance ? 'Edit Appliance' : 'Add Appliance'}
          </h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-dark-500 flex items-center justify-center">
            <X size={16} className="text-gray-400" />
          </button>
        </div>

        {/* Quick presets */}
        {!appliance && (
          <div className="mb-4">
            <p className="label">Quick add</p>
            <div className="flex gap-2 flex-wrap">
              {PRESETS.slice(0,6).map(p => (
                <button key={p.name} onClick={() => handlePreset(p)} className="text-xs px-2.5 py-1 rounded-lg bg-dark-600 border border-dark-400 text-gray-300 hover:border-primary-700 hover:text-primary-300 transition-all">
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-3">
          <div>
            <label className="label">Appliance name</label>
            <input className="input-field" placeholder="e.g. Living Room Heater" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Category</label>
              <select className="input-field" value={form.category} onChange={e => setForm(f => ({...f, category: e.target.value}))}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Watt rating (W)</label>
              <input type="number" className="input-field" placeholder="e.g. 2000" value={form.watt_rating} onChange={e => setForm(f => ({...f, watt_rating: e.target.value}))} />
            </div>
          </div>
          <div>
            <label className="label">Daily usage (hours)</label>
            <input type="number" step="0.25" min="0" max="24" className="input-field" value={form.daily_hours} onChange={e => setForm(f => ({...f, daily_hours: e.target.value}))} />
            {form.watt_rating && form.daily_hours && (
              <p className="text-xs text-primary-400 mt-1.5">
                ≈ {(parseFloat(form.watt_rating) * parseFloat(form.daily_hours) / 1000).toFixed(3)} kWh/day
              </p>
            )}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mt-3">{error}</p>}

        <div className="flex gap-3 mt-5">
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            {appliance ? 'Save Changes' : 'Add Appliance'}
          </button>
        </div>
      </div>
    </div>
  )
}
