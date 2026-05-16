import { Calendar, Clock } from 'lucide-react'
import Card from '../ui/Card'
import { mockEvents } from '../../data/mockData'

const colorStyles: Record<string, { dot: string; pill: string }> = {
  violet:  { dot: 'bg-lavender',   pill: 'bg-lavender-light text-violet-600' },
  pink:    { dot: 'bg-dusty-pink', pill: 'bg-dusty-pink-light text-pink-600' },
  emerald: { dot: 'bg-mint',       pill: 'bg-mint-light text-emerald-600' },
  orange:  { dot: 'bg-peach',      pill: 'bg-peach-light text-orange-600' },
}

export default function NextEventCard() {
  const [next, ...upcoming] = mockEvents.slice(0, 3)
  const styles = colorStyles[next.color] ?? colorStyles.violet

  return (
    <Card accent="lavender" className="p-5 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Calendar size={15} className="text-violet-400" />
        <h3 className="text-sm font-500 text-gray-700">האירוע הקרוב</h3>
      </div>

      {/* Featured event */}
      <div className="rounded-2xl p-4" style={{ background: '#F5F2FF' }}>
        <div className="flex items-start gap-3">
          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ${styles.dot}`} />
          <div className="min-w-0">
            <p className="font-500 text-gray-800 text-sm leading-snug mb-1.5">{next.title}</p>
            <div className="flex items-center gap-1.5">
              <Clock size={11} className="text-gray-400" />
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles.pill}`}>
                {next.date} · {next.time}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming */}
      <div>
        <p className="text-[11px] font-medium text-gray-400 uppercase tracking-wide mb-2">בהמשך</p>
        <div className="space-y-2">
          {upcoming.map(ev => {
            const s = colorStyles[ev.color] ?? colorStyles.violet
            return (
              <div key={ev.id} className="flex items-center gap-2.5">
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
                <span className="text-sm text-gray-600 flex-1 truncate">{ev.title}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">{ev.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
