'use client'

import { useEffect, useState } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

interface TypingTextProps {
  text: string
  speed?: number
  delay?: number
  onComplete?: () => void
  className?: string
  showCursor?: boolean
}

export function TypingText({
  text,
  speed = 30,
  delay = 0,
  onComplete,
  className = '',
  showCursor = true,
}: TypingTextProps) {
  const { theme } = useUnfocus()
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)
  const [cursorVisible, setCursorVisible] = useState(true)

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    let charIndex = 0

    const startTyping = () => {
      const typeChar = () => {
        if (charIndex < text.length) {
          setDisplayedText(text.slice(0, charIndex + 1))
          charIndex++
          // Add some randomness for natural feel
          const nextDelay = speed + Math.random() * 20 - 10
          timeoutId = setTimeout(typeChar, Math.max(10, nextDelay))
        } else {
          setIsComplete(true)
          onComplete?.()
        }
      }

      timeoutId = setTimeout(typeChar, delay)
    }

    startTyping()

    return () => clearTimeout(timeoutId)
  }, [text, speed, delay, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <span
          className="inline-block w-2 h-4 ml-0.5 -mb-0.5"
          style={{
            backgroundColor: cursorVisible ? theme.accent : 'transparent',
          }}
        />
      )}
    </span>
  )
}
