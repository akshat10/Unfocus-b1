'use client'

import { useEffect, useState } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

export function BreakScreen() {
  const { theme, currentBreak, completeBreak, skipBreak } = useUnfocus()
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(currentBreak?.duration || 20)

  // Handle CTRL+C to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault()
        skipBreak()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [skipBreak])

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
      <div className="w-full max-w-lg animate-fade-in">
        {/* Break type header */}
        <div className="mb-6 text-center">
          <span style={{ color: theme.accent }} className="text-lg">
            {'>'} BREAK_TYPE: {currentBreak.type.toUpperCase()}
          </span>
        </div>

        {/* Content box */}
        <div 
          className="border p-6 mb-6"
          style={{ borderColor: theme.muted }}
        >
          <p className="mb-4" style={{ color: theme.muted }}>
            {currentBreak.noticing}
          </p>
          <div className="border-t my-4" style={{ borderColor: theme.muted }} />
          <p style={{ color: theme.accent }}>
            {currentBreak.invitation}
          </p>
        </div>

        {/* Progress bar */}
        <div className="text-center mb-8">
          <div className="font-mono text-lg tracking-widest">
            [{progressBar}]
          </div>
          <div className="mt-2" style={{ color: theme.muted }}>
            {timeLeft}s remaining
          </div>
        </div>

        {/* Skip button */}
        <div className="text-center">
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
