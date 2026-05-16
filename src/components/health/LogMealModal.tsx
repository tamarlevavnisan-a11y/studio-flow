import { useState, useMemo } from 'react'
import { Search, Plus, Minus, Trash2, Save, ChevronDown } from 'lucide-react'
import Modal from '../ui/Modal'
import { useNutrition } from '../../store/NutritionContext'
import { foodDatabase } from '../../data/foodDatabase'
import type { FoodItem, LoggedFoodItem } from '../../types'

interface Props { onClose: () => void }

const inputCls = 'w-full border border-gray-100 rounded-2xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-mint bg-gray-50 placeholder-gray-300'

const MEAL_NAMES = ['ארוחת בוקר', 'ארוחת צהריים', 'ארוחת ערב', 'חטיף', 'אחר']

// ── Quantity stepper ──────────────────────────────────────────────────────────
function Stepper({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={() => onChange(Math.max(0.5, +(value - 0.5).toFixed(1)))}
        className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-600 transition-colors">
        <Minus size={10} />
      </button>
      <span className="w-8 text-center text-sm font-500 text-gray-700">{value}</span>
      <button type="button" onClick={() => onChange(+(value + 0.5).toFixed(1))}
        className="w-6 h-6 rounded-full bg-mint hover:bg-emerald-300 flex items-center justify-center text-emerald-800 transition-colors">
        <Plus size={10} />
      </button>
    </div>
  )
}

