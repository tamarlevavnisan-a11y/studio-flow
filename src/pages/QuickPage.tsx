import Card from '../components/ui/Card'
import { Zap } from 'lucide-react'

export default function QuickPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-600 text-gray-800">גישה מהירה</h2>
        <p className="text-sm text-gray-400 mt-0.5">קישורים ופעולות מהירות</p>
      </div>
      <Card accent="butter" className="p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-butter-light flex items-center justify-center mx-auto mb-4">
          <Zap size={28} className="text-yellow-500" />
        </div>
        <h3 className="text-base font-500 text-gray-700 mb-2">גישה מהירה</h3>
        <p className="text-sm text-gray-400">מודול גישה מהירה – בקרוב ✨</p>
      </Card>
    </div>
  )
}
