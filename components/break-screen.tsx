'use client'

import { useEffect, useState } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

export function BreakScreen() {
  const { theme, currentBreak, completeBreak, skipBreak } = useUnfocus()
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(currentBreak?.duration || 20)

  useEffect(() => {
    if (!currentBreak) return

    const duration = currentBreak.duration
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)
      setTimeLeft(Math.max(Math.ceil(duration - elapsed), 0))

      if (elapsed >= duration) {
        clearInterval(interval)
        completeBreak()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [currentBreak, completeBreak])

  if (!currentBreak) return null

  // Generate progress bar with block characters
  const barLength = 20
  const filledLength = Math.floor(progress * barLength)
  const progressBar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="w-full max-w-md animate-fade-in">
        {/* ASCII Box */}
        <pre className="text-xs sm:text-sm leading-relaxed" style={{ color: theme.text }}>
{`░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
░                                        ░
░  `}<span style={{ color: theme.accent }}>{`> BREAK_TYPE: ${currentBreak.type}`}</span>{`               
░                                        ░
░  `}<span style={{ color: theme.muted }}>{currentBreak.noticing.substring(0, 36)}</span>{`
░  `}<span style={{ color: theme.muted }}>{currentBreak.noticing.substring(36) || ''}</span>{`
░                                        ░
░  ──────────────────────────────────    ░
░                                        ░
░  `}<span style={{ color: theme.accent }}>{currentBreak.invitation.substring(0, 36)}</span>{`
░  `}<span style={{ color: theme.accent }}>{currentBreak.invitation.substring(36) || ''}</span>{`
░                                        ░
░  [{progressBar}] {timeLeft}s    ░
░                                        ░
░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░`}
        </pre>

        {/* Skip button */}
        <div className="mt-8 text-center">
          <button
            onClick={skipBreak}
            className="text-sm hover:opacity-80 transition-opacity"
            style={{ color: theme.muted }}
          >
            [ CTRL+C to skip ]
          </button>
        </div>
      </div>
    </div>
  )
}
