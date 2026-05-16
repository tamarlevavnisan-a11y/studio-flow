import { createContext, useContext, useState, ReactNode, useMemo } from 'react'
import type { MealEntry, SavedMeal, NutritionGoals, LoggedFoodItem } from '../types'

interface DayTotals { calories: number; protein: number; carbs: number; fat: number }

interface NutritionContextType {
  goals: NutritionGoals
  mealLogs: MealEntry[]
  savedMeals: SavedMeal[]
  setGoals: (g: NutritionGoals) => void
  addMeal: (meal: Omit<MealEntry, 'id'>) => void
  deleteMeal: (id: string) => void
  addSavedMeal: (meal: Omit<SavedMeal, 'id'>) => void
  deleteSavedMeal: (id: string) => void
  getDailyLogs: (date: string) => MealEntry[]
  getDailyTotals: (date: string) => DayTotals
  getWeeklyData: () => Array<{ dateStr: string; label: string } & DayTotals>
  getMonthlyData: () => Array<{ dateStr: string; label: string } & DayTotals>
}

const NutritionContext = createContext<NutritionContextType | null>(null)

let nextId = 500

function uid() { return `n${++nextId}` }

function fmtDate(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function sumItems(items: LoggedFoodItem[]): DayTotals {
  return items.reduce((a, i) => ({
    calories: a.calories + i.calories,
    protein:  a.protein  + i.protein,
    carbs:    a.carbs    + i.carbs,
    fat:      a.fat      + i.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })
}

// ── Saved meals ──────────────────────────────────────────────────────────────
const initialSavedMeals: SavedMeal[] = [
  {
    id: 'sm1', name: 'פסטה רוזה',
    items: [
      { foodId: 'fd27', foodName: 'פסטה מבושלת',    unitLabel: '100g',       quantity: 2, calories: 316, protein: 11.6, carbs: 62,  fat: 1.8 },
      { foodId: 'fd4',  foodName: 'סלמון צלוי',      unitLabel: '100g',       quantity: 1, calories: 208, protein: 20,   carbs: 0,   fat: 13  },
      { foodId: 'fd19', foodName: 'גבינת שמנת',      unitLabel: 'כפית (15g)', quantity: 2, calories: 102, protein: 2,    carbs: 1,   fat: 10  },
    ],
    totalCalories: 626, totalProtein: 33.6, totalCarbs: 63, totalFat: 24.8,
  },
  {
    id: 'sm2', name: 'שניצל עם תירס ואורז',
    items: [
      { foodId: 'fd1',  foodName: 'שניצל עוף',       unitLabel: 'מנה (150g)', quantity: 1, calories: 310, protein: 28,   carbs: 15,  fat: 14  },
      { foodId: 'fd43', foodName: 'תירס מבושל',       unitLabel: 'קלח (80g)', quantity: 1, calories: 88,  protein: 3.3,  carbs: 19,  fat: 1.4 },
      { foodId: 'fd25', foodName: 'אורז לבן מבושל',   unitLabel: '100g',       quantity: 1, calories: 130, protein: 2.7,  carbs: 28,  fat: 0.3 },
    ],
    totalCalories: 528, totalProtein: 34, totalCarbs: 62, totalFat: 15.7,
  },
  {
    id: 'sm3', name: 'ארוחת בוקר קלה',
    items: [
      { foodId: 'fd11', foodName: 'ביצה שלמה',        unitLabel: 'יחידה',      quantity: 2, calories: 156, protein: 12,   carbs: 1.2, fat: 10  },
      { foodId: 'fd12', foodName: 'גבינה לבנה 5%',    unitLabel: '100g',       quantity: 1, calories: 97,  protein: 11,   carbs: 3,   fat: 5   },
      { foodId: 'fd22', foodName: 'לחם מלא',           unitLabel: 'פרוסה (30g)',quantity: 2, calories: 140, protein: 6,    carbs: 26,  fat: 2   },
      { foodId: 'fd40', foodName: 'עגבנייה',           unitLabel: 'יחידה (120g)',quantity:1, calories: 22,  protein: 1.1,  carbs: 4.8, fat: 0.2 },
    ],
    totalCalories: 415, totalProtein: 30.1, totalCarbs: 35, totalFat: 17.2,
  },
]

// ── Mock 30-day history ───────────────────────────────────────────────────────
function generateHistory(): MealEntry[] {
  const logs: MealEntry[] = []
  const today = new Date()
  const calPattern = [1520, 1780, 1640, 1920, 1450, 1830, 1700, 1580, 2050, 1690,
                      1750, 1480, 1860, 1540, 1970, 1620, 1740, 1430, 1890, 1660,
                      1510, 1800, 1950, 1570, 1680, 1420, 1760, 1630, 1840, 1590]

  calPattern.forEach((dailyCal, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() - (30 - i))
    const dateStr = fmtDate(d)

    const meals = [
      { name: 'ארוחת בוקר',   time: '08:00', pct: 0.25 },
      { name: 'ארוחת צהריים', time: '13:00', pct: 0.40 },
      { name: 'ארוחת ערב',    time: '19:30', pct: 0.25 },
      ...(i % 3 !== 0 ? [{ name: 'חטיף', time: '16:00', pct: 0.10 }] : []),
    ]

    meals.forEach((m, mIdx) => {
      const cal = Math.round(dailyCal * m.pct)
      logs.push({
        id: `hist-${i}-${mIdx}`,
        date: dateStr,
        time: m.time,
        name: m.name,
        items: [],
        totalCalories: cal,
        totalProtein:  Math.round(cal * 0.22 / 4),
        totalCarbs:    Math.round(cal * 0.50 / 4),
        totalFat:      Math.round(cal * 0.28 / 9),
      })
    })
  })
  return logs
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function NutritionProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<NutritionGoals>({ calories: 1800, protein: 120, carbs: 220, fat: 70 })
  const [mealLogs, setMealLogs] = useState<MealEntry[]>(generateHistory)
  const [savedMeals, setSavedMeals] = useState<SavedMeal[]>(initialSavedMeals)

  function getDailyLogs(date: string) {
    return mealLogs.filter(m => m.date === date)
  }

  function getDailyTotals(date: string): DayTotals {
    return getDailyLogs(date).reduce(
      (a, m) => ({ calories: a.calories + m.totalCalories, protein: a.protein + m.totalProtein,
                   carbs: a.carbs + m.totalCarbs, fat: a.fat + m.totalFat }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 },
    )
  }

  function rangeData(days: number) {
    const today = new Date()
    return Array.from({ length: days }, (_, i) => {
      const d = new Date(today)
      d.setDate(d.getDate() - (days - 1 - i))
      const dateStr = fmtDate(d)
      const totals = getDailyTotals(dateStr)
      const label = days <= 7
        ? d.toLocaleDateString('he-IL', { weekday: 'short' })
        : String(d.getDate())
      return { dateStr, label, ...totals }
    })
  }

  const ctx: NutritionContextType = {
    goals, mealLogs, savedMeals,
    setGoals,
    addMeal: (meal) => setMealLogs(ms => [...ms, { ...meal, id: uid() }]),
    deleteMeal: (id) => setMealLogs(ms => ms.filter(m => m.id !== id)),
    addSavedMeal: (meal) => setSavedMeals(ms => [...ms, { ...meal, id: uid() }]),
    deleteSavedMeal: (id) => setSavedMeals(ms => ms.filter(m => m.id !== id)),
    getDailyLogs,
    getDailyTotals,
    getWeeklyData:  () => rangeData(7),
    getMonthlyData: () => rangeData(30),
  }

  return <NutritionContext.Provider value={ctx}>{children}</NutritionContext.Provider>
}

export function useNutrition() {
  const ctx = useContext(NutritionContext)
  if (!ctx) throw new Error('useNutrition must be inside NutritionProvider')
  return ctx
}
