import { useState, useEffect } from 'react'
import { Plus, Search } from 'lucide-react'
import api from '../utils/api'
import ApplianceCard from '../components/ApplianceCard'
import ApplianceModal from '../components/ApplianceModal'

export default function Appliances() {
  const [appliances, setAppliances] = useState([])
  const [threshold, setThreshold] = useState(5)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [search, setSearch] = useState('')

  const load = async () => {
    const [appRes, settRes] = await Promise.all([api.get('/appliances/'), api.get('/settings/')])
    setAppliances(appRes.data)
    setThreshold(settRes.data.alert_threshold_kwh)
  }

  useEffect(() => { load().finally(() => setLoading(false)) }, [])

  const handleSave = async (formData) => {
    if (editing) {
      await api.put(`/appliances/${editing.id}/`, formData)
    } else {
      await api.post('/appliances/', formData)
    }
    setShowModal(false); setEditing(null)
    load()
  }

  const handleDelete = async (id) => {
    if (!confirm('Remove this appliance?')) return
    await api.delete(`/appliances/${id}/`)
    setAppliances(prev => prev.filter(a => a.id !== id))
  }

  const handleEdit = (appliance) => { setEditing(appliance); setShowModal(true) }
  const openAdd = () => { setEditing(null); setShowModal(true) }

  const filtered = appliances.filter(a => a.name.toLowerCase().includes(search.toLowerCase()))
  const totalKwh = appliances.reduce((sum, a) => sum + a.daily_kwh, 0)

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display font-bold text-xl text-white">Devices</h2>
          <p className="text-xs text-gray-500">{appliances.length} appliances · {totalKwh.toFixed(2)} kWh/day total</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-1.5 text-sm px-3 py-2">
          <Plus size={15} /> Add
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
        <input className="input-field pl-9" placeholder="Search appliances…" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {loading ? (
        <div className="flex justify-center mt-16">
          <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-10 text-center mt-4">
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-gray-400 font-medium">No appliances found</p>
          <p className="text-gray-600 text-sm mt-1">{search ? 'Try a different search' : 'Add your first device to start tracking'}</p>
          {!search && (
            <button onClick={openAdd} className="btn-primary mt-4 text-sm">
              Add Appliance
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(a => (
            <ApplianceCard key={a.id} appliance={a} threshold={threshold} onEdit={handleEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {showModal && (
        <ApplianceModal appliance={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null) }} />
      )}
    </div>
  )
}
