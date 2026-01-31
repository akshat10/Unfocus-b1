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
  const { theme, screen } = useUnfocus()
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

      {/* Terminal window */}
      <div
        className="w-full max-w-2xl rounded-lg overflow-hidden shadow-2xl relative"
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
            className="text-sm tracking-wide"
            style={{ color: theme.text }}
          >
            {title}
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
            minHeight: '460px',
            maxHeight: 'calc(80vh - 120px)',
          }}
        >
          {children}
        </div>

        {/* Terminal input */}
        {showInput && screen !== 'boot' && <TerminalInput />}

        {/* Bottom status bar */}
        <div
          className="flex items-center justify-between px-4 py-1.5 text-xs"
          style={{
            backgroundColor: `color-mix(in srgb, ${theme.bg} 80%, ${theme.text} 20%)`,
            borderTop: `1px solid ${theme.muted}40`,
            color: theme.muted,
          }}
        >
          <span>unfocus v1.0.0</span>
          <span className="flex items-center gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ backgroundColor: theme.success, boxShadow: `0 0 6px ${theme.success}` }}
            />
            <span style={{ color: theme.success }}>connected</span>
          </span>
        </div>
      </div>
    </div>
  )
}
