'use client'

import { useUnfocus } from '@/lib/unfocus-context'
import { useEffect, useState } from 'react'
import { TerminalInput } from './terminal-input'
import { CRTEffects } from './crt-effects'

interface TerminalWindowProps {
  children: React.ReactNode
  title?: string
  showInput?: boolean
}

export function TerminalWindow({ children, title = 'unfocus', showInput = true }: TerminalWindowProps) {
  const { theme, screen, isDemo } = useUnfocus()
  const [time, setTime] = useState('')

  useEffect(() => {
    const updateTime = () => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundColor: '#0a0a0a',
        backgroundImage: `
          radial-gradient(ellipse at center, ${theme.bg}22 0%, transparent 70%)
        `,
      }}
    >
      {/* CRT Effects */}
      <CRTEffects />

      {/* Terminal window - expanded */}
      <div
        className="w-full max-w-4xl rounded-lg overflow-hidden shadow-2xl relative"
        style={{
          backgroundColor: theme.bg,
          boxShadow: `
            0 0 0 1px ${theme.muted}40,
            0 25px 50px -12px rgba(0, 0, 0, 0.5),
            0 0 120px -20px ${theme.accent}30,
            inset 0 0 60px ${theme.accent}05
          `,
        }}
      >
        {/* Title bar */}
        <div
          className="flex items-center justify-between px-4 py-2.5 select-none"
          style={{
            backgroundColor: `color-mix(in srgb, ${theme.bg} 50%, #000 50%)`,
            borderBottom: `1px solid ${theme.muted}60`,
          }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#ff5f57' }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#febc2e' }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: '#28c840' }}
            />
          </div>

          {/* Title */}
          <div
            className="text-sm tracking-wide flex items-center gap-2"
            style={{ color: theme.text }}
          >
            {title}
            {isDemo && (
              <span
                className="text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: '#ffb00030', color: '#ffb000' }}
              >
                DEMO
              </span>
            )}
          </div>

          {/* Time */}
          <div
            className="text-xs tabular-nums"
            style={{ color: theme.text }}
          >
            {time}
          </div>
        </div>

        {/* Terminal content */}
        <div
          className="relative overflow-y-auto"
          style={{
            minHeight: '540px',
            maxHeight: 'calc(85vh - 100px)',
          }}
        >
          {children}
        </div>

        {/* Terminal input */}
        {showInput && screen !== 'boot' && <TerminalInput />}

        {/* Bottom status bar - improved readability */}
        <div
          className="flex items-center justify-between px-4 py-2 text-xs font-mono"
          style={{
            backgroundColor: `color-mix(in srgb, ${theme.bg} 40%, #000 60%)`,
            borderTop: `1px solid ${theme.muted}30`,
          }}
        >
          <span style={{ color: theme.text, opacity: 0.7 }}>unfocus v1.0.0</span>
          <span style={{ color: theme.muted }}>type /help for commands</span>
          <span className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.success, boxShadow: `0 0 8px ${theme.success}` }}
            />
            <span style={{ color: theme.success }}>ready</span>
          </span>
        </div>
      </div>
    </div>
  )
}
