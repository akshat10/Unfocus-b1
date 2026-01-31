'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import { themes, applyTheme, type Theme } from './themes'

type Screen = 'setup' | 'ambient' | 'break' | 'summary'

type BreakType = 'eyes' | 'breath' | 'posture' | 'hands' | 'hydration' | 'window'

interface BreakContent {
  type: BreakType
  noticing: string
  invitation: string
  duration: number
}

const breakContents: BreakContent[] = [
  {
    type: 'eyes',
    noticing: 'your eyes have been focused on this distance for a while.',
    invitation: 'find something 20 feet away. rest your gaze there.',
    duration: 20,
  },
  {
    type: 'breath',
    noticing: 'when did you last take a full breath?',
    invitation: 'one deep inhale... hold... slow exhale.',
    duration: 15,
  },
  {
    type: 'posture',
    noticing: 'notice how you\'re sitting right now.',
    invitation: 'feet flat. shoulders back. crown lifted.',
    duration: 10,
  },
  {
    type: 'hands',
    noticing: 'your hands have been working hard.',
    invitation: 'open your palms. spread fingers wide. release.',
    duration: 15,
  },
  {
    type: 'hydration',
    noticing: 'bodies are mostly water.',
    invitation: 'take a sip. or go fill your glass.',
    duration: 20,
  },
  {
    type: 'window',
    noticing: 'screens don\'t have depth. the world does.',
    invitation: 'look out a window. let your eyes wander.',
    duration: 20,
  },
]

interface Settings {
  interval: number
  soundEnabled: boolean
  notificationsEnabled: boolean
  themeId: string
}

interface Stats {
  breaksTaken: number
  presenceSeconds: number
  streakDays: number
  lastSessionDate: string | null
}

interface UnfocusContextType {
  screen: Screen
  setScreen: (screen: Screen) => void
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  theme: Theme
  stats: Stats
  sessionStartTime: number | null
  startSession: () => void
  endSession: () => void
  triggerBreak: () => void
  completeBreak: () => void
  skipBreak: () => void
  currentBreak: BreakContent | null
  playChime: () => void
}

const UnfocusContext = createContext<UnfocusContextType | null>(null)

export function UnfocusProvider({ children }: { children: React.ReactNode }) {
  const [screen, setScreen] = useState<Screen>('setup')
  const [settings, setSettings] = useState<Settings>({
    interval: 45,
    soundEnabled: true,
    notificationsEnabled: false,
    themeId: 'dracula',
  })
  const [stats, setStats] = useState<Stats>({
    breaksTaken: 0,
    presenceSeconds: 0,
    streakDays: 0,
    lastSessionDate: null,
  })
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [currentBreak, setCurrentBreak] = useState<BreakContent | null>(null)
  const [lastBreakType, setLastBreakType] = useState<BreakType | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)

  const theme = themes[settings.themeId] || themes.dracula

  // Load settings and stats from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('unfocus-settings')
    const savedStats = localStorage.getItem('unfocus-stats')
    
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings)
      setSettings(parsed)
    }
    
    if (savedStats) {
      const parsed = JSON.parse(savedStats)
      // Check streak
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      
      if (parsed.lastSessionDate === today) {
        setStats(parsed)
      } else if (parsed.lastSessionDate === yesterday) {
        setStats({ ...parsed, breaksTaken: 0, presenceSeconds: 0 })
      } else {
        setStats({ ...parsed, breaksTaken: 0, presenceSeconds: 0, streakDays: 0 })
      }
    }
  }, [])

  // Apply theme on mount and when it changes
  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('unfocus-settings', JSON.stringify(settings))
  }, [settings])

  // Save stats to localStorage
  useEffect(() => {
    localStorage.setItem('unfocus-stats', JSON.stringify(stats))
  }, [stats])

  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  const playChime = useCallback(() => {
    if (!settings.soundEnabled) return
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext()
      }
      const ctx = audioContextRef.current
      
      // Terminal-style beep sequence
      const frequencies = [440, 554, 659] // A4, C#5, E5 - terminal chord
      const now = ctx.currentTime
      
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        
        osc.type = 'square' // More terminal-like
        osc.frequency.setValueAtTime(freq, now)
        
        gain.gain.setValueAtTime(0, now + i * 0.08)
        gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.02)
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.3)
        
        osc.connect(gain)
        gain.connect(ctx.destination)
        
        osc.start(now + i * 0.08)
        osc.stop(now + i * 0.08 + 0.4)
      })
    } catch {
      // Audio not available
    }
  }, [settings.soundEnabled])

  const startSession = useCallback(() => {
    setSessionStartTime(Date.now())
    setScreen('ambient')
    
    // Update streak
    const today = new Date().toDateString()
    setStats(prev => {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      let newStreak = prev.streakDays
      
      if (prev.lastSessionDate !== today) {
        if (prev.lastSessionDate === yesterday) {
          newStreak = prev.streakDays + 1
        } else if (!prev.lastSessionDate) {
          newStreak = 1
        }
      }
      
      return {
        ...prev,
        lastSessionDate: today,
        streakDays: newStreak,
      }
    })
    
    // Request notification permission
    if (settings.notificationsEnabled && 'Notification' in window) {
      Notification.requestPermission()
    }
  }, [settings.notificationsEnabled])

  const endSession = useCallback(() => {
    setScreen('summary')
  }, [])

  const triggerBreak = useCallback(() => {
    // Pick a random break type, avoiding the last one used
    const availableBreaks = lastBreakType 
      ? breakContents.filter(b => b.type !== lastBreakType)
      : breakContents
    const randomBreak = availableBreaks[Math.floor(Math.random() * availableBreaks.length)]
    setCurrentBreak(randomBreak)
    setLastBreakType(randomBreak.type)
    setScreen('break')
    
    playChime()
    
    // Show notification
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('unfocus', {
        body: `time to ${randomBreak.type}`,
        icon: '/icon.svg',
        silent: true,
      })
    }
  }, [settings.notificationsEnabled, playChime])

  const completeBreak = useCallback(() => {
    setStats(prev => ({
      ...prev,
      breaksTaken: prev.breaksTaken + 1,
      presenceSeconds: prev.presenceSeconds + (currentBreak?.duration || 0),
    }))
    setCurrentBreak(null)
    setScreen('ambient')
  }, [currentBreak])

  const skipBreak = useCallback(() => {
    setCurrentBreak(null)
    setScreen('ambient')
  }, [])

  return (
    <UnfocusContext.Provider
      value={{
        screen,
        setScreen,
        settings,
        updateSettings,
        theme,
        stats,
        sessionStartTime,
        startSession,
        endSession,
        triggerBreak,
        completeBreak,
        skipBreak,
        currentBreak,
        playChime,
      }}
    >
      {children}
    </UnfocusContext.Provider>
  )
}

export function useUnfocus() {
  const context = useContext(UnfocusContext)
  if (!context) {
    throw new Error('useUnfocus must be used within UnfocusProvider')
  }
  return context
}
