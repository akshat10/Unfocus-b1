'use client'

import { useState, useEffect } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'
import { themeList, fontList } from '@/lib/themes'

export function SetupScreen() {
  const { settings, updateSettings, startSession, theme } = useUnfocus()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null)

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [settings.notificationsEnabled])

  const intervals = [30, 45, 60, 90]

  return (
    <div
      className="flex items-center justify-center p-6"
      style={{ color: theme.text, minHeight: '500px' }}
    >
      <div className="w-full max-w-lg space-y-6 animate-fade-in">
        {/* ASCII Logo */}
        <div className="text-center space-y-4">
          <pre
            className="text-[10px] sm:text-xs leading-none"
            style={{ color: theme.accent }}
          >
{`██╗   ██╗███╗   ██╗███████╗ ██████╗  ██████╗██╗   ██╗███████╗
██║   ██║████╗  ██║██╔════╝██╔═══██╗██╔════╝██║   ██║██╔════╝
██║   ██║██╔██╗ ██║█████╗  ██║   ██║██║     ██║   ██║███████╗
██║   ██║██║╚██╗██║██╔══╝  ██║   ██║██║     ██║   ██║╚════██║
╚██████╔╝██║ ╚████║██║     ╚██████╔╝╚██████╗╚██████╔╝███████║
 ╚═════╝ ╚═╝  ╚═══╝╚═╝      ╚═════╝  ╚═════╝ ╚═════╝ ╚══════╝`}
          </pre>
          <p className="text-sm" style={{ color: theme.muted }}>
            {'>'} the terminal is patient. you don&apos;t have to be.
          </p>
        </div>

        {/* Divider */}
        <div className="text-center" style={{ color: theme.muted }}>
          {'─'.repeat(40)}
        </div>

        {/* Interval Selection */}
        <div className="space-y-3">
          <p className="text-sm tracking-wider" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>$</span> set --interval
          </p>
          <div className="flex flex-wrap gap-2">
            {intervals.map((interval) => (
              <button
                key={interval}
                onClick={() => updateSettings({ interval })}
                className="px-4 py-2 text-sm transition-all tracking-wider"
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
        <div className="space-y-3">
          <p className="text-sm tracking-wider" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>$</span> set --flags
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="text-sm hover:opacity-80 transition-opacity tracking-wider"
              style={{ color: settings.soundEnabled ? theme.accent : theme.muted }}
            >
              [{settings.soundEnabled ? '✓' : ' '}] --sound
            </button>
            <button
              onClick={() => {
                updateSettings({ notificationsEnabled: !settings.notificationsEnabled })
                // Re-check permission after a moment
                setTimeout(() => {
                  if ('Notification' in window) {
                    setNotificationPermission(Notification.permission)
                  }
                }, 500)
              }}
              className="text-sm hover:opacity-80 transition-opacity tracking-wider"
              style={{ color: settings.notificationsEnabled ? theme.accent : theme.muted }}
            >
              [{settings.notificationsEnabled ? '✓' : ' '}] --notify
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
        <div className="space-y-3">
          <p className="text-sm tracking-wider" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>$</span> set --theme
          </p>
          <div className="flex flex-wrap gap-3">
            {themeList.map((t) => (
              <button
                key={t.id}
                onClick={() => updateSettings({ themeId: t.id })}
                className="flex flex-col items-center gap-1 p-2 transition-all rounded"
                style={{
                  opacity: settings.themeId === t.id ? 1 : 0.6,
                }}
              >
                <div
                  className="w-6 h-6 rounded-full transition-all"
                  style={{
                    backgroundColor: t.accent,
                    boxShadow: settings.themeId === t.id ? `0 0 0 2px ${theme.bg}, 0 0 0 4px ${t.accent}` : 'none',
                  }}
                />
                <span className="text-xs" style={{ color: theme.muted }}>
                  {t.name.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Font Selection */}
        <div className="space-y-3">
          <p className="text-sm tracking-wider" style={{ color: theme.muted }}>
            <span style={{ color: theme.success }}>$</span> set --font
          </p>
          <div className="flex flex-wrap gap-2">
            {fontList.map((f) => (
              <button
                key={f.id}
                onClick={() => updateSettings({ fontId: f.id })}
                className="px-4 py-2 text-sm transition-all tracking-wider"
                style={{
                  backgroundColor: settings.fontId === f.id ? theme.accent : 'transparent',
                  color: settings.fontId === f.id ? theme.bg : theme.text,
                  border: `1px solid ${settings.fontId === f.id ? theme.accent : theme.muted}`,
                  fontFamily: `${f.variable}, ${f.fallback}`,
                }}
              >
                {f.name}
              </button>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="text-center text-xs" style={{ color: theme.muted }}>
          ════════════════════════════════════════
        </div>

        {/* Start Button */}
        <button
          onClick={startSession}
          className="w-full py-4 text-base transition-all hover:opacity-90 flex items-center justify-center gap-3 tracking-widest"
          style={{
            backgroundColor: theme.accent,
            color: theme.bg,
          }}
        >
          <span style={{ color: theme.bg }}>$</span>
          ./start-session
          <span className="animate-blink">█</span>
        </button>
      </div>
    </div>
  )
}
