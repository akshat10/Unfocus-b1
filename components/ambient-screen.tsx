'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

export function AmbientScreen() {
  const { settings, theme, stats, sessionStartTime, endSession, triggerBreak } = useUnfocus()
  const [timeLeft, setTimeLeft] = useState(settings.interval * 60)
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
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          triggerBreak()
          return settings.interval * 60
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

  // Debug: press 'd' to trigger break immediately
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        triggerBreak()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [triggerBreak])

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
        <div className="text-7xl sm:text-8xl md:text-9xl font-light tracking-wider">
          {formatTime(timeLeft)}
        </div>
        <p className="mt-4 text-lg" style={{ color: theme.muted }}>
          until next break
        </p>
        <div className="mt-8">
          <span className="text-2xl animate-blink">▊</span>
        </div>
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
