'use client'

import { useEffect, useState, useRef } from 'react'
import { useUnfocus, type BreakType } from '@/lib/unfocus-context'
import { AsciiAnimation, breakHeaders } from './ascii-animations'

export function BreakScreen() {
  const { theme, currentBreak, completeBreak, skipBreak, repeatBreak } = useUnfocus()
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(currentBreak?.duration || 20)
  const [breakKey, setBreakKey] = useState(0)
  const startTimeRef = useRef(Date.now())

  // Handle CTRL+C to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault()
        skipBreak()
      }
      // 'r' to repeat
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        handleRepeat()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [skipBreak])

  const handleRepeat = () => {
    startTimeRef.current = Date.now()
    setProgress(0)
    setTimeLeft(currentBreak?.duration || 20)
    setBreakKey(prev => prev + 1)
    repeatBreak()
  }

  useEffect(() => {
    if (!currentBreak) return

    const duration = currentBreak.duration
    startTimeRef.current = Date.now()

    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000
      const newProgress = Math.min(elapsed / duration, 1)
      setProgress(newProgress)
      setTimeLeft(Math.max(Math.ceil(duration - elapsed), 0))

      if (elapsed >= duration) {
        clearInterval(interval)
        completeBreak()
      }
    }, 100)

    return () => clearInterval(interval)
  }, [currentBreak, completeBreak, breakKey])

  if (!currentBreak) return null

  // Generate progress bar with block characters
  const barLength = 30
  const filledLength = Math.floor(progress * barLength)
  const progressBar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)

  return (
    <div
      className="flex flex-col h-full p-4 sm:p-6 font-mono"
      style={{ color: theme.text, minHeight: '520px' }}
      key={breakKey}
    >
      {/* Header - compact */}
      <div className="text-center mb-2">
        <pre
          className="text-[6px] sm:text-[8px] leading-none inline-block"
          style={{ color: theme.accent }}
        >
          {breakHeaders[currentBreak.type]}
        </pre>
      </div>

      {/* Main content area - two columns on larger screens */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 lg:gap-8 items-center justify-center">
        {/* Animation - takes center stage */}
        <div
          className="flex items-center justify-center p-4 border rounded"
          style={{
            borderColor: theme.muted,
            backgroundColor: `${theme.bg}`,
            minWidth: '200px',
            minHeight: '180px',
          }}
        >
          <AsciiAnimation
            type={currentBreak.type}
            progress={progress}
            className="text-sm sm:text-base"
            style={{ color: theme.accent }}
          />
        </div>

        {/* Instructions panel */}
        <div className="flex-1 max-w-md space-y-4">
          {/* Noticing */}
          <div
            className="p-4 border-l-2"
            style={{ borderColor: theme.muted, backgroundColor: `${theme.muted}10` }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.muted }}>
              # notice
            </p>
            <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
              {currentBreak.noticing}
            </p>
          </div>

          {/* Invitation */}
          <div
            className="p-4 border-l-2"
            style={{ borderColor: theme.accent, backgroundColor: `${theme.accent}10` }}
          >
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: theme.accent }}>
              {'>'} do this
            </p>
            <p className="text-sm leading-relaxed" style={{ color: theme.text }}>
              {currentBreak.invitation}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom section - progress and controls */}
      <div className="mt-4 space-y-4">
        {/* Progress bar - full width */}
        <div className="text-center">
          <div
            className="font-mono text-xs sm:text-sm tracking-wider overflow-hidden"
            style={{ color: theme.accent }}
          >
            [{progressBar}]
          </div>
          <div className="mt-1 flex items-center justify-center gap-4">
            <span className="text-2xl font-light tabular-nums" style={{ color: theme.text }}>
              {timeLeft}s
            </span>
            <span className="text-xs" style={{ color: theme.muted }}>
              remaining
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <button
            onClick={handleRepeat}
            className="px-4 py-2 border hover:opacity-80 transition-opacity tracking-wider"
            style={{ borderColor: theme.accent, color: theme.accent }}
          >
            [ r ] repeat
          </button>
          <button
            onClick={skipBreak}
            className="px-4 py-2 border hover:opacity-80 transition-opacity tracking-wider"
            style={{ borderColor: theme.muted, color: theme.muted }}
          >
            [ ^C ] skip
          </button>
        </div>
      </div>
    </div>
  )
}
