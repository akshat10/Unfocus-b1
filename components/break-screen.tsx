'use client'

import { useEffect, useState, useRef } from 'react'
import { useUnfocus, type BreakType } from '@/lib/unfocus-context'

// Animated ASCII art components for each break type
function EyesAnimation() {
  const [frame, setFrame] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 60)
    }, 100)
    return () => clearInterval(interval)
  }, [])
  
  // Blink every ~3 seconds (frame 0 and 30)
  const isBlinking = frame < 3 || (frame >= 30 && frame < 33)
  const eyeChar = isBlinking ? '—' : 'O'
  
  // Eye movement during non-blink
  const lookDirection = Math.floor(frame / 10) % 3
  const leftPad = lookDirection === 0 ? ' ' : lookDirection === 1 ? '' : '  '
  const rightPad = lookDirection === 0 ? ' ' : lookDirection === 1 ? '  ' : ''
  
  return (
    <pre className="text-center text-sm sm:text-base leading-tight font-mono">
{`    .-"""-.
   /        \\
  |${leftPad} ${eyeChar}  ${eyeChar} ${rightPad}|
  |    __    |
   \\  \\__/  /
    '-.  .-'
       ""`}
    </pre>
  )
}

function BreathAnimation() {
  const [phase, setPhase] = useState(0)
  const [scale, setScale] = useState(1)
  
  useEffect(() => {
    // 4-4-6-2 breathing: inhale(4s), hold(4s), exhale(6s), hold(2s)
    const cycleDuration = 16000
    const interval = setInterval(() => {
      const elapsed = Date.now() % cycleDuration
      
      if (elapsed < 4000) {
        // Inhale - expand
        setPhase(0)
        setScale(1 + (elapsed / 4000) * 0.5)
      } else if (elapsed < 8000) {
        // Hold at peak
        setPhase(1)
        setScale(1.5)
      } else if (elapsed < 14000) {
        // Exhale - contract
        setPhase(2)
        setScale(1.5 - ((elapsed - 8000) / 6000) * 0.5)
      } else {
        // Hold at bottom
        setPhase(3)
        setScale(1)
      }
    }, 50)
    return () => clearInterval(interval)
  }, [])
  
  const phaseLabels = ['inhale...', 'hold...', 'exhale...', 'rest...']
  
  // Generate breath visualization based on scale
  const size = Math.round(scale * 4)
  const spaces = ' '.repeat(7 - size)
  const innerSpaces = ' '.repeat(Math.max(0, (size * 2) - 1))
  
  return (
    <div className="text-center">
      <pre className="text-sm sm:text-base leading-tight font-mono">
{size >= 6 ? `
${spaces}   .
${spaces}  /|\\
${spaces} / | \\
${spaces}/  |  \\
       /   |   \\
      /____|____\\
         ~~~
` : size >= 5 ? `
${spaces}  .
${spaces} /|\\
${spaces}/ | \\
      /  |  \\
     /____|____\\
        ~~~
` : size >= 4 ? `
${spaces} .
${spaces}/|\\
      / | \\
     /__|__\\
       ~~~
` : `
       .
      /|\\
     /_|_\\
      ~~~
`}
      </pre>
      <div className="mt-2 text-xs opacity-70">{phaseLabels[phase]}</div>
    </div>
  )
}

function PostureAnimation() {
  const [frame, setFrame] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 40)
    }, 150)
    return () => clearInterval(interval)
  }, [])
  
  // Animate a gentle stretch up
  const stretched = frame >= 10 && frame < 30
  
  return (
    <pre className="text-center text-sm sm:text-base leading-tight font-mono">
{stretched ? `
      \\O/
       |
       |
      / \\
     /   \\
` : `
       O
      /|\\
       |
      / \\
     /   \\
`}
    </pre>
  )
}

function HandsAnimation() {
  const [frame, setFrame] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f + 1) % 30)
    }, 200)
    return () => clearInterval(interval)
  }, [])
  
  // Animate fingers opening and closing
  const open = frame < 15
  
  return (
    <pre className="text-center text-sm sm:text-base leading-tight font-mono">
{open ? `
     _____
    | | | |
    | | | |
    | | | |
    |_|_|_|
     \\   /
      \\_/
` : `
     _____
    |     |
    |     |
    |     |
    |_____|
     \\   /
      \\_/
`}
    </pre>
  )
}

