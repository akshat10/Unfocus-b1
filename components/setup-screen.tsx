'use client'

import { useUnfocus } from '@/lib/unfocus-context'
import { themeList } from '@/lib/themes'

export function SetupScreen() {
  const { settings, updateSettings, startSession, theme } = useUnfocus()

  const intervals = [30, 45, 60, 90]

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: theme.bg, color: theme.text }}
    >
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        {/* ASCII Logo */}
        <div className="text-center space-y-2">
          <pre className="text-sm sm:text-base leading-tight" style={{ color: theme.accent }}>
{`╦ ╦╔╗╔╔═╗╔═╗╔═╗╦ ╦╔═╗
║ ║║║║╠╣ ║ ║║  ║ ║╚═╗
╚═╝╝╚╝╚  ╚═╝╚═╝╚═╝╚═╝`}
          </pre>
          <p className="text-sm italic" style={{ color: theme.muted }}>
            the terminal is patient. you don&apos;t have to be.
          </p>
        </div>

        {/* Divider */}
        <div className="text-center" style={{ color: theme.muted }}>
          {'─'.repeat(40)}
        </div>

        {/* Interval Selection */}
        <div className="space-y-3">
          <p style={{ color: theme.muted }}>{`> set interval`}</p>
          <div className="flex flex-wrap gap-2">
            {intervals.map((interval) => (
              <button
                key={interval}
                onClick={() => updateSettings({ interval })}
                className="px-4 py-2 text-sm transition-all"
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
          <p style={{ color: theme.muted }}>{`> options`}</p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: theme.text }}
            >
              [{settings.soundEnabled ? 'x' : ' '}] sound
            </button>
            <button
              onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
              className="text-sm hover:opacity-80 transition-opacity"
              style={{ color: theme.text }}
            >
              [{settings.notificationsEnabled ? 'x' : ' '}] notifications
            </button>
          </div>
        </div>

        {/* Theme Selection */}
        <div className="space-y-3">
          <p style={{ color: theme.muted }}>{`> theme`}</p>
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

        {/* Divider */}
        <div className="text-center" style={{ color: theme.muted }}>
          {'─'.repeat(40)}
        </div>

        {/* Start Button */}
        <button
          onClick={startSession}
          className="w-full py-3 text-lg transition-all hover:opacity-90 flex items-center justify-center gap-2"
          style={{
            backgroundColor: theme.accent,
            color: theme.bg,
          }}
        >
          [ START SESSION ]
          <span className="animate-blink">▊</span>
        </button>
      </div>
    </div>
  )
}
