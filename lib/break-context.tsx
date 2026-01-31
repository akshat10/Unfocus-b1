"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'

export type BreakInterval = 20 | 30 | 45 | 60 | 90

interface BreakData {
  date: string
  breaksTaken: number
  totalBreakTime: number
}

interface Settings {
  breakInterval: BreakInterval
  breakDuration: number
  soundEnabled: boolean
  notificationsEnabled: boolean
}

interface BreakContextType {
  // Timer state
  timeUntilBreak: number
  isOnBreak: boolean
  isPaused: boolean
  
  // Stats
  todayBreaks: number
  currentStreak: number
  totalBreakTime: number
  
  // Settings
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void
  
  // Actions
  startBreak: () => void
  endBreak: () => void
  skipBreak: () => void
  pauseTimer: () => void
  resumeTimer: () => void
  
  // Ambient mode
  isAmbientMode: boolean
  setAmbientMode: (value: boolean) => void
  
  // Reflection
  currentReflection: string | null
  setCurrentReflection: (reflection: string | null) => void
}

const BreakContext = createContext<BreakContextType | null>(null)

const REFLECTIONS = [
  "What's one thing you're grateful for right now?",
  "How does your body feel in this moment?",
  "What would make the rest of your day great?",
  "Notice three things you can see around you.",
  "Take a moment to appreciate how far you've come.",
  "What's one kind thing you can do for yourself today?",
  "Let go of one worry, just for now.",
  "What brings you joy in simple moments?",
  "Breathe in calm, breathe out tension.",
  "You're doing better than you think.",
]

const DEFAULT_SETTINGS: Settings = {
  breakInterval: 30,
  breakDuration: 60,
  soundEnabled: true,
  notificationsEnabled: true,
}

function getStorageKey(key: string) {
  return `stillpoint_${key}`
}

function loadFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  try {
    const stored = localStorage.getItem(getStorageKey(key))
    return stored ? JSON.parse(stored) : defaultValue
  } catch {
    return defaultValue
  }
}

function saveToStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(getStorageKey(key), JSON.stringify(value))
  } catch {
    // Storage full or not available
  }
}

function getTodayKey() {
  return new Date().toISOString().split('T')[0]
}

function calculateStreak(history: BreakData[]): number {
  if (history.length === 0) return 0
  
  const sortedHistory = [...history].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  let streak = 0
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  for (let i = 0; i < sortedHistory.length; i++) {
    const entryDate = new Date(sortedHistory[i].date)
    entryDate.setHours(0, 0, 0, 0)
    
    const expectedDate = new Date(today)
    expectedDate.setDate(today.getDate() - i)
    
    if (entryDate.getTime() === expectedDate.getTime() && sortedHistory[i].breaksTaken > 0) {
      streak++
    } else if (i === 0 && entryDate.getTime() < expectedDate.getTime()) {
      // Today hasn't had a break yet, check if yesterday continues the streak
      const yesterday = new Date(today)
      yesterday.setDate(today.getDate() - 1)
      if (entryDate.getTime() === yesterday.getTime() && sortedHistory[i].breaksTaken > 0) {
        streak++
      } else {
        break
      }
    } else {
      break
    }
  }
  
  return streak
}

