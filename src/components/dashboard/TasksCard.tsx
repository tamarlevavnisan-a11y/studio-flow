import { CheckSquare } from 'lucide-react'
import Card from '../ui/Card'
import { mockTasks } from '../../data/mockData'
import { useState } from 'react'

const moduleAccent: Record<string, { dot: string; check: string }> = {
  clients:  { dot: 'bg-dusty-pink', check: 'accent-pink-400' },
  projects: { dot: 'bg-peach',      check: 'accent-orange-400' },
  calendar: { dot: 'bg-lavender',   check: 'accent-violet-400' },
  quick:    { dot: 'bg-butter',     check: 'accent-yellow-400' },
  health:   { dot: 'bg-mint',       check: 'accent-emerald-400' },
  home:     { dot: 'bg-gray-200',   check: 'accent-gray-400' },
}

const priorityIcon: Record<string, string> = { high: '🔴', medium: '🟡', low: '🟢' }

export default function TasksCard() {
  const [tasks, setTasks] = useState(mockTasks)
  const open = tasks.filter(t => !t.done)
  const done = tasks.filter(t => t.done)
  const toggle = (id: string) => setTasks(ts => ts.map(t => t.id === id ? { ...t, done: !t.done } : t))

  return (
    <Card className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CheckSquare size={15} className="text-peach" style={{ color: '#FED7AA' }} />
          <h3 className="text-sm font-500 text-gray-700">משימות פתוחות</h3>
        </div>
        <span className="text-xs text-gray-400">{open.length} נשארות</span>
      </div>

      <div className="space-y-1">
        {open.map(task => {
          const a = moduleAccent[task.module] ?? moduleAccent.home
          return (
            <label key={task.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer group transition-colors duration-150">
              <input type="checkbox" checked={false} onChange={() => toggle(task.id)}
                className={`w-4 h-4 rounded-md cursor-pointer flex-shrink-0 ${a.check}`} />
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
              <span className="text-sm text-gray-700 flex-1 group-hover:text-gray-900 transition-colors">{task.title}</span>
              <span className="text-xs flex-shrink-0 opacity-60">{priorityIcon[task.priority]}</span>
            </label>
          )
        })}
      </div>

      {done.length > 0 && (
        <>
          <div className="my-3 border-t border-gray-50" />
          {done.map(task => {
            const a = moduleAccent[task.module] ?? moduleAccent.home
            return (
              <label key={task.id} className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-gray-50 cursor-pointer opacity-40 transition-colors duration-150">
                <input type="checkbox" checked onChange={() => toggle(task.id)}
                  className={`w-4 h-4 rounded-md cursor-pointer flex-shrink-0 ${a.check}`} />
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
                <span className="text-sm text-gray-500 line-through flex-1">{task.title}</span>
              </label>
            )
          })}
        </>
      )}
    </Card>
  )
}
