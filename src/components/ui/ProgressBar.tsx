interface ProgressBarProps {
  value: number
  max: number
  color?: string
  label?: string
  showValue?: boolean
  height?: string
}

export default function ProgressBar({
  value, max, color = '#C4B5FD', label, showValue = true, height = 'h-2',
}: ProgressBarProps) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between text-xs text-gray-400 mb-1.5">
          {label && <span className="text-gray-600 font-medium">{label}</span>}
          {showValue && <span>{value} / {max}</span>}
        </div>
      )}
      <div className={`w-full bg-gray-100 rounded-full ${height} overflow-hidden`}>
        <div
          className={`${height} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}