// ── Current items list ────────────────────────────────────────────────────────
function CurrentItems({ items, onRemove }: { items: LoggedFoodItem[]; onRemove: (id: string) => void }) {
  if (!items.length) return (
    <p className="text-xs text-gray-400 text-center py-3">טרם נוספו פריטים לארוחה זו</p>
  )
  return (
    <div className="space-y-1.5 max-h-36 overflow-y-auto">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-500 text-gray-700 truncate">{item.foodName}</p>
            <p className="text-[10px] text-gray-400">×{item.quantity} {item.unitLabel}</p>
          </div>
          <span className="text-xs font-500 text-gray-600 flex-shrink-0">{Math.round(item.calories)} קק"ל</span>
          <button onClick={() => onRemove(item.foodId + '-' + i)}
            className="p-1 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-400 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Food row in search results ────────────────────────────────────────────────
function FoodRow({ food, onAdd }: { food: FoodItem; onAdd: (food: FoodItem, qty: number) => void }) {
  const [qty, setQty] = useState(1)
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-gray-50 last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-500 text-gray-800 truncate">{food.name}</p>
        <p className="text-[10px] text-gray-400">{food.unitLabel} · {food.calories} קק"ל | חל' {food.protein}g | פח' {food.carbs}g | שומן {food.fat}g</p>
      </div>
      <Stepper value={qty} onChange={setQty} />
      <button onClick={() => onAdd(food, qty)}
        className="w-7 h-7 rounded-full bg-mint-light hover:bg-mint flex items-center justify-center text-emerald-700 transition-all flex-shrink-0">
        <Plus size={14} />
      </button>
    </div>
  )
}

// ── Tabs ─────────────────────────────────────────────────────────────────────
type Tab = 'search' | 'manual' | 'saved'
const tabs: { id: Tab; label: string }[] = [
  { id: 'search', label: '🔍 חיפוש' },
  { id: 'manual', label: '✏️ ידני'  },
  { id: 'saved',  label: '📋 שמורות' },
]

// ── Main modal ────────────────────────────────────────────────────────────────
export default function LogMealModal({ onClose }: Props) {
  const { addMeal, addSavedMeal, savedMeals } = useNutrition()

  const [activeTab, setActiveTab] = useState<Tab>('search')
  const [currentItems, setCurrentItems] = useState<LoggedFoodItem[]>([])
  const [mealName, setMealName] = useState('ארוחת צהריים')
  const [saveAsMeal, setSaveAsMeal] = useState(false)
  const [savedMealName, setSavedMealName] = useState('')

  // Search tab state
  const [query, setQuery] = useState('')

  // Manual tab state
  const [manual, setManual] = useState({ name: '', calories: '', protein: '', carbs: '', fat: '' })

  const searchResults = useMemo(() => {
    if (!query.trim()) return foodDatabase.slice(0, 10)
    const q = query.toLowerCase()
    return foodDatabase.filter(f => f.name.includes(query) || f.name.toLowerCase().includes(q)).slice(0, 10)
  }, [query])

  const totals = currentItems.reduce(
    (a, i) => ({ calories: a.calories + i.calories, protein: a.protein + i.protein, carbs: a.carbs + i.carbs, fat: a.fat + i.fat }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  )

  function addFoodItem(food: FoodItem, qty: number) {
    setCurrentItems(prev => [...prev, {
      foodId:   food.id,
      foodName: food.name,
      unitLabel:food.unitLabel,
      quantity: qty,
      calories: Math.round(food.calories * qty * 10) / 10,
      protein:  Math.round(food.protein  * qty * 10) / 10,
      carbs:    Math.round(food.carbs    * qty * 10) / 10,
      fat:      Math.round(food.fat      * qty * 10) / 10,
    }])
  }

  function removeItem(_: string, idx: number) {
    setCurrentItems(prev => prev.filter((_, i) => i !== idx))
  }

  function addManualItem() {
    if (!manual.name.trim() || !manual.calories) return
    setCurrentItems(prev => [...prev, {
      foodId:    'manual-' + Date.now(),
      foodName:  manual.name,
      unitLabel: 'מנה',
      quantity:  1,
      calories:  Number(manual.calories),
      protein:   Number(manual.protein)  || 0,
      carbs:     Number(manual.carbs)    || 0,
      fat:       Number(manual.fat)      || 0,
    }])
    setManual({ name: '', calories: '', protein: '', carbs: '', fat: '' })
  }

  function addSavedMealItems(meal: typeof savedMeals[0]) {
    setCurrentItems(prev => [...prev, ...meal.items])
  }

  function handleSubmit() {
    if (!currentItems.length) return
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, '0')
    addMeal({
      date: `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`,
      time: `${pad(now.getHours())}:${pad(now.getMinutes())}`,
      name: mealName,
      items: currentItems,
      totalCalories: Math.round(totals.calories),
      totalProtein:  Math.round(totals.protein),
      totalCarbs:    Math.round(totals.carbs),
      totalFat:      Math.round(totals.fat),
    })
    if (saveAsMeal && savedMealName.trim()) {
      addSavedMeal({
        name: savedMealName.trim(),
        items: currentItems,
        totalCalories: Math.round(totals.calories),
        totalProtein:  Math.round(totals.protein),
        totalCarbs:    Math.round(totals.carbs),
        totalFat:      Math.round(totals.fat),
      })
    }
    onClose()
  }

  return (
    <Modal title="תיעוד ארוחה 🍽️" onClose={onClose} width="max-w-lg">
      <div className="space-y-4">

        {/* Meal name selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-medium text-gray-500 flex-shrink-0">סוג ארוחה:</label>
          <div className="relative flex-1">
            <select value={mealName} onChange={e => setMealName(e.target.value)}
              className="w-full appearance-none border border-gray-100 rounded-2xl px-4 py-2 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-mint pr-8">
              {MEAL_NAMES.map(n => <option key={n}>{n}</option>)}
            </select>
            <ChevronDown size={13} className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex bg-gray-50 rounded-2xl p-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                activeTab === t.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Search tab ── */}
        {activeTab === 'search' && (
          <div>
            <div className="relative mb-3">
              <Search size={14} className="absolute top-1/2 -translate-y-1/2 right-3.5 text-gray-400" />
              <input value={query} onChange={e => setQuery(e.target.value)}
                placeholder="חפשי מזון... (שניצל, ביצה, אורז...)"
                className={`${inputCls} pr-9`} autoFocus />
            </div>
            <div className="max-h-52 overflow-y-auto">
              {searchResults.map(food => (
                <FoodRow key={food.id} food={food} onAdd={addFoodItem} />
              ))}
              {searchResults.length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">לא נמצאו תוצאות. נסי חיפוש אחר או הוספה ידנית.</p>
              )}
            </div>
          </div>
        )}

        {/* ── Manual tab ── */}
        {activeTab === 'manual' && (
          <div className="space-y-3">
            <input value={manual.name} onChange={e => setManual(m => ({ ...m, name: e.target.value }))}
              placeholder="שם המוצר" className={inputCls} />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">קלוריות *</label>
                <input type="number" min="0" value={manual.calories}
                  onChange={e => setManual(m => ({ ...m, calories: e.target.value }))}
                  placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">חלבון (g)</label>
                <input type="number" min="0" value={manual.protein}
                  onChange={e => setManual(m => ({ ...m, protein: e.target.value }))}
                  placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">פחמימות (g)</label>
                <input type="number" min="0" value={manual.carbs}
                  onChange={e => setManual(m => ({ ...m, carbs: e.target.value }))}
                  placeholder="0" className={inputCls} />
              </div>
              <div>
                <label className="text-[10px] text-gray-400 mb-1 block">שומן (g)</label>
                <input type="number" min="0" value={manual.fat}
                  onChange={e => setManual(m => ({ ...m, fat: e.target.value }))}
                  placeholder="0" className={inputCls} />
              </div>
            </div>
            <button onClick={addManualItem} disabled={!manual.name.trim() || !manual.calories}
              className="w-full py-2.5 rounded-2xl bg-mint-light text-emerald-700 text-sm font-500 hover:bg-mint transition-colors disabled:opacity-40">
              הוסף לארוחה
            </button>
          </div>
        )}

        {/* ── Saved meals tab ── */}
        {activeTab === 'saved' && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {savedMeals.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-6">אין ארוחות שמורות עדיין</p>
            )}
            {savedMeals.map(meal => (
              <div key={meal.id}
                className="flex items-center gap-3 bg-gray-50 rounded-2xl p-3 hover:bg-mint-light transition-colors group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-500 text-gray-800">{meal.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {meal.totalCalories} קק"ל · {meal.items.length} פריטים
                  </p>
                  <p className="text-[10px] text-gray-400">
                    חל' {meal.totalProtein}g · פח' {meal.totalCarbs}g · שומן {meal.totalFat}g
                  </p>
                </div>
                <button onClick={() => addSavedMealItems(meal)}
                  className="flex items-center gap-1.5 text-xs font-500 text-emerald-600 bg-white rounded-xl px-3 py-1.5 shadow-sm hover:shadow-md transition-all opacity-0 group-hover:opacity-100">
                  <Plus size={12} /> הוסף
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Current items ── */}
        <div className="border-t border-gray-50 pt-3">
          <p className="text-xs font-500 text-gray-500 mb-2">פריטים בארוחה ({currentItems.length})</p>
          <CurrentItems
            items={currentItems}
            onRemove={(key) => {
              const idx = parseInt(key.split('-').pop() ?? '0')
              setCurrentItems(prev => prev.filter((_, i) => i !== idx))
            }}
          />
        </div>

        {/* ── Save as meal ── */}
        <div className="border border-dashed border-gray-200 rounded-2xl p-3 space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={saveAsMeal} onChange={e => setSaveAsMeal(e.target.checked)}
              className="w-4 h-4 rounded accent-emerald-500" />
            <span className="text-sm text-gray-600 flex items-center gap-1.5"><Save size={13} /> שמור כארוחה קבועה</span>
          </label>
          {saveAsMeal && (
            <input value={savedMealName} onChange={e => setSavedMealName(e.target.value)}
              placeholder="שם הארוחה (פסטה רוזה, שניצל עם תירס...)"
              className={inputCls} />
          )}
        </div>

        {/* ── Totals + submit ── */}
        <div className="bg-mint-light rounded-2xl p-3">
          <div className="grid grid-cols-4 gap-2 text-center mb-3">
            {[
              { label: 'קלוריות', val: Math.round(totals.calories) },
              { label: 'חלבון',   val: Math.round(totals.protein) + 'g' },
              { label: 'פחמימות', val: Math.round(totals.carbs) + 'g' },
              { label: 'שומן',    val: Math.round(totals.fat) + 'g' },
            ].map(m => (
              <div key={m.label}>
                <p className="text-sm font-600 text-emerald-800">{m.val}</p>
                <p className="text-[10px] text-emerald-600">{m.label}</p>
              </div>
            ))}
          </div>
          <button onClick={handleSubmit} disabled={currentItems.length === 0}
            className="w-full py-2.5 rounded-2xl text-white text-sm font-500 transition-all hover:opacity-90 disabled:opacity-40"
            style={{ backgroundColor: '#BBF7D0', color: '#065F46' }}>
            הוסף ארוחה ← {Math.round(totals.calories)} קק"ל
          </button>
        </div>

      </div>
    </Modal>
  )
}
