import { Zap, Trash2, Edit3 } from 'lucide-react'

const CATEGORY_ICONS = {
  heating: '🌡️', kitchen: '🍳', entertainment: '📺',
  lighting: '💡', charging: '🔌', other: '⚡',
}

export default function ApplianceCard({ appliance, threshold, onEdit, onDelete }) {
  const { name, category, watt_rating, daily_hours, daily_kwh, usage_level } = appliance
  const pct = Math.min((daily_kwh / (threshold || 5)) * 100, 100)

  const levelStyles = {
    low:    { bar: 'progress-low',    badge: 'badge-low',    text: 'Low' },
    medium: { bar: 'progress-medium', badge: 'badge-medium', text: 'Medium' },
    high:   { bar: 'progress-high',   badge: 'badge-high',   text: 'High' },
  }
  const style = levelStyles[usage_level] || levelStyles.low

  return (
    <div className="card p-4 animate-fade-in">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-dark-600 flex items-center justify-center text-lg">
            {CATEGORY_ICONS[category] || '⚡'}
          </div>
          <div>
            <h3 className="font-display font-semibold text-white text-sm">{name}</h3>
            <p className="text-xs text-gray-500 capitalize">{category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${style.badge}`}>
            {style.text}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Zap size={11} className="text-yellow-400" />
          {watt_rating}W
        </span>
        <span>⏱ {daily_hours}h/day</span>
        <span className="ml-auto font-semibold text-white">{daily_kwh.toFixed(3)} kWh</span>
      </div>

      <div className="h-1.5 bg-dark-500 rounded-full overflow-hidden mb-3">
        <div
          className={`h-full rounded-full transition-all duration-700 ${style.bar}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="flex gap-2">
        <button onClick={() => onEdit(appliance)} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-gray-400 hover:text-white py-1.5 rounded-lg bg-dark-600 hover:bg-dark-500 transition-colors">
          <Edit3 size={12} /> Edit
        </button>
        <button onClick={() => onDelete(appliance.id)} className="flex-1 flex items-center justify-center gap-1.5 text-xs text-red-400 hover:text-red-300 py-1.5 rounded-lg bg-dark-600 hover:bg-red-900/30 transition-colors">
          <Trash2 size={12} /> Remove
        </button>
      </div>
    </div>
  )
}
