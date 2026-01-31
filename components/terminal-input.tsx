'use client'

import { useState, useRef, useEffect } from 'react'
import { useUnfocus } from '@/lib/unfocus-context'

const COMMANDS: Record<string, { description: string; action: string }> = {
  '/help': { description: 'show available commands', action: 'help' },
  '/start': { description: 'start a new session', action: 'start' },
  '/break': { description: 'trigger a break now', action: 'break' },
  '/end': { description: 'end current session', action: 'end' },
  '/settings': { description: 'open settings panel', action: 'settings' },
  '/theme': { description: 'cycle through themes', action: 'theme' },
  '/clear': { description: 'clear terminal output', action: 'clear' },
  '/eyes': { description: 'start eye break', action: 'eyes' },
  '/breath': { description: 'start breathing break', action: 'breath' },
  '/posture': { description: 'start posture check', action: 'posture' },
  '/hands': { description: 'start hand stretch', action: 'hands' },
  '/hydrate': { description: 'start hydration break', action: 'hydrate' },
  '/window': { description: 'start window break', action: 'window' },
}

interface HistoryLine {
  type: 'input' | 'output' | 'error' | 'system'
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
  const inputRef = useRef<HTMLInputElement>(null)
  const historyRef = useRef<HTMLDivElement>(null)

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

  const addOutput = (text: string, type: 'output' | 'error' | 'system' = 'output') => {
    setHistory(prev => [...prev, { type, text }])
  }

  const executeCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    if (!trimmed) return

    // Add to history
    setHistory(prev => [...prev, { type: 'input', text: `> ${cmd}` }])
    setCommandHistory(prev => [...prev, cmd])
    setHistoryIndex(-1)

    // Normalize command (add / if missing for known commands)
    let command = trimmed
    if (!command.startsWith('/') && COMMANDS[`/${command}`]) {
      command = `/${command}`
    }

    const [cmdName, ...args] = command.split(' ')

    // Get available themes for cycling
    const themeIds = ['dracula', 'nord', 'gruvbox', 'tokyoNight', 'catppuccin', 'synthwave', 'greenTerminal', 'amber']

