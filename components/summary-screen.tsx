'use client'

import { useMemo, useRef } from 'react'
import html2canvas from 'html2canvas'
import { useUnfocus } from '@/lib/unfocus-context'

const quotes = [
  "you logged off {breaks} times. rare behavior.",
  "touch grass? you at least looked at it through a window.",
  "kernel panic averted. you took breaks.",
  "{breaks} breaks. that's {breaks} more than your vim config needed.",
  "segfault in burnout.exe. breaks applied successfully.",
  "sudo rest --force executed successfully.",
  "garbage collection complete. you took out the mental trash.",
]

export function SummaryScreen() {
  const { theme, stats, sessionStartTime, setScreen, startSession } = useUnfocus()
  const cardRef = useRef<HTMLDivElement>(null)

  const sessionDuration = sessionStartTime 
    ? Math.floor((Date.now() - sessionStartTime) / 1000)
    : 0

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const quote = useMemo(() => {
    const q = quotes[Math.floor(Math.random() * quotes.length)]
    return q.replace(/{breaks}/g, stats.breaksTaken.toString())
  }, [stats.breaksTaken])

  const today = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).toLowerCase()

  const handleExport = async () => {
    if (!cardRef.current) return
    
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: theme.bg,
        scale: 2,
      })
      const link = document.createElement('a')
      link.download = `unfocus-${new Date().toISOString().split('T')[0]}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const handleNewSession = () => {
    startSession()
  }

  const handleBackToSetup = () => {
    setScreen('setup')
  }

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        {/* Visible summary */}
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl" style={{ color: theme.accent }}>SESSION COMPLETE</h1>
            <div style={{ color: theme.accent }}>{'═'.repeat(16)}</div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span style={{ color: theme.muted }}>duration</span>
              <span>{formatDuration(sessionDuration)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: theme.muted }}>breaks</span>
              <span>{stats.breaksTaken}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: theme.muted }}>presence</span>
              <span>{Math.floor(stats.presenceSeconds / 60)} min</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: theme.muted }}>streak</span>
              <span>
                {stats.streakDays} days {stats.streakDays > 1 ? '🔥' : ''}
              </span>
            </div>
          </div>

          <div style={{ color: theme.muted }}>{'─'.repeat(40)}</div>

          <p className="text-sm italic" style={{ color: theme.muted }}>
            &quot;{quote}&quot;
          </p>

          <div style={{ color: theme.muted }}>{'─'.repeat(40)}</div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleExport}
              className="px-4 py-2 text-sm transition-all hover:opacity-80"
              style={{
                border: `1px solid ${theme.muted}`,
                color: theme.text,
              }}
            >
              [ EXPORT ]
            </button>
            <button
              onClick={handleNewSession}
              className="px-4 py-2 text-sm transition-all hover:opacity-90"
              style={{
                backgroundColor: theme.accent,
                color: theme.bg,
              }}
            >
              [ NEW SESSION ]
            </button>
            <button
              onClick={handleBackToSetup}
              className="px-4 py-2 text-sm transition-all hover:opacity-80"
              style={{
                border: `1px solid ${theme.muted}`,
                color: theme.text,
              }}
            >
              [ SETTINGS ]
            </button>
          </div>
        </div>

        {/* Hidden card for export */}
        <div className="absolute -left-[9999px]">
          <div
            ref={cardRef}
            className="w-[600px] p-12"
            style={{ backgroundColor: theme.bg, color: theme.text, fontFamily: 'JetBrains Mono, monospace' }}
          >
            <pre className="text-sm leading-relaxed">
{`┌────────────────────────────────────────┐
│                                        │
│           U N F O C U S                │
│                                        │
│   ──────────────────────────────────   │
│                                        │
│   date        ${today.padEnd(20)}│
│   breaks      ${stats.breaksTaken.toString().padEnd(20)}│
│   presence    ${(Math.floor(stats.presenceSeconds / 60) + ' min').padEnd(20)}│
│   streak      ${(stats.streakDays + ' days' + (stats.streakDays > 1 ? ' 🔥' : '')).padEnd(20)}│
│                                        │
│   ──────────────────────────────────   │
│                                        │
│   "${quote.substring(0, 34)}"${' '.repeat(Math.max(0, 34 - quote.substring(0, 34).length))}│
│   ${quote.substring(34, 68).padEnd(36)}│
│                                        │
│   ──────────────────────────────────   │
│                                        │
│            unfocus.app                 │
│                                        │
└────────────────────────────────────────┘`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
