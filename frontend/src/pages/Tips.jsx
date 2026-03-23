import { Youtube, ExternalLink } from 'lucide-react'

const TIPS = [
  { icon:'💡', title:'Switch to LED bulbs', desc:'LED bulbs use up to 80% less energy than incandescent bulbs and last 25x longer.', saving:'Save up to 80%', category:'Lighting' },
  { icon:'🔌', title:'Unplug idle chargers', desc:'Phone chargers draw power even when nothing is connected. Unplug when not in use.', saving:'Save ~KES 500/yr', category:'Charging' },
  { icon:'🌡️', title:'Set smart thermostat', desc:'Lowering heating by 1°C can reduce your bill by up to 10%. Use a timer to heat only when home.', saving:'Save up to 10%', category:'Heating' },
  { icon:'📺', title:'Use sleep timers on TVs', desc:'TVs left on standby still consume power. Enable sleep timers or unplug overnight.', saving:'Save ~KES 300/yr', category:'Entertainment' },
  { icon:'🍳', title:'Match pot to burner size', desc:'Using a small pan on a large burner wastes up to 40% of the energy produced.', saving:'Save up to 40%', category:'Kitchen' },
  { icon:'❄️', title:'Keep fridge coils clean', desc:'Dusty condenser coils make your fridge work harder. Clean them every 6 months.', saving:'Save up to 15%', category:'Kitchen' },
  { icon:'🌅', title:'Use natural light', desc:'Open blinds during the day instead of turning on lights. Simple but very effective.', saving:'Save daily', category:'Lighting' },
  { icon:'⏰', title:'Run appliances off-peak', desc:'Electricity is cheaper at night on some tariffs. Schedule heavy appliances accordingly.', saving:'Save on tariff', category:'General' },
  { icon:'🏠', title:'Insulate doors & windows', desc:'Draught-proofing your home reduces heat loss and cuts heating bills significantly.', saving:'Save up to 25%', category:'Heating' },
]

const WATCH_VIDEOS = [
  { title:'How to Save Electricity at Home', channel:'Practical Engineering', url:'https://www.youtube.com/results?search_query=how+to+save+electricity+at+home', thumb:'⚡' },
  { title:'Energy Saving Tips for Kenyans', channel:'Kenya Power', url:'https://www.youtube.com/results?search_query=energy+saving+tips+kenya', thumb:'🇰🇪' },
  { title:'Understanding Your Electricity Bill', channel:'EcoLearn', url:'https://www.youtube.com/results?search_query=understand+electricity+bill+kenya', thumb:'📋' },
  { title:'Solar Energy Basics', channel:'Solar Africa', url:'https://www.youtube.com/results?search_query=solar+energy+basics+africa', thumb:'☀️' },
  { title:'LED vs Incandescent Bulbs', channel:'Tech Explained', url:'https://www.youtube.com/results?search_query=LED+vs+incandescent+bulbs+energy', thumb:'💡' },
  { title:'Home Energy Audit Guide', channel:'Green Living', url:'https://www.youtube.com/results?search_query=home+energy+audit+guide', thumb:'🏠' },
]

const CATEGORY_COLORS = {
  Lighting: 'text-yellow-300 bg-yellow-900/30 border-yellow-800/40',
  Charging: 'text-blue-300 bg-blue-900/30 border-blue-800/40',
  Heating: 'text-red-300 bg-red-900/30 border-red-800/40',
  Entertainment: 'text-purple-300 bg-purple-900/30 border-purple-800/40',
  Kitchen: 'text-orange-300 bg-orange-900/30 border-orange-800/40',
  General: 'text-green-300 bg-green-900/30 border-green-800/40',
}

export default function Tips() {
  return (
    <div className="animate-fade-in space-y-5">
      <div>
        <h2 className="font-display font-bold text-xl text-white">Energy Tips</h2>
        <p className="text-gray-500 text-sm">Simple changes that save money</p>
      </div>

      {/* Hero tip */}
      <div className="p-5 rounded-2xl relative overflow-hidden"
        style={{background: 'linear-gradient(135deg, rgba(22,163,74,0.2), rgba(34,197,94,0.05))', border: '1px solid rgba(34,197,94,0.25)'}}>
        <div className="absolute -right-4 -top-4 text-6xl opacity-10">⚡</div>
        <p className="text-xs text-green-400 font-medium uppercase tracking-widest mb-2">Pro tip</p>
        <h3 className="font-display font-bold text-white text-lg leading-snug mb-2">
          Audit your home energy usage monthly
        </h3>
        <p className="text-gray-400 text-sm leading-relaxed">
          Regular monitoring can cut household energy bills by 15–20%. EcoWise helps you do this automatically — just keep your appliance list up to date.
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-lg px-3 py-1.5"
          style={{background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.25)'}}>
          <span className="text-green-300 text-xs font-semibold">💰 Average saving: KES 3,000–6,000/year</span>
        </div>
      </div>

      {/* Tips list */}
      <div className="space-y-2.5">
        {TIPS.map((tip, i) => (
          <div key={i} className="flex gap-4 items-start p-4 rounded-xl"
            style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}>
            <div className="text-2xl flex-shrink-0 mt-0.5">{tip.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h4 className="font-display font-semibold text-white text-sm">{tip.title}</h4>
                <span className={`text-xs px-2 py-0.5 rounded-full border font-medium flex-shrink-0 ${CATEGORY_COLORS[tip.category]}`}>
                  {tip.category}
                </span>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed mb-1.5">{tip.desc}</p>
              <span className="text-green-400 text-xs font-medium">{tip.saving}</span>
            </div>
          </div>
        ))}
      </div>

      {/* WatchWise Section */}
      <div>
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)'}}>
            <Youtube size={16} className="text-red-400" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-base">WatchWise</h3>
            <p className="text-gray-500 text-xs">Learn through video — click to watch on YouTube</p>
          </div>
        </div>

        <div className="space-y-2.5">
          {WATCH_VIDEOS.map((v, i) => (
            <a key={i} href={v.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 p-3.5 rounded-xl transition-all duration-200 group"
              style={{background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)'}}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)'}}>
                {v.thumb}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white group-hover:text-green-300 transition-colors truncate">{v.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{v.channel}</p>
              </div>
              <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg flex-shrink-0"
                style={{background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.2)'}}>
                <Youtube size={12} className="text-red-400" />
                <span className="text-red-300 text-xs font-medium">Watch</span>
                <ExternalLink size={10} className="text-red-400 ml-0.5" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
