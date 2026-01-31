'use client'

import { useEffect, useState, useCallback } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

interface BootLine {
  time: string
  text: string
  status?: 'ok' | 'ready' | 'warn'
}

const bootMessages: BootLine[] = [
  { time: '0.000', text: 'unfocus v1.0.0 kernel starting...' },
  { time: '0.042', text: 'detecting human presence...', status: 'ok' },
  { time: '0.128', text: 'loading break modules [eyes, breath, posture, hands, hydration, window]', status: 'ok' },
  { time: '0.256', text: 'initializing wellness daemon', status: 'ok' },
  { time: '0.384', text: 'mounting /dev/attention', status: 'ok' },
  { time: '0.512', text: 'calibrating rest intervals', status: 'ok' },
  { time: '0.640', text: 'connecting to human.0', status: 'ready' },
]

interface BootSequenceProps {
  onComplete: () => void
  skipBoot?: boolean
}

export function BootSequence({ onComplete, skipBoot = false }: BootSequenceProps) {
  const { theme } = useUnfocus()
  const [lines, setLines] = useState<BootLine[]>([])
  const [currentText, setCurrentText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [isTyping, setIsTyping] = useState(false)

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Skip boot if requested
  useEffect(() => {
    if (skipBoot) {
      onComplete()
    }
  }, [skipBoot, onComplete])

  // Boot sequence
  useEffect(() => {
    if (skipBoot) return

    let lineIndex = 0
    let charIndex = 0
    let timeoutId: NodeJS.Timeout

    const typeNextChar = () => {
      if (lineIndex >= bootMessages.length) {
        // All done, wait a moment then complete
        setTimeout(onComplete, 500)
        return
      }

      const currentLine = bootMessages[lineIndex]

      if (charIndex === 0) {
        setIsTyping(true)
        setCurrentText('')
      }

      if (charIndex < currentLine.text.length) {
        setCurrentText(currentLine.text.slice(0, charIndex + 1))
        charIndex++
        // Vary typing speed for more natural feel
        const delay = Math.random() * 15 + 10
        timeoutId = setTimeout(typeNextChar, delay)
      } else {
        // Line complete
        setLines(prev => [...prev, currentLine])
        setCurrentText('')
        setIsTyping(false)
        lineIndex++
        charIndex = 0
        // Pause between lines
        const pause = 150 + Math.random() * 100
        timeoutId = setTimeout(typeNextChar, pause)
      }
    }

    // Start after initial delay
    timeoutId = setTimeout(typeNextChar, 300)

    return () => clearTimeout(timeoutId)
  }, [skipBoot, onComplete])

  const getStatusColor = useCallback((status?: string) => {
    switch (status) {
      case 'ok': return theme.success
      case 'ready': return theme.accent
      case 'warn': return '#ffb000'
      default: return theme.text
    }
  }, [theme])

  const getStatusText = useCallback((status?: string) => {
    switch (status) {
      case 'ok': return '[ OK ]'
      case 'ready': return '[ READY ]'
      case 'warn': return '[ WARN ]'
      default: return ''
    }
  }, [])

  if (skipBoot) return null

  return (
    <div
      className="p-6 font-mono text-sm"
      style={{ color: theme.text, minHeight: '500px' }}
    >
      {/* ASCII Logo */}
      <pre
        className="text-[10px] sm:text-xs mb-6 leading-tight"
        style={{ color: theme.accent }}
      >
{`
 ██╗   ██╗███╗   ██╗███████╗ ██████╗  ██████╗██╗   ██╗███████╗
 ██║   ██║████╗  ██║██╔════╝██╔═══██╗██╔════╝██║   ██║██╔════╝
 ██║   ██║██╔██╗ ██║█████╗  ██║   ██║██║     ██║   ██║███████╗
 ██║   ██║██║╚██╗██║██╔══╝  ██║   ██║██║     ██║   ██║╚════██║
 ╚██████╔╝██║ ╚████║██║     ╚██████╔╝╚██████╗╚██████╔╝███████║
  ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝
`}
      </pre>

      <div className="space-y-1">
        {/* Completed lines */}
        {lines.map((line, i) => (
          <div key={i} className="flex items-center gap-4">
            <span style={{ color: theme.muted }}>[{line.time.padStart(7)}]</span>
            <span className="flex-1">{line.text}</span>
            {line.status && (
              <span style={{ color: getStatusColor(line.status) }}>
                {getStatusText(line.status)}
              </span>
            )}
          </div>
        ))}

        {/* Currently typing line */}
        {isTyping && (
          <div className="flex items-center gap-4">
            <span style={{ color: theme.muted }}>
              [{bootMessages[lines.length]?.time.padStart(7)}]
            </span>
            <span>
              {currentText}
              <span
                className="inline-block w-2 h-4 ml-0.5 -mb-0.5"
                style={{
                  backgroundColor: showCursor ? theme.accent : 'transparent',
                  transition: 'none'
                }}
              />
            </span>
          </div>
        )}

        {/* Final prompt after boot */}
        {lines.length === bootMessages.length && (
          <div className="mt-6 animate-fade-in">
            <div className="flex items-center gap-2">
              <span style={{ color: theme.success }}>$</span>
              <span>./start-session</span>
              <span
                className="inline-block w-2 h-4 ml-0.5"
                style={{
                  backgroundColor: showCursor ? theme.accent : 'transparent',
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
