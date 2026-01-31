'use client'

import { useState } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

export function QuickStart() {
  const { theme, settings, updateSettings, startSession } = useUnfocus()
  const [selectedInterval, setSelectedInterval] = useState(settings.interval)

  const intervals = [
    { value: 20, label: '20m', desc: 'short bursts' },
    { value: 30, label: '30m', desc: 'balanced' },
    { value: 45, label: '45m', desc: 'deep work' },
    { value: 60, label: '60m', desc: 'marathon' },
  ]

  const handleStart = () => {
    updateSettings({ interval: selectedInterval })
    startSession()
  }

  return (
    <div
      className="flex flex-col items-center justify-center p-8 font-mono"
      style={{ color: theme.text, minHeight: '500px' }}
    >
      {/* ASCII Logo */}
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-widest mb-4 font-mono"
        style={{ color: theme.accent }}
      >
        UNFOCUS
      </h1>

      <p className="text-sm mb-8 opacity-60" style={{ color: theme.muted }}>
        touch grass sometimes.
      </p>

      {/* Divider */}
      <div className="w-64 mb-8" style={{ borderTop: `1px solid ${theme.muted}40` }} />

      {/* Timer Selection */}
      <div className="text-center mb-8">
        <p className="text-xs uppercase tracking-widest mb-4" style={{ color: theme.muted }}>
          break every
        </p>
        <div className="flex gap-3">
          {intervals.map((interval) => (
            <button
              key={interval.value}
              onClick={() => setSelectedInterval(interval.value)}
              className="px-4 py-3 transition-all font-mono"
              style={{
                backgroundColor: selectedInterval === interval.value ? theme.accent : 'transparent',
                color: selectedInterval === interval.value ? theme.bg : theme.text,
                border: `1px solid ${selectedInterval === interval.value ? theme.accent : theme.muted}`,
              }}
            >
              <div className="text-lg font-bold">{interval.label}</div>
              <div className="text-xs opacity-60">{interval.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={handleStart}
        className="px-8 py-4 text-lg font-mono transition-all hover:opacity-90"
        style={{
          backgroundColor: theme.accent,
          color: theme.bg,
        }}
      >
        $ ./start-session
      </button>

      {/* Hint */}
      <p className="mt-8 text-xs" style={{ color: theme.muted }}>
        type <span style={{ color: theme.accent }}>/settings</span> to customize more options
      </p>
    </div>
  )
}
