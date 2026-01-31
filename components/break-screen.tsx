'use client'

import { useEffect, useState, useRef } from 'react'
import { useUnfocus, type BreakType } from '@/lib/unfocus-context'

const breakAsciiArt: Record<BreakType, string> = {
  eyes: `
███████╗██╗   ██╗███████╗███████╗
██╔════╝╚██╗ ██╔╝██╔════╝██╔════╝
█████╗   ╚████╔╝ █████╗  ███████╗
██╔══╝    ╚██╔╝  ██╔══╝  ╚════██║
███████╗   ██║   ███████╗███████║
╚══════╝   ╚═╝   ╚══════╝╚══════╝
`,
  breath: `
██████╗ ██████╗ ███████╗ █████╗ ████████╗██╗  ██╗
██╔══██╗██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║  ██║
██████╔╝██████╔╝█████╗  ███████║   ██║   ███████║
██╔══██╗██╔══██╗██╔══╝  ██╔══██║   ██║   ██╔══██║
██████╔╝██║  ██║███████╗██║  ██║   ██║   ██║  ██║
╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝
`,
  posture: `
██████╗  ██████╗ ███████╗████████╗██╗   ██╗██████╗ ███████╗
██╔══██╗██╔═══██╗██╔════╝╚══██╔══╝██║   ██║██╔══██╗██╔════╝
██████╔╝██║   ██║███████╗   ██║   ██║   ██║██████╔╝█████╗
██╔═══╝ ██║   ██║╚════██║   ██║   ██║   ██║██╔══██╗██╔══╝
██║     ╚██████╔╝███████║   ██║   ╚██████╔╝██║  ██║███████╗
╚═╝      ╚═════╝ ╚══════╝   ╚═╝    ╚═════╝ ╚═╝  ╚═╝╚══════╝
`,
  hands: `
██╗  ██╗ █████╗ ███╗   ██╗██████╗ ███████╗
██║  ██║██╔══██╗████╗  ██║██╔══██╗██╔════╝
███████║███████║██╔██╗ ██║██║  ██║███████╗
██╔══██║██╔══██║██║╚██╗██║██║  ██║╚════██║
██║  ██║██║  ██║██║ ╚████║██████╔╝███████║
╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝ ╚══════╝
`,
  hydration: `
██╗  ██╗██╗   ██╗██████╗ ██████╗  █████╗ ████████╗███████╗
██║  ██║╚██╗ ██╔╝██╔══██╗██╔══██╗██╔══██╗╚══██╔══╝██╔════╝
███████║ ╚████╔╝ ██║  ██║██████╔╝███████║   ██║   █████╗
██╔══██║  ╚██╔╝  ██║  ██║██╔══██╗██╔══██║   ██║   ██╔══╝
██║  ██║   ██║   ██████╔╝██║  ██║██║  ██║   ██║   ███████╗
╚═╝  ╚═╝   ╚═╝   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚══════╝
`,
  window: `
██╗    ██╗██╗███╗   ██╗██████╗  ██████╗ ██╗    ██╗
██║    ██║██║████╗  ██║██╔══██╗██╔═══██╗██║    ██║
██║ █╗ ██║██║██╔██╗ ██║██║  ██║██║   ██║██║ █╗ ██║
██║███╗██║██║██║╚██╗██║██║  ██║██║   ██║██║███╗██║
╚███╔███╔╝██║██║ ╚████║██████╔╝╚██████╔╝╚███╔███╔╝
 ╚══╝╚══╝ ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝  ╚══╝╚══╝
`,
}

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
  const barLength = 20
  const filledLength = Math.floor(progress * barLength)
  const progressBar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)

  const asciiArt = breakAsciiArt[currentBreak.type]

  return (
    <div
      className="flex flex-col items-center justify-center p-6"
      style={{ color: theme.text, minHeight: '500px' }}
    >
      <div className="w-full max-w-lg animate-fade-in" key={breakKey}>
        {/* ASCII Art */}
        <pre
          className="text-center text-[8px] sm:text-[10px] leading-none mb-8 overflow-x-auto"
          style={{ color: theme.accent }}
        >
          {asciiArt}
        </pre>

        {/* Content box */}
        <div
          className="border p-6 mb-6"
          style={{ borderColor: theme.muted }}
        >
          <p className="mb-4 text-sm" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>#</span> {currentBreak.noticing}
          </p>
          <div className="text-xs my-4" style={{ color: theme.muted }}>
            ────────────────────────────────────
          </div>
          <p className="text-sm" style={{ color: theme.accent }}>
            <span style={{ color: theme.success }}>{'>'}</span> {currentBreak.invitation}
          </p>
        </div>

        {/* Progress bar */}
        <div className="text-center mb-8">
          <div className="font-mono text-lg tracking-widest">
            [{progressBar}]
          </div>
          <div className="mt-2 text-sm tracking-wider" style={{ color: theme.muted }}>
            {timeLeft}s remaining
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-8 text-sm tracking-wider">
          <button
            onClick={handleRepeat}
            className="hover:opacity-80 transition-opacity"
            style={{ color: theme.accent }}
          >
            [ r ] repeat
          </button>
          <button
            onClick={skipBreak}
            className="hover:opacity-80 transition-opacity"
            style={{ color: theme.muted }}
          >
            [ ^C ] skip
          </button>
        </div>
      </div>
    </div>
  )
}
