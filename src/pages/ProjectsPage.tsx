import Card from '../components/ui/Card'
import { FolderOpen } from 'lucide-react'

export default function ProjectsPage() {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-600 text-gray-800">פרויקטים אישיים</h2>
        <p className="text-sm text-gray-400 mt-0.5">מעקב פרויקטים ויעדים</p>
      </div>
      <Card accent="peach" className="p-10 text-center">
        <div className="w-16 h-16 rounded-2xl bg-peach-light flex items-center justify-center mx-auto mb-4">
          <FolderOpen size={28} className="text-orange-400" />
        </div>
        <h3 className="text-base font-500 text-gray-700 mb-2">פרויקטים</h3>
        <p className="text-sm text-gray-400">מודול פרויקטים אישיים – בקרוב ✨</p>
      </Card>
    </div>
  )
}
