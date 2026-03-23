import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts'
import api from '../utils/api'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-dark-600 border border-dark-400 rounded-xl px-3 py-2 text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      <p className="text-primary-300 font-semibold">{payload[0].value.toFixed(3)} kWh</p>
    </div>
  )
}

export default function Charts() {
  const [data, setData] = useState(null)
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    api.get(`/charts/?days=${days}`).then(r => setData(r.data)).finally(() => setLoading(false))
  }, [days])

  const dailyFormatted = data?.daily.map(d => ({
    ...d,
    label: new Date(d.date+'T00:00').toLocaleDateString('en-US', { month:'short', day:'numeric' })
  })) || []

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl text-white">Analytics</h2>
        <div className="flex gap-1 bg-dark-700 rounded-xl p-1 border border-dark-400">
          {[7, 14, 30].map(d => (
            <button key={d} onClick={() => setDays(d)} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${days === d ? 'bg-primary-600 text-white' : 'text-gray-500 hover:text-gray-300'}`}>
              {d}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center mt-20">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Daily usage line chart */}
          <div className="card p-4">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Daily Consumption</h3>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={dailyFormatted} margin={{ top: 5, right: 5, bottom: 0, left: -15 }}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#18b865" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#18b865" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1e" />
                <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="kwh" stroke="#18b865" strokeWidth={2} fill="url(#areaGradient)" dot={false} activeDot={{ r: 4, fill: '#18b865' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Appliance bar chart */}
          <div className="card p-4">
            <h3 className="font-display font-semibold text-white text-sm mb-4">Appliance Breakdown</h3>
            {data?.appliances.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-10">No appliance data yet. Add some devices.</p>
            ) : (
              <ResponsiveContainer width="100%" height={Math.max(180, (data?.appliances.length || 1) * 42)}>
                <BarChart data={data?.appliances} layout="vertical" margin={{ top: 0, right: 10, bottom: 0, left: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2e1e" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#9ca3af', fontSize: 11 }} tickLine={false} axisLine={false} width={58} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="kwh" fill="#18b865" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Summary */}
          {data?.appliances.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              <div className="card p-4">
                <p className="text-xs text-gray-500 mb-1">Highest consumer</p>
                <p className="font-display font-semibold text-white text-sm">{data.appliances[0]?.name}</p>
                <p className="text-primary-400 text-xs mt-0.5">{data.appliances[0]?.kwh.toFixed(3)} kWh/day</p>
              </div>
              <div className="card p-4">
                <p className="text-xs text-gray-500 mb-1">Total daily avg</p>
                <p className="font-display font-semibold text-white text-sm">
                  {data.appliances.reduce((s, a) => s + a.kwh, 0).toFixed(2)} kWh
                </p>
                <p className="text-gray-500 text-xs mt-0.5">{data.appliances.length} devices</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
