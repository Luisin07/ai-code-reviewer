'use client'

interface ScoreRingProps {
  score: number
}

export function ScoreRing({ score }: ScoreRingProps) {
  const radius = 40
  const stroke = 6
  const normalizedRadius = radius - stroke / 2
  const circumference = normalizedRadius * 2 * Math.PI
  const offset = circumference - (score / 100) * circumference

  const color =
    score >= 80 ? '#00ff9d' :
    score >= 60 ? '#fbbf24' :
    '#ff4d6d'

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <svg width={radius * 2} height={radius * 2} className="rotate-[-90deg]">
          <circle
            cx={radius} cy={radius} r={normalizedRadius}
            fill="transparent" stroke="#1e1e2e" strokeWidth={stroke}
          />
          <circle
            cx={radius} cy={radius} r={normalizedRadius}
            fill="transparent" stroke={color} strokeWidth={stroke}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease' }}
          />
        </svg>
        <span className="absolute font-mono font-bold text-xl" style={{ color }}>
          {score}
        </span>
      </div>
      <span className="text-xs text-muted font-mono uppercase tracking-widest">Quality Score</span>
    </div>
  )
}
