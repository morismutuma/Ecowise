export default function CircularGauge({ value, max, unit = 'kWh', label = 'Today' }) {
  const pct = Math.min(value / max, 1)
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference * (1 - pct)

  const color = pct < 0.4 ? '#22c55e' : pct < 0.75 ? '#eab308' : '#ef4444'
  const glowColor = pct < 0.4 ? 'rgba(24,184,101,0.3)' : pct < 0.75 ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 140, height: 140 }}>
        <svg width="140" height="140" viewBox="0 0 140 140">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#1a2e1e" strokeWidth="10" />
          {/* Arc */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            transform="rotate(-90 70 70)"
            filter="url(#glow)"
            style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 0.5s ease' }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-display font-bold text-white leading-none">
            {value < 10 ? value.toFixed(2) : value.toFixed(1)}
          </span>
          <span className="text-xs text-gray-400 mt-0.5">{unit}</span>
        </div>
      </div>
      <p className="text-xs text-gray-500 mt-2 font-medium">{label}</p>
    </div>
  )
}
