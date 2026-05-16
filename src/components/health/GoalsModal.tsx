import { useState } from 'react'
import Modal from '../ui/Modal'
import { useNutrition } from '../../store/NutritionContext'

interface Props { onClose: () => void }

const inputCls = 'w-full border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-lavender bg-gray-50'

export default function GoalsModal({ onClose }: Props) {
  const { goals, setGoals } = useNutrition()
  const [form, setForm] = useState({ ...goals })

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setGoals({ calories: Number(form.calories), protein: Number(form.protein), carbs: Number(form.carbs), fat: Number(form.fat) })
    onClose()
  }

  return (
    <Modal title="הגדרת יעדים יומיים 🎯" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-xs text-gray-400">הגדירי את יעדי התזונה היומיים שלך</p>

        <div className="grid grid-cols-2 gap-3">
          {([
            { key: 'calories', label: '🔥 קלוריות', unit: 'קק"ל' },
            { key: 'protein',  label: '🥩 חלבון',   unit: 'g' },
            { key: 'carbs',    label: '🍞 פחמימות',  unit: 'g' },
            { key: 'fat',      label: '🫙 שומן',    unit: 'g' },
          ] as const).map(({ key, label, unit }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
              <div className="relative">
                <input type="number" min="0" value={form[key]}
                  onChange={e => setForm(f => ({ ...f, [key]: Number(e.target.value) }))}
                  className={inputCls} />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-lavender-light rounded-2xl p-3 text-xs text-violet-700 leading-relaxed">
          💡 הנחיה כללית: 1800 קק"ל | 120g חלבון | 220g פחמימות | 70g שומן
        </div>

        <div className="flex gap-3">
          <button type="button" onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl border border-gray-100 text-sm text-gray-500 hover:bg-gray-50 transition-colors">
            ביטול
          </button>
          <button type="submit"
            className="flex-1 py-2.5 rounded-2xl text-white text-sm font-500 transition-all hover:opacity-90"
            style={{ backgroundColor: '#F472B6' }}>
            שמור יעדים
          </button>
        </div>
      </form>
    </Modal>
  )
}
