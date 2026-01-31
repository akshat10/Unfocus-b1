'use client'

import { useState, useEffect } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'
import { themeList } from '@/lib/themes'

export function SetupScreen() {
  const { settings, updateSettings, startSession, theme, setScreen, screen } = useUnfocus()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null)

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [settings.notificationsEnabled])

  const intervals = [20, 30, 45, 60, 90]

  const handleBack = () => {
    // Go back to ambient if in session, otherwise go to quick start
    if (screen === 'setup') {
      setScreen('ambient')
    }
  }

  return (
    <div
      className="flex flex-col p-6 font-mono"
      style={{ color: theme.text, minHeight: '500px' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-bold" style={{ color: theme.accent }}>SETTINGS</h1>
          <p className="text-xs" style={{ color: theme.muted }}>configure your focus session</p>
        </div>
        <button
          onClick={handleBack}
          className="px-3 py-1 text-xs border hover:opacity-80 transition-opacity"
          style={{ borderColor: theme.muted, color: theme.muted }}
        >
          [ esc ] back
        </button>
      </div>

      {/* Divider */}
      <div className="mb-6" style={{ borderTop: `1px solid ${theme.muted}30` }} />

      {/* Settings Content */}
      <div className="space-y-6 flex-1">
        {/* Interval Selection */}
        <div>
          <p className="text-sm mb-3" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>$</span> set --interval
          </p>
          <div className="flex flex-wrap gap-2">
            {intervals.map((interval) => (
              <button
                key={interval}
                onClick={() => updateSettings({ interval })}
                className="px-4 py-2 text-sm transition-all font-mono"
                style={{
                  backgroundColor: settings.interval === interval ? theme.accent : 'transparent',
                  color: settings.interval === interval ? theme.bg : theme.text,
                  border: `1px solid ${settings.interval === interval ? theme.accent : theme.muted}`,
                }}
              >
                {interval}m
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div>
          <p className="text-sm mb-3" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>$</span> set --flags
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="text-sm hover:opacity-80 transition-opacity font-mono"
              style={{ color: settings.soundEnabled ? theme.accent : theme.muted }}
            >
              [{settings.soundEnabled ? 'x' : ' '}] --sound
            </button>
            <button
              onClick={() => {
                updateSettings({ notificationsEnabled: !settings.notificationsEnabled })
                setTimeout(() => {
                  if ('Notification' in window) {
                    setNotificationPermission(Notification.permission)
                  }
                }, 500)
              }}
              className="text-sm hover:opacity-80 transition-opacity font-mono"
              style={{ color: settings.notificationsEnabled ? theme.accent : theme.muted }}
            >
              [{settings.notificationsEnabled ? 'x' : ' '}] --notify
              {settings.notificationsEnabled && notificationPermission === 'denied' && (
                <span style={{ color: '#ff5555' }}> (blocked)</span>
              )}
              {settings.notificationsEnabled && notificationPermission === 'default' && (
                <span style={{ color: '#ffb000' }}> (click to allow)</span>
              )}
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div>
          <p className="text-sm mb-3" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>$</span> set --theme
          </p>
          <div className="flex flex-wrap gap-3">
            {themeList.map((t) => (
              <button
                key={t.id}
                onClick={() => updateSettings({ themeId: t.id })}
                className="flex flex-col items-center gap-1 p-2 transition-all"
                style={{
                  opacity: settings.themeId === t.id ? 1 : 0.5,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full transition-all"
                  style={{
                    backgroundColor: t.accent,
                    boxShadow: settings.themeId === t.id ? `0 0 0 2px ${theme.bg}, 0 0 0 4px ${t.accent}` : 'none',
                  }}
                />
                <span className="text-xs font-mono" style={{ color: theme.muted }}>
                  {t.name.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="my-6" style={{ borderTop: `1px solid ${theme.muted}30` }} />

      {/* Start Button */}
      <button
        onClick={startSession}
        className="w-full py-4 text-base transition-all hover:opacity-90 font-mono"
        style={{
          backgroundColor: theme.accent,
          color: theme.bg,
        }}
      >
        $ ./start-session
      </button>
    </div>
  )
}
