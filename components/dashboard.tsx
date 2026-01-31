"use client"

import { useBreak } from '@/lib/break-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Flame, Clock, Leaf, Settings, Play, Pause } from 'lucide-react'

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function formatMinutes(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  return `${mins} min`
}

interface DashboardProps {
  onOpenSettings: () => void
}

export function Dashboard({ onOpenSettings }: DashboardProps) {
  const {
    timeUntilBreak,
    isPaused,
    todayBreaks,
    currentStreak,
    totalBreakTime,
    startBreak,
    pauseTimer,
    resumeTimer,
    setAmbientMode,
  } = useBreak()

  const progress = timeUntilBreak <= 0 ? 100 : 100 - (timeUntilBreak / (30 * 60)) * 100
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="font-serif text-xl font-semibold text-foreground">Stillpoint</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onOpenSettings}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5" />
          <span className="sr-only">Settings</span>
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 pb-12">
        {/* Timer Circle */}
        <div className="relative w-64 h-64 mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 256 256">
            {/* Background circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-secondary"
            />
            {/* Progress circle */}
            <circle
              cx="128"
              cy="128"
              r="120"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-1000 ease-linear"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            {timeUntilBreak <= 0 ? (
              <>
                <p className="text-muted-foreground text-sm mb-2">Time for a break</p>
                <Button 
                  onClick={() => {
                    startBreak()
                    setAmbientMode(true)
                  }}
                  className="rounded-full px-6"
                >
                  Begin Break
                </Button>
              </>
            ) : (
              <>
                <p className="text-muted-foreground text-sm mb-1">Next break in</p>
                <p className="font-serif text-4xl font-medium text-foreground">
                  {formatTime(timeUntilBreak)}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={isPaused ? resumeTimer : pauseTimer}
                  className="mt-2 text-muted-foreground"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      Pause
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Quick action */}
        <Button
          variant="outline"
          onClick={() => {
            startBreak()
            setAmbientMode(true)
          }}
          className="mb-12 rounded-full px-6"
        >
          <Leaf className="w-4 h-4 mr-2" />
          Take a break now
        </Button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full max-w-md">
          <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-center mb-2">
              <Flame className="w-5 h-5 text-accent" />
            </div>
            <p className="font-serif text-2xl font-semibold text-foreground">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </Card>
          
          <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-center mb-2">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <p className="font-serif text-2xl font-semibold text-foreground">{todayBreaks}</p>
            <p className="text-xs text-muted-foreground">Breaks today</p>
          </Card>
          
          <Card className="p-4 text-center bg-card/50 backdrop-blur-sm border-border/50">
            <div className="flex items-center justify-center mb-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="font-serif text-2xl font-semibold text-foreground">{formatMinutes(totalBreakTime)}</p>
            <p className="text-xs text-muted-foreground">Rest today</p>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-sm text-muted-foreground italic">Presence in the periphery</p>
      </footer>
    </div>
  )
}
