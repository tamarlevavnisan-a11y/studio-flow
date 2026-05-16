import { userName } from '../../data/mockData'

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'בוקר טוב'
  if (h < 17) return 'צהריים טובים'
  return 'ערב טוב'
}

function getDate() {
  return new Date().toLocaleDateString('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

export default function GreetingCard() {
  return (
    <div
      className="rounded-[20px] p-7 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #E9E4FF 0%, #FCE7F3 60%, #FFF1F9 100%)' }}
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-48 h-48 rounded-full opacity-30"
        style={{ background: '#C4B5FD', filter: 'blur(60px)', transform: 'translate(-30%, -30%)' }} />
      <div className="absolute bottom-0 right-0 w-40 h-40 rounded-full opacity-20"
        style={{ background: '#FBCFE8', filter: 'blur(50px)', transform: 'translate(20%, 20%)' }} />

      <div className="relative flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-violet-400 mb-1">{getDate()}</p>
          <h2 className="text-3xl font-600 text-gray-800 mb-1">
            {getGreeting()}, {userName} 👋
          </h2>
          <p className="text-sm text-gray-500 font-400">יש לך 3 משימות פתוחות להיום — בואי נגרום לקסם לקרות ✨</p>
        </div>
        <div className="hidden sm:flex flex-col items-center gap-2 opacity-60">
          <span className="text-5xl">🌸</span>
        </div>
      </div>
    </div>
  )
}
