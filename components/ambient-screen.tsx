'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

export function AmbientScreen() {
  const { settings, theme, stats, sessionStartTime, endSession, triggerBreak, isDemo } = useUnfocus()
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
    document.title = `${formatTime(timeLeft)} │ unfocus`
    return () => {
      document.title = 'unfocus - terminal breaks'
    }
  }, [timeLeft, formatTime])

  // Keyboard shortcuts: 'd' (debug) or 'b' to trigger break immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.key === 'd' || e.key === 'b') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        triggerBreak()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerBreak])

  return (
    <div
      className="flex flex-col"
      style={{ color: theme.text, minHeight: '500px' }}
    >
      {/* Demo mode banner */}
      {isDemo && (
        <div
          className="px-4 py-2 text-xs text-center"
          style={{ backgroundColor: '#ffb00020', color: '#ffb000', borderBottom: `1px solid #ffb00040` }}
        >
          DEMO MODE: breaks every 10 seconds
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center animate-fade-in px-4">
        {/* Small UNFOCUS watermark */}
        <pre
          className="text-[6px] sm:text-[8px] leading-none mb-8 opacity-30"
          style={{ color: theme.accent }}
        >
{`██╗   ██╗███╗   ██╗███████╗ ██████╗  ██████╗██╗   ██╗███████╗
██║   ██║████╗  ██║██╔════╝██╔═══██╗██╔════╝██║   ██║██╔════╝
██║   ██║██╔██╗ ██║█████╗  ██║   ██║██║     ██║   ██║███████╗
██║   ██║██║╚██╗██║██╔══╝  ██║   ██║██║     ██║   ██║╚════██║
╚██████╔╝██║ ╚████║██║     ╚██████╔╝╚██████╗╚██████╔╝███████║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝`}
        </pre>

        {/* Time display with terminal frame */}
        <div
          className="border px-8 py-6 mb-4"
          style={{ borderColor: theme.muted }}
        >
          <div
            className="text-6xl sm:text-7xl md:text-8xl font-light tracking-widest tabular-nums"
            style={{ color: theme.accent }}
          >
            {formatTime(timeLeft)}
          </div>
        </div>

        <p className="text-sm tracking-widest uppercase" style={{ color: theme.muted }}>
          {'>'} next break in
        </p>

        <div className="mt-6">
          <span className="text-2xl animate-blink" style={{ color: theme.accent }}>█</span>
        </div>

        {/* Take break now button */}
        <button
          onClick={triggerBreak}
          className="mt-10 px-6 py-2 border text-sm hover:opacity-80 transition-opacity tracking-wider"
          style={{ borderColor: theme.muted, color: theme.muted }}
        >
          [ b ] TAKE BREAK NOW
        </button>
      </div>

      {/* Bottom bar */}
      <div 
        className="border-t px-4 py-3 flex items-center justify-between text-sm"
        style={{ borderColor: theme.muted }}
      >
        <span style={{ color: theme.muted }}>
          breaks: {stats.breaksTaken}
        </span>
        <span style={{ color: theme.muted }}>
          session: {formatElapsed(sessionElapsed)}
        </span>
        <button
          onClick={endSession}
          className="hover:opacity-80 transition-opacity"
          style={{ color: theme.text }}
        >
          [end]
        </button>
      </div>
    </div>
  )
}
