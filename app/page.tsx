'use client'

import { UnfocusProvider, useUnfocus } from '@/lib/unfocus-context'
import { TerminalWindow } from '@/components/terminal-window'
import { BootSequence } from '@/components/boot-sequence'
import { SetupScreen } from '@/components/setup-screen'
import { AmbientScreen } from '@/components/ambient-screen'
import { BreakScreen } from '@/components/break-screen'
import { SummaryScreen } from '@/components/summary-screen'

function UnfocusApp() {
  const { screen, completeBoot, isDemo } = useUnfocus()

  // Boot sequence
  if (screen === 'boot') {
    return (
      <TerminalWindow title="unfocus — booting" showInput={false}>
        <BootSequence onComplete={completeBoot} />
      </TerminalWindow>
    )
  }

  // Get title based on screen
  const getTitle = () => {
    switch (screen) {
      case 'setup': return 'unfocus — config'
      case 'ambient': return 'unfocus — active'
      case 'break': return 'unfocus — break'
      case 'summary': return 'unfocus — complete'
      default: return 'unfocus'
    }
  }

  return (
    <TerminalWindow title={getTitle()}>
      {isDemo && screen === 'setup' && (
        <div className="px-4 py-2 text-xs text-center" style={{ backgroundColor: '#ffb00020', color: '#ffb000' }}>
          DEMO MODE: Breaks trigger every 10 seconds
        </div>
      )}
      {screen === 'setup' && <SetupScreen />}
      {screen === 'ambient' && <AmbientScreen />}
      {screen === 'break' && <BreakScreen />}
      {screen === 'summary' && <SummaryScreen />}
    </TerminalWindow>
  )
}

export default function Page() {
  return (
    <UnfocusProvider>
      <UnfocusApp />
    </UnfocusProvider>
  )
}
