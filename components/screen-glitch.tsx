'use client'

import { useEffect, useState } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

interface ScreenGlitchProps {
  trigger: string // Changes to this value trigger the glitch
  children: React.ReactNode
}

export function ScreenGlitch({ trigger, children }: ScreenGlitchProps) {
  const { theme } = useUnfocus()
  const [isGlitching, setIsGlitching] = useState(false)
  const [glitchPhase, setGlitchPhase] = useState(0)
  const [prevTrigger, setPrevTrigger] = useState(trigger)

  useEffect(() => {
    if (trigger !== prevTrigger) {
      setPrevTrigger(trigger)
      setIsGlitching(true)
      setGlitchPhase(1)

      // Glitch sequence
      const timers = [
        setTimeout(() => setGlitchPhase(2), 50),
        setTimeout(() => setGlitchPhase(3), 100),
        setTimeout(() => setGlitchPhase(4), 150),
        setTimeout(() => setGlitchPhase(5), 200),
        setTimeout(() => {
          setIsGlitching(false)
          setGlitchPhase(0)
        }, 300),
      ]

      return () => timers.forEach(t => clearTimeout(t))
    }
  }, [trigger, prevTrigger])

  const getGlitchStyle = (): React.CSSProperties => {
    if (!isGlitching) return {}

    switch (glitchPhase) {
      case 1:
        return {
          transform: 'translateX(3px) skewX(2deg)',
          filter: 'hue-rotate(90deg)',
        }
      case 2:
        return {
          transform: 'translateX(-5px) skewX(-1deg)',
          filter: 'brightness(1.5) contrast(1.2)',
          clipPath: 'inset(20% 0 30% 0)',
        }
      case 3:
        return {
          transform: 'translateX(2px) translateY(-2px)',
          filter: 'saturate(2)',
        }
      case 4:
        return {
          transform: 'translateX(-1px) skewY(1deg)',
          filter: 'brightness(0.8)',
        }
      case 5:
        return {
          transform: 'none',
          filter: 'none',
        }
      default:
        return {}
    }
  }

  return (
    <div className="relative">
      {/* Glitch layers */}
      {isGlitching && (
        <>
          {/* Red channel offset */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              mixBlendMode: 'screen',
              opacity: 0.5,
              transform: 'translateX(-3px)',
              filter: 'url(#redChannel)',
            }}
          >
            <div style={{ color: '#ff0000', opacity: 0.3 }}>{children}</div>
          </div>

          {/* Cyan channel offset */}
          <div
            className="absolute inset-0 pointer-events-none z-20"
            style={{
              mixBlendMode: 'screen',
              opacity: 0.5,
              transform: 'translateX(3px)',
            }}
          >
            <div style={{ color: '#00ffff', opacity: 0.3 }}>{children}</div>
          </div>

          {/* Noise bars */}
          <div
            className="absolute inset-0 pointer-events-none z-30"
            style={{
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent ${10 + Math.random() * 20}px,
                ${theme.accent}20 ${10 + Math.random() * 20}px,
                ${theme.accent}20 ${12 + Math.random() * 20}px
              )`,
              animation: 'glitch-bars 0.1s steps(1) infinite',
            }}
          />
        </>
      )}

      {/* Main content */}
      <div style={getGlitchStyle()} className="transition-none">
        {children}
      </div>

      {/* White flash on transition */}
      {isGlitching && glitchPhase <= 2 && (
        <div
          className="absolute inset-0 pointer-events-none z-40"
          style={{
            backgroundColor: theme.text,
            opacity: glitchPhase === 1 ? 0.15 : 0.05,
          }}
        />
      )}
    </div>
  )
}
