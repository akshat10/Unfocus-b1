'use client'

import { useState, useRef, useEffect } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

const COMMANDS: Record<string, { description: string; action: string }> = {
  'help': { description: 'show available commands', action: 'help' },
  'start': { description: 'start a new session', action: 'start' },
  'break': { description: 'trigger a break now', action: 'break' },
  'end': { description: 'end current session', action: 'end' },
  'config': { description: 'open settings', action: 'config' },
  'theme': { description: 'cycle through themes', action: 'theme' },
  'clear': { description: 'clear terminal history', action: 'clear' },
  'eyes': { description: 'eye break', action: 'eyes' },
  'breath': { description: 'breathing break', action: 'breath' },
  'posture': { description: 'posture check', action: 'posture' },
  'hands': { description: 'hand stretch', action: 'hands' },
  'hydrate': { description: 'hydration reminder', action: 'hydrate' },
  'window': { description: 'look outside', action: 'window' },
}

interface HistoryLine {
  type: 'input' | 'output' | 'error'
  text: string
}

export function TerminalInput() {
  const {
    theme,
    screen,
    startSession,
    endSession,
    triggerBreak,
    triggerSpecificBreak,
    setScreen,
    settings,
    updateSettings,
  } = useUnfocus()

  const [input, setInput] = useState('')
  const [history, setHistory] = useState<HistoryLine[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [cursorVisible, setCursorVisible] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setCursorVisible(prev => !prev)
    }, 530)
    return () => clearInterval(interval)
  }, [])

  // Auto-scroll history
  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight
    }
  }, [history])

  // Focus input on click anywhere
  const handleContainerClick = () => {
    inputRef.current?.focus()
  }

  const addOutput = (text: string, type: 'output' | 'error' = 'output') => {
    setHistory(prev => [...prev, { type, text }])
  }

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    // Add to history
    setHistory(prev => [...prev, { type: 'input', text: `$ ${cmd}` }])
    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)

    const [command, ...args] = trimmed.split(' ')

    // Get available themes for cycling
    const themeIds = ['dracula', 'nord', 'gruvbox', 'tokyoNight', 'catppuccin', 'synthwave', 'greenTerminal', 'amber']

    switch (command) {
      case 'help':
        addOutput('┌─────────────────────────────────────┐')
        addOutput('│         AVAILABLE COMMANDS          │')
        addOutput('├─────────────────────────────────────┤')
        Object.entries(COMMANDS).forEach(([cmd, { description }]) => {
          addOutput(`│  ${cmd.padEnd(10)} ${description.padEnd(23)}│`)
        })
        addOutput('└─────────────────────────────────────┘')
        break

      case 'start':
        if (screen === 'setup' || screen === 'summary') {
          addOutput('> initializing session...')
          setTimeout(() => startSession(), 300)
        } else {
          addOutput('session already active', 'error')
        }
        break

      case 'break':
        if (screen === 'ambient') {
          addOutput('> triggering break...')
          setTimeout(() => triggerBreak(), 300)
        } else {
          addOutput('no active session', 'error')
        }
        break

      case 'end':
        if (screen === 'ambient' || screen === 'break') {
          addOutput('> ending session...')
          setTimeout(() => endSession(), 300)
        } else {
          addOutput('no active session', 'error')
        }
        break

      case 'config':
        addOutput('> opening config...')
        setTimeout(() => setScreen('setup'), 300)
        break

      case 'theme':
        const currentIndex = themeIds.indexOf(settings.themeId)
        const nextIndex = (currentIndex + 1) % themeIds.length
        const nextTheme = themeIds[nextIndex]
        updateSettings({ themeId: nextTheme })
        addOutput(`> theme set to ${nextTheme}`)
        break

      case 'clear':
        setHistory([])
        break

      case 'eyes':
      case 'breath':
      case 'posture':
      case 'hands':
      case 'window':
        if (screen === 'ambient') {
          addOutput(`> initiating ${command} break...`)
          setTimeout(() => triggerSpecificBreak(command as any), 300)
        } else {
          addOutput('start a session first', 'error')
        }
        break

      case 'hydrate':
        if (screen === 'ambient') {
          addOutput('> initiating hydration break...')
          setTimeout(() => triggerSpecificBreak('hydration'), 300)
        } else {
          addOutput('start a session first', 'error')
        }
        break

      case 'sudo':
        addOutput('nice try.', 'error')
        break

      case 'exit':
      case 'quit':
        addOutput('you cannot escape. take a break instead.')
        break

      case 'ls':
        addOutput('breaks/  config/  stats/  themes/')
        break

      case 'pwd':
        addOutput('/home/user/unfocus')
        break

      case 'whoami':
        addOutput('someone who needs a break')
        break

      case 'neofetch':
        addOutput('       ▄▄▄▄▄▄▄      user@unfocus')
        addOutput('      ▐░░░░░░░▌     ─────────────')
        addOutput('      ▐░▄▄▄░░░▌     OS: unfocus v1.0.0')
        addOutput('      ▐░░░░░░░▌     Shell: /bin/rest')
        addOutput('      ▐░░░░░░░▌     Theme: ' + settings.themeId)
        addOutput('       ▀▀▀▀▀▀▀      Uptime: taking breaks')
        break

      default:
        addOutput(`command not found: ${command}`, 'error')
        addOutput('type "help" for available commands')
    }

    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand(input)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '')
      } else {
        setHistoryIndex(-1)
        setInput('')
      }
    } else if (e.key === 'Tab') {
      e.preventDefault()
      // Auto-complete
      const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(input.toLowerCase()))
      if (matches.length === 1) {
        setInput(matches[0])
      } else if (matches.length > 1) {
        addOutput(matches.join('  '))
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault()
      setHistory([])
    }
  }

  return (
    <div
      className="border-t cursor-text"
      style={{ borderColor: theme.muted }}
      onClick={handleContainerClick}
    >
      {/* History */}
      {history.length > 0 && (
        <div
          ref={historyRef}
          className="max-h-32 overflow-y-auto px-3 py-2 text-xs space-y-0.5"
          style={{ backgroundColor: `${theme.bg}80` }}
        >
          {history.map((line, i) => (
            <div
              key={i}
              style={{
                color: line.type === 'error' ? '#ff5555' :
                       line.type === 'input' ? theme.accent :
                       theme.muted
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
      )}

      {/* Input line */}
      <div className="flex items-center px-3 py-2 text-sm">
        <span style={{ color: theme.success }} className="mr-2">$</span>
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent outline-none"
            style={{ color: theme.text, caretColor: 'transparent' }}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {/* Custom cursor */}
          <span
            className="absolute top-0 pointer-events-none"
            style={{
              left: `${input.length}ch`,
              color: cursorVisible ? theme.accent : 'transparent',
            }}
          >
            █
          </span>
        </div>
        <span className="text-xs ml-2" style={{ color: theme.muted }}>
          type "help"
        </span>
      </div>
    </div>
  )
}
