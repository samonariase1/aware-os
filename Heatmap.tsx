import { useMemo } from 'react'

interface HeatmapData {
  date: string // ISO string or simple date string
  score: number
}

interface HeatmapProps {
  data: HeatmapData[]
  className?: string
}

export default function Heatmap({ data, className = '' }: HeatmapProps) {
  // Ensure we always have 7 slots, filling from the right
  const processedData = useMemo(() => {
    const slots = new Array(7).fill(null)
    // Take the last 7 entries if data is longer, or all if shorter
    const recent = data.slice(-7)
    
    // Map them into the end of the slots array
    recent.forEach((item, index) => {
      // Calculate offset to place items at the end
      const offset = 7 - recent.length + index
      slots[offset] = item
    })
    
    return slots
  }, [data])

  const getColorClass = (score: number) => {
    if (score > 80) return 'bg-[#00E0FF] shadow-[0_0_12px_rgba(0,224,255,0.6)] border-[#00E0FF]' // Bright Teal + Glow
    if (score >= 40) return 'bg-[#00E0FF]/30 border-[#00E0FF]/50' // Dim Teal
    return 'bg-[#F59E0B] shadow-[0_0_8px_rgba(245,158,11,0.4)] border-[#F59E0B]' // Amber (Warning)
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-end mb-2">
        <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
          7-Day Trend
        </h3>
        <div className="flex gap-2 text-[10px] text-neutral-600">
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#F59E0B]"></div>Low</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00E0FF]/30"></div>Med</span>
          <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#00E0FF]"></div>High</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 sm:gap-3">
        {processedData.map((entry, index) => {
          // Get Day Label (e.g., "M", "T")
          const dayLabel = entry 
            ? new Date(entry.date).toLocaleDateString('en-US', { weekday: 'narrow' }) 
            : '-'

          return (
            <div key={index} className="flex flex-col items-center gap-2 group">
              
              {/* The Heatmap Square */}
              <div className="relative w-full aspect-square">
                <div
                  className={`
                    w-full h-full 
                    rounded-md sm:rounded-lg 
                    border border-transparent
                    transition-all duration-300
                    ${entry ? getColorClass(entry.score) : 'bg-neutral-900 border-neutral-800'}
                  `}
                >
                  {/* Tooltip on Hover */}
                  {entry && (
                    <div className="
                      absolute -top-8 left-1/2 -translate-x-1/2 
                      bg-surface border border-neutral-700 
                      text-xs text-text font-mono 
                      px-2 py-1 rounded 
                      opacity-0 group-hover:opacity-100 
                      transition-opacity pointer-events-none whitespace-nowrap z-10
                    ">
                      Score: {entry.score}
                    </div>
                  )}
                </div>
              </div>

              {/* Day Label */}
              <span className="text-[10px] text-neutral-600 font-medium">
                {dayLabel}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}