function HydrationAnimation() {
  const [level, setLevel] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setLevel(l => (l + 1) % 100)
    }, 80)
    return () => clearInterval(interval)
  }, [])
  
  // Water level rises then falls
  const waterHeight = level < 50 ? Math.floor(level / 10) : Math.floor((100 - level) / 10)
  
  const lines = [
    waterHeight >= 4 ? '~~~~~' : '     ',
    waterHeight >= 3 ? '~~~~~' : '     ',
    waterHeight >= 2 ? '~~~~~' : '     ',
    waterHeight >= 1 ? '~~~~~' : '     ',
  ]
  
  return (
    <pre className="text-center text-sm sm:text-base leading-tight font-mono">
{`     _____
    |${lines[0]}|
    |${lines[1]}|
    |${lines[2]}|
    |${lines[3]}|
    |_____|
     \\   /
      \\_/`}
    </pre>
  )
}

function WindowAnimation() {
  const [stars, setStars] = useState(['  .  *  ', '    *  .', ' .    * ', '   *   .'])
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStars(prev => {
        const chars = ['.', '*', ' ', ' ', ' ']
        return prev.map(() => {
          let line = ''
          for (let i = 0; i < 8; i++) {
            line += chars[Math.floor(Math.random() * chars.length)]
          }
          return line
        })
      })
    }, 400)
    return () => clearInterval(interval)
  }, [])
  
  return (
    <pre className="text-center text-sm sm:text-base leading-tight font-mono">
{`   +---------+
   |${stars[0]}|
   |${stars[1]}|
   |${stars[2]}|
   |${stars[3]}|
   +---------+`}
    </pre>
  )
}

const AnimatedAscii: Record<BreakType, () => JSX.Element> = {
  eyes: EyesAnimation,
  breath: BreathAnimation,
  posture: PostureAnimation,
  hands: HandsAnimation,
  hydration: HydrationAnimation,
  window: WindowAnimation,
}

export function BreakScreen() {
  const { theme, currentBreak, completeBreak, skipBreak, repeatBreak } = useUnfocus()
  const [progress, setProgress] = useState(0)
  const [timeLeft, setTimeLeft] = useState(currentBreak?.duration || 20)
  const [breakKey, setBreakKey] = useState(0)
  const startTimeRef = useRef(Date.now())

  const handleRepeat = () => {
    startTimeRef.current = Date.now()
    setProgress(0)
    setTimeLeft(currentBreak?.duration || 20)
    setBreakKey(prev => prev + 1)
    repeatBreak()
  }

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault()
        skipBreak()
      }
      if (e.key === 'r' && !e.metaKey && !e.ctrlKey && !e.altKey) {
        handleRepeat()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [skipBreak])

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

  const barLength = 20
  const filledLength = Math.floor(progress * barLength)
  const progressBar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength)

  const AsciiComponent = AnimatedAscii[currentBreak.type]

  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="w-full max-w-lg animate-fade-in" key={breakKey}>
        {/* Animated ASCII Art */}
        <div className="mb-6" style={{ color: theme.accent }}>
          <AsciiComponent />
        </div>

        {/* Break type header */}
        <div className="mb-6 text-center">
          <span style={{ color: theme.accent }} className="text-lg">
            {'>'} {currentBreak.type.toUpperCase()}
          </span>
        </div>

        {/* Content box */}
        <div 
          className="border p-6 mb-6"
          style={{ borderColor: theme.muted }}
        >
          <p className="mb-4" style={{ color: theme.muted }}>
            {currentBreak.noticing}
          </p>
          <div className="border-t my-4" style={{ borderColor: theme.muted }} />
          <p style={{ color: theme.accent }}>
            {currentBreak.invitation}
          </p>
        </div>

        {/* Progress bar */}
        <div className="text-center mb-8">
          <div className="font-mono text-lg tracking-widest">
            [{progressBar}]
          </div>
          <div className="mt-2" style={{ color: theme.muted }}>
            {timeLeft}s remaining
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-6 text-sm">
          <button
            onClick={handleRepeat}
            className="hover:opacity-80 transition-opacity"
            style={{ color: theme.accent }}
          >
            [r] repeat
          </button>
          <button
            onClick={skipBreak}
            className="hover:opacity-80 transition-opacity"
            style={{ color: theme.muted }}
          >
            [ctrl+c] skip
          </button>
        </div>
      </div>
    </div>
  )
}
