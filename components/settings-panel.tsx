"use client"

import { useBreak, type BreakInterval } from '@/lib/break-context'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { X, Bell, Volume2, Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

interface SettingsPanelProps {
  isOpen: boolean
  onClose: () => void
}

const INTERVAL_OPTIONS: { value: BreakInterval; label: string }[] = [
  { value: 20, label: '20 min' },
  { value: 30, label: '30 min' },
  { value: 45, label: '45 min' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '90 min' },
]

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { settings, updateSettings } = useBreak()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      setNotificationPermission(permission)
      if (permission === 'granted') {
        updateSettings({ notificationsEnabled: true })
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-foreground/10 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Panel */}
      <Card className="relative z-10 w-full max-w-md mx-4 mb-4 sm:mb-0 p-6 animate-in slide-in-from-bottom duration-300 bg-card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-serif text-xl font-semibold text-foreground">Settings</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
            <span className="sr-only">Close settings</span>
          </Button>
        </div>

        <div className="space-y-6">
          {/* Break Interval */}
          <div>
            <Label className="flex items-center gap-2 mb-3 text-foreground">
              <Clock className="w-4 h-4" />
              Break Interval
            </Label>
            <div className="flex flex-wrap gap-2">
              {INTERVAL_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={settings.breakInterval === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSettings({ breakInterval: option.value })}
                  className="rounded-full"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Sound */}
          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="flex items-center gap-2 text-foreground cursor-pointer">
              <Volume2 className="w-4 h-4" />
              Sound notifications
            </Label>
            <Switch
              id="sound"
              checked={settings.soundEnabled}
              onCheckedChange={(checked) => updateSettings({ soundEnabled: checked })}
            />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications" className="flex items-center gap-2 text-foreground cursor-pointer">
              <Bell className="w-4 h-4" />
              Push notifications
            </Label>
            {notificationPermission === 'granted' ? (
              <Switch
                id="notifications"
                checked={settings.notificationsEnabled}
                onCheckedChange={(checked) => updateSettings({ notificationsEnabled: checked })}
              />
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={requestNotificationPermission}
                className="rounded-full bg-transparent"
              >
                Enable
              </Button>
            )}
          </div>

          {notificationPermission === 'denied' && (
            <p className="text-sm text-muted-foreground">
              Notifications are blocked. Please enable them in your browser settings.
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground text-center">
            Stillpoint helps you take mindful breaks throughout your day.
          </p>
        </div>
      </Card>
    </div>
  )
}
