import { useState } from 'react'
import { Sparkles, MessageCircle, FileText, Image, Layers, Settings, Crown } from 'lucide-react'
import { useClients } from '../store/ClientsContext'
import ChatTab      from '../components/studio/ChatTab'
import TextGenTab   from '../components/studio/TextGenTab'
import ImageGenTab  from '../components/studio/ImageGenTab'
import GraphicsTab  from '../components/studio/GraphicsTab'
import BrandSetupModal from '../components/studio/BrandSetupModal'
import type { ClientDetail, BrandProfile } from '../types'

type Tab = 'chat' | 'text' | 'image' | 'graphics'

const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'chat',     label: "צ'אט AI",  icon: MessageCircle },
  { id: 'text',     label: 'יצירת טקסט', icon: FileText },
  { id: 'image',    label: 'יצירת תמונה', icon: Image },
  { id: 'graphics', label: 'גרפיקה',     icon: Layers },
]

const avatarGradients = [
  ['#C4B5FD', '#F9A8D4'],
  ['#F9A8D4', '#FED7AA'],
  ['#BBF7D0', '#C4B5FD'],
  ['#FED7AA', '#FEF08A'],
]

function ClientListItem({
  client, index, selected, onSelect,
}: { client: ClientDetail; index: number; selected: boolean; onSelect: () => void }) {
  const brand = client.brandProfile
  const [g0, g1] = avatarGradients[index % 4]

  return (
    <button
      onClick={onSelect}
      className={`w-full text-right px-3 py-3 rounded-2xl transition-all flex items-center gap-3 ${
        selected ? 'bg-white shadow-sm' : 'hover:bg-white/60'
      }`}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-600 text-base flex-shrink-0"
        style={{ background: `linear-gradient(135deg, ${g0}, ${g1})` }}>
        {client.avatar}
      </div>
      <div className="flex-1 min-w-0 text-right">
        <p className="text-sm font-600 text-gray-800 truncate">{client.name}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <p className="text-[10px] text-gray-400">{client.platform}</p>
          {brand && (
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-full border border-white/50"
                style={{ backgroundColor: brand.primaryColor }} />
              <span className="w-3 h-3 rounded-full border border-white/50"
                style={{ backgroundColor: brand.secondaryColor }} />
            </div>
          )}
          {!brand && <span className="text-[9px] text-amber-500 font-600">ללא מותג</span>}
        </div>
      </div>
    </button>
  )
}

export default function StudioAIPage() {
  const { clients, updateBrandProfile } = useClients()
  const activeClients = clients.filter(c => c.status !== 'rejected')

  const [selectedId, setSelectedId] = useState<string>(activeClients[0]?.id ?? '')
  const [activeTab, setActiveTab]   = useState<Tab>('chat')
  const [showBrand, setShowBrand]   = useState(false)

  const client = clients.find(c => c.id === selectedId) ?? activeClients[0]

  if (!client) {
    return (
      <div className="text-center py-20 text-gray-400" dir="rtl">
        <Sparkles size={40} className="mx-auto mb-3 opacity-20" />
        <p className="text-sm">אין לקוחות — הוסיפי לקוח ראשון</p>
      </div>
    )
  }

  const brand  = client.brandProfile
  const accent = brand?.primaryColor   ?? '#C084FC'
  const accent2= brand?.secondaryColor ?? '#F472B6'

  function saveBrand(profile: BrandProfile) {
    updateBrandProfile(client.id, profile)
  }

  return (
    <div className="flex gap-4 h-full" dir="ltr">

      {/* ── Left: Client list ──────────────────────────────────── */}
      <div className="w-52 flex-shrink-0 flex flex-col gap-2" dir="rtl">
        <div className="flex items-center gap-2 px-1 mb-1">
          <div className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #C4B5FD, #F9A8D4)' }}>
            <Sparkles size={13} className="text-white" />
          </div>
          <p className="text-sm font-700 text-gray-800">Studio AI</p>
        </div>

        <div className="bg-gray-50/80 rounded-3xl p-2 space-y-0.5">
          {activeClients.map((c, i) => (
            <ClientListItem
              key={c.id} client={c} index={i}
              selected={c.id === client.id}
              onSelect={() => setSelectedId(c.id)}
            />
          ))}
        </div>
      </div>

      {/* ── Right: Studio workspace ────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0" dir="rtl">

        {/* Client header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-600"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent2})` }}>
              {client.avatar}
            </div>
            <div>
              <h2 className="font-700 text-gray-900">{client.name}</h2>
              <p className="text-xs text-gray-400">{client.platform}</p>
            </div>
            {brand && (
              <div className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-full px-3 py-1">
                <Crown size={10} className="text-violet-400" />
                <span className="text-[10px] font-600 text-violet-600" style={{ fontFamily: brand.fontHeading }}>
                  {brand.fontHeading}
                </span>
                <div className="flex gap-1 mr-1">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.primaryColor }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: brand.secondaryColor }} />
                </div>
              </div>
            )}
          </div>
          <button onClick={() => setShowBrand(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-600 border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600">
            <Settings size={14} />
            {brand ? 'ערכי מותג' : 'הגדרי מותג'}
          </button>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 bg-gray-100/80 rounded-2xl p-1 mb-4">
          {TABS.map(tab => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-600 transition-all ${
                  activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}>
                <Icon size={15} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab content */}
        <div className="bg-white rounded-3xl p-5 flex-1 overflow-auto" style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          {activeTab === 'chat'     && <ChatTab     client={client} />}
          {activeTab === 'text'     && <TextGenTab  client={client} />}
          {activeTab === 'image'    && <ImageGenTab client={client} />}
          {activeTab === 'graphics' && <GraphicsTab client={client} />}
        </div>
      </div>

      {showBrand && (
        <BrandSetupModal
          clientName={client.name}
          initial={brand}
          onSave={saveBrand}
          onClose={() => setShowBrand(false)}
        />
      )}
    </div>
  )
}
