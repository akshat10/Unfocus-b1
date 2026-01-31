'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

export function AmbientScreen() {
  const { settings, theme, stats, sessionStartTime, endSession, triggerBreak } = useUnfocus()
  const [timeLeft, setTimeLeft] = useState(Math.round(settings.interval * 60))
  const [sessionElapsed, setSessionElapsed] = useState(0)

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }, [])

  const formatElapsed = useCallback((ms: number) => {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }, [])

  // Countdown timer
  useEffect(() => {
    const intervalSeconds = Math.round(settings.interval * 60)
    setTimeLeft(intervalSeconds)

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          triggerBreak()
          return intervalSeconds
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [settings.interval, triggerBreak])

  // Session elapsed timer
  useEffect(() => {
    if (!sessionStartTime) return

    const interval = setInterval(() => {
      setSessionElapsed(Date.now() - sessionStartTime)
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionStartTime])

  // Update document title
  useEffect(() => {
    document.title = `${formatTime(timeLeft)} | unfocus`
    return () => {
      document.title = 'unfocus - terminal breaks'
    }
  }, [timeLeft, formatTime])

  // Keyboard shortcuts: 'b' to trigger break immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'b' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        // Don't trigger if typing in input
        if (document.activeElement?.tagName === 'INPUT') return
        triggerBreak()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerBreak])

  return (
    <div
      className="flex flex-col font-mono"
      style={{ color: theme.text, minHeight: '540px' }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center animate-fade-in px-6 py-8">
        {/* UNFOCUS watermark */}
        <pre
          className="text-[6px] sm:text-[8px] md:text-[10px] leading-none mb-12 opacity-30 select-none"
          style={{
            color: theme.accent,
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            letterSpacing: '0',
          }}
        >{`██╗   ██╗███╗   ██╗███████╗ ██████╗  ██████╗██╗   ██╗███████╗
██║   ██║████╗  ██║██╔════╝██╔═══██╗██╔════╝██║   ██║██╔════╝
██║   ██║██╔██╗ ██║█████╗  ██║   ██║██║     ██║   ██║███████╗
██║   ██║██║╚██╗██║██╔══╝  ██║   ██║██║     ██║   ██║╚════██║
╚██████╔╝██║ ╚████║██║     ╚██████╔╝╚██████╗╚██████╔╝███████║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝`}</pre>

        {/* Time display with terminal frame */}
        <div
          className="border-2 px-12 py-8 mb-6"
          style={{ borderColor: theme.accent }}
        >
          <div
            className="text-6xl sm:text-7xl md:text-8xl font-mono tracking-widest tabular-nums"
            style={{ color: theme.accent }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <p className="text-sm tracking-widest uppercase mb-8 font-mono" style={{ color: theme.muted }}>
          next break in
        </p>

        {/* Stats row */}
        <div className="flex items-center gap-8 mb-8 text-sm font-mono" style={{ color: theme.muted }}>
          <div className="text-center">
            <div className="text-2xl font-mono" style={{ color: theme.text }}>{stats.breaksTaken}</div>
            <div className="text-xs uppercase tracking-wider">breaks</div>
          </div>
          <div className="text-2xl" style={{ color: theme.muted }}>|</div>
          <div className="text-center">
            <div className="text-2xl font-mono" style={{ color: theme.text }}>{formatElapsed(sessionElapsed)}</div>
            <div className="text-xs uppercase tracking-wider">session</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-4 font-mono">
          <button
            onClick={triggerBreak}
            className="px-6 py-3 border text-sm hover:opacity-80 transition-opacity tracking-wider"
            style={{ borderColor: theme.accent, color: theme.accent }}
          >
            /break
          </button>
          <button
            onClick={endSession}
            className="px-6 py-3 border text-sm hover:opacity-80 transition-opacity tracking-wider"
            style={{ borderColor: theme.muted, color: theme.muted }}
          >
            /end
          </button>
        </div>
      </div>
    </div>
  )
}
