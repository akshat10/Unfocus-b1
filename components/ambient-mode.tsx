"use client"

import { useBreak } from '@/lib/break-context'
import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { X, Share2, Download } from 'lucide-react'

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'rest'

const BREATH_CYCLE = {
  inhale: 4,
  hold: 4,
  exhale: 6,
  rest: 2,
}

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Breathe in',
  hold: 'Hold',
  exhale: 'Breathe out',
  rest: 'Rest',
}

export function AmbientMode() {
  const { endBreak, setAmbientMode, currentReflection, settings } = useBreak()
  const [phase, setPhase] = useState<BreathPhase>('inhale')
  const [phaseTime, setPhaseTime] = useState(BREATH_CYCLE.inhale)
  const [breakTime, setBreakTime] = useState(0)
  const [showReflection, setShowReflection] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Breathing cycle
  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseTime((prev) => {
        if (prev <= 1) {
          // Move to next phase
          setPhase((currentPhase) => {
            const phases: BreathPhase[] = ['inhale', 'hold', 'exhale', 'rest']
            const currentIndex = phases.indexOf(currentPhase)
            const nextPhase = phases[(currentIndex + 1) % phases.length]
            return nextPhase
          })
          return BREATH_CYCLE[phase === 'rest' ? 'inhale' : phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : 'rest']
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [phase])

  // Break timer
  useEffect(() => {
    const interval = setInterval(() => {
      setBreakTime((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Show reflection after some breathing
  useEffect(() => {
    if (breakTime >= 20 && !showReflection) {
      setShowReflection(true)
    }
  }, [breakTime, showReflection])

  const handleClose = () => {
    endBreak()
    setAmbientMode(false)
  }

  const handleShare = async () => {
    if (!cardRef.current) return

    try {
      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      })
      
      canvas.toBlob((blob) => {
        if (!blob) return
        
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `stillpoint-${new Date().toISOString().split('T')[0]}.png`
        a.click()
        URL.revokeObjectURL(url)
      }, 'image/png')
    } catch {
      // Fallback: copy text to clipboard
      if (currentReflection) {
        await navigator.clipboard.writeText(currentReflection)
      }
    }
  }

  // Calculate breathing circle scale
  const getScale = () => {
    const progress = phaseTime / BREATH_CYCLE[phase]
    if (phase === 'inhale') {
      return 0.6 + (1 - progress) * 0.4
    } else if (phase === 'exhale') {
      return 1 - progress * 0.4
    }
    return phase === 'hold' ? 1 : 0.6
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden">
      {/* Subtle animated gradient background */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, oklch(0.55 0.1 145 / 0.3) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, oklch(0.65 0.12 45 / 0.2) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, oklch(0.92 0.02 80 / 0.5) 0%, transparent 70%)
            `,
            animation: 'float 20s ease-in-out infinite',
          }}
        />
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute top-4 right-4 text-muted-foreground hover:text-foreground z-10"
      >
        <X className="w-5 h-5" />
        <span className="sr-only">Close ambient mode</span>
      </Button>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Breathing circle */}
        <div className="relative w-64 h-64 mb-8">
          <div
            className="absolute inset-0 rounded-full bg-primary/10 border-2 border-primary/30 transition-transform duration-1000 ease-in-out"
            style={{
              transform: `scale(${getScale()})`,
            }}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-xl font-serif text-foreground mb-1">
              {PHASE_LABELS[phase]}
            </p>
            <p className="text-4xl font-serif font-medium text-primary">
              {phaseTime}
            </p>
          </div>
        </div>

        {/* Reflection card */}
        {showReflection && currentReflection && (
          <div 
            ref={cardRef}
            className="max-w-sm mx-auto p-8 rounded-2xl bg-card border border-border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700"
          >
            <p className="text-sm text-muted-foreground mb-3">Reflection</p>
            <p className="font-serif text-xl text-foreground leading-relaxed text-balance">
              {currentReflection}
            </p>
            
            <div className="flex items-center justify-end mt-6 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                className="text-muted-foreground"
              >
                <Download className="w-4 h-4 mr-1" />
                Save
              </Button>
            </div>
          </div>
        )}

        {/* Break duration */}
        <p className="mt-8 text-sm text-muted-foreground">
          {Math.floor(breakTime / 60)}:{(breakTime % 60).toString().padStart(2, '0')} mindful minutes
        </p>

        {/* End break button */}
        <Button
          variant="outline"
          onClick={handleClose}
          className="mt-6 rounded-full px-6 bg-transparent"
        >
          End Break
        </Button>
      </div>

      {/* Floating animation keyframes */}
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(2%, 1%) rotate(0.5deg);
          }
          50% {
            transform: translate(-1%, 2%) rotate(-0.5deg);
          }
          75% {
            transform: translate(-2%, -1%) rotate(0.25deg);
          }
        }
      `}</style>
    </div>
  )
}