    switch (cmdName) {
      case '/help':
      case 'help':
        addOutput('')
        addOutput('UNFOCUS COMMANDS', 'system')
        addOutput('────────────────────────────────────')
        Object.entries(COMMANDS).forEach(([cmd, { description }]) => {
          addOutput(`  ${cmd.padEnd(12)} ${description}`)
        })
        addOutput('')
        addOutput('tip: commands work with or without /')
        break

      case '/start':
      case 'start':
        if (screen === 'setup' || screen === 'summary') {
          addOutput('initializing session...', 'system')
          setTimeout(() => startSession(), 300)
        } else {
          addOutput('session already active', 'error')
        }
        break

      case '/break':
      case 'break':
        if (screen === 'ambient') {
          addOutput('triggering break...', 'system')
          setTimeout(() => triggerBreak(), 300)
        } else {
          addOutput('no active session', 'error')
        }
        break

      case '/end':
      case 'end':
        if (screen === 'ambient' || screen === 'break') {
          addOutput('ending session...', 'system')
          setTimeout(() => endSession(), 300)
        } else {
          addOutput('no active session', 'error')
        }
        break

      case '/settings':
      case 'settings':
      case 'config':
        addOutput('opening settings...', 'system')
        setTimeout(() => setScreen('settings'), 300)
        break

      case '/theme':
      case 'theme':
        const currentIndex = themeIds.indexOf(settings.themeId)
        const nextIndex = (currentIndex + 1) % themeIds.length
        const nextTheme = themeIds[nextIndex]
        updateSettings({ themeId: nextTheme })
        addOutput(`theme: ${nextTheme}`, 'system')
        break

      case '/clear':
      case 'clear':
        setHistory([])
        break

      case '/eyes':
      case 'eyes':
      case '/breath':
      case 'breath':
      case '/posture':
      case 'posture':
      case '/hands':
      case 'hands':
      case '/window':
      case 'window':
        const breakType = cmdName.replace('/', '')
        if (screen === 'ambient') {
          addOutput(`starting ${breakType} break...`, 'system')
          setTimeout(() => triggerSpecificBreak(breakType as any), 300)
        } else {
          addOutput('start a session first with /start', 'error')
        }
        break

      case '/hydrate':
      case 'hydrate':
        if (screen === 'ambient') {
          addOutput('starting hydration break...', 'system')
          setTimeout(() => triggerSpecificBreak('hydration'), 300)
        } else {
          addOutput('start a session first with /start', 'error')
        }
        break

      case 'sudo':
        addOutput('nice try, hacker.', 'error')
        break

      case 'exit':
      case 'quit':
        addOutput('you cannot escape. take a break instead.')
        break

      case 'ls':
        addOutput('breaks/  config/  stats/  README.md')
        break

      case 'pwd':
        addOutput('/home/human/unfocus')
        break

      case 'whoami':
        addOutput('someone who needs to touch grass')
        break

      case 'neofetch':
        addOutput('')
        addOutput('       ▄▄▄▄▄▄▄      user@unfocus')
        addOutput('      ▐░░░░░░░▌     ─────────────')
        addOutput('      ▐░▄▄▄░░░▌     OS: unfocus v1.0.0')
        addOutput('      ▐░░░░░░░▌     Shell: /bin/rest')
        addOutput('      ▐░░░░░░░▌     Theme: ' + settings.themeId)
        addOutput('       ▀▀▀▀▀▀▀      Mission: touch grass')
        addOutput('')
        break

      case 'cat':
        if (args[0] === 'README.md') {
          addOutput('')
          addOutput('# unfocus')
          addOutput('')
          addOutput('a terminal for humans who forget to rest.')
          addOutput('')
          addOutput('## usage')
          addOutput('  /start    begin a focus session')
          addOutput('  /break    take a break now')
          addOutput('  /end      end session')
          addOutput('')
        } else {
          addOutput(`cat: ${args[0] || 'missing file'}: No such file`, 'error')
        }
        break

      default:
        if (cmdName.startsWith('/')) {
          addOutput(`unknown command: ${cmdName}`, 'error')
        } else {
          addOutput(`command not found: ${cmdName}`, 'error')
        }
        addOutput('type /help for available commands')
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
      const searchTerm = input.startsWith('/') ? input : `/${input}`
      const matches = Object.keys(COMMANDS).filter(cmd => cmd.startsWith(searchTerm.toLowerCase()))
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
      className="border-t cursor-text font-mono"
      style={{ borderColor: `${theme.muted}40` }}
      onClick={handleContainerClick}
    >
      {/* History */}
      {history.length > 0 && (
        <div
          ref={historyRef}
          className="max-h-40 overflow-y-auto px-4 py-3 text-sm space-y-1"
          style={{ backgroundColor: `${theme.bg}90` }}
        >
          {history.map((line, i) => (
            <div
              key={i}
              className="font-mono"
              style={{
                color: line.type === 'error' ? '#ff5555' :
                       line.type === 'input' ? theme.accent :
                       line.type === 'system' ? theme.success :
                       theme.text,
                opacity: line.type === 'output' ? 0.8 : 1,
              }}
            >
              {line.text}
            </div>
          ))}
        </div>
      )}

      {/* Input line */}
      <div
        className="flex items-center px-4 py-3 text-sm font-mono"
        style={{ backgroundColor: `${theme.bg}` }}
      >
        <span style={{ color: theme.success }} className="mr-2 font-bold">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="type a command..."
          className="flex-1 bg-transparent outline-none font-mono placeholder:opacity-30"
          style={{ color: theme.text }}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
        />
      </div>
    </div>
  )
}