export function BreakProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS)
  const [timeUntilBreak, setTimeUntilBreak] = useState(0)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isAmbientMode, setAmbientMode] = useState(false)
  const [currentReflection, setCurrentReflection] = useState<string | null>(null)
  const [history, setHistory] = useState<BreakData[]>([])
  const [isInitialized, setIsInitialized] = useState(false)
  
  // Load from storage on mount
  useEffect(() => {
    const loadedSettings = loadFromStorage('settings', DEFAULT_SETTINGS)
    const loadedHistory = loadFromStorage<BreakData[]>('history', [])
    
    setSettings(loadedSettings)
    setHistory(loadedHistory)
    setTimeUntilBreak(loadedSettings.breakInterval * 60)
    setIsInitialized(true)
  }, [])
  
  // Save settings to storage
  useEffect(() => {
    if (isInitialized) {
      saveToStorage('settings', settings)
    }
  }, [settings, isInitialized])
  
  // Save history to storage
  useEffect(() => {
    if (isInitialized) {
      saveToStorage('history', history)
    }
  }, [history, isInitialized])
  
  // Timer countdown
  useEffect(() => {
    if (!isInitialized || isPaused || isOnBreak) return
    
    const interval = setInterval(() => {
      setTimeUntilBreak((prev) => {
        if (prev <= 1) {
          // Time for a break!
          triggerBreakNotification()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isInitialized, isPaused, isOnBreak])
  
  const triggerBreakNotification = useCallback(() => {
    if (settings.notificationsEnabled && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification('Time for a mindful break', {
          body: 'Take a moment to pause and breathe.',
          icon: '/icon.svg',
          tag: 'stillpoint-break',
        })
      }
    }
    
    if (settings.soundEnabled) {
      playChime()
    }
  }, [settings.notificationsEnabled, settings.soundEnabled])
  
  const playChime = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    
    // Create a gentle, warm chime
    const playTone = (freq: number, startTime: number, duration: number, gain: number) => {
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)
      
      oscillator.type = 'sine'
      oscillator.frequency.setValueAtTime(freq, startTime)
      
      gainNode.gain.setValueAtTime(0, startTime)
      gainNode.gain.linearRampToValueAtTime(gain, startTime + 0.05)
      gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
      
      oscillator.start(startTime)
      oscillator.stop(startTime + duration)
    }
    
    const now = audioContext.currentTime
    // Warm, organic chord progression
    playTone(392, now, 1.5, 0.15) // G4
    playTone(494, now + 0.1, 1.4, 0.12) // B4
    playTone(588, now + 0.2, 1.3, 0.1) // D5
  }, [])
  
  const updateSettings = useCallback((newSettings: Partial<Settings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings }
      if (newSettings.breakInterval && newSettings.breakInterval !== prev.breakInterval) {
        setTimeUntilBreak(newSettings.breakInterval * 60)
      }
      return updated
    })
  }, [])
  
  const startBreak = useCallback(() => {
    setIsOnBreak(true)
    setCurrentReflection(REFLECTIONS[Math.floor(Math.random() * REFLECTIONS.length)])
    
    if (settings.soundEnabled) {
      playChime()
    }
  }, [settings.soundEnabled, playChime])
  
  const endBreak = useCallback(() => {
    setIsOnBreak(false)
    setAmbientMode(false)
    setTimeUntilBreak(settings.breakInterval * 60)
    
    // Update history
    const todayKey = getTodayKey()
    setHistory((prev) => {
      const existing = prev.find((d) => d.date === todayKey)
      if (existing) {
        return prev.map((d) =>
          d.date === todayKey
            ? { ...d, breaksTaken: d.breaksTaken + 1, totalBreakTime: d.totalBreakTime + settings.breakDuration }
            : d
        )
      }
      return [...prev, { date: todayKey, breaksTaken: 1, totalBreakTime: settings.breakDuration }]
    })
  }, [settings.breakInterval, settings.breakDuration])
  
  const skipBreak = useCallback(() => {
    setTimeUntilBreak(settings.breakInterval * 60)
  }, [settings.breakInterval])
  
  const pauseTimer = useCallback(() => {
    setIsPaused(true)
  }, [])
  
  const resumeTimer = useCallback(() => {
    setIsPaused(false)
  }, [])
  
  // Calculate stats
  const todayData = history.find((d) => d.date === getTodayKey())
  const todayBreaks = todayData?.breaksTaken ?? 0
  const totalBreakTime = todayData?.totalBreakTime ?? 0
  const currentStreak = calculateStreak(history)
  
  return (
    <BreakContext.Provider
      value={{
        timeUntilBreak,
        isOnBreak,
        isPaused,
        todayBreaks,
        currentStreak,
        totalBreakTime,
        settings,
        updateSettings,
        startBreak,
        endBreak,
        skipBreak,
        pauseTimer,
        resumeTimer,
        isAmbientMode,
        setAmbientMode,
        currentReflection,
        setCurrentReflection,
      }}
    >
      {children}
    </BreakContext.Provider>
  )
}

export function useBreak() {
  const context = useContext(BreakContext)
  if (!context) {
    throw new Error('useBreak must be used within a BreakProvider')
  }
  return context
}
