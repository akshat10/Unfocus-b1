'use client'

import { UnfocusProvider, useUnfocus } from '@/lib/unfocus-context'
import { TerminalWindow } from '@/components/terminal-window'
import { BootSequence } from '@/components/boot-sequence'
import { QuickStart } from '@/components/quick-start'
import { SetupScreen } from '@/components/setup-screen'
import { AmbientScreen } from '@/components/ambient-screen'
import { BreakScreen } from '@/components/break-screen'
import { SummaryScreen } from '@/components/summary-screen'

function UnfocusApp() {
  const { screen, completeBoot } = useUnfocus()

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
      case 'setup': return 'unfocus — start'
      case 'settings': return 'unfocus — settings'
      case 'ambient': return 'unfocus — active'
      case 'break': return 'unfocus — break'
      case 'summary': return 'unfocus — complete'
      default: return 'unfocus'
    }
  }

  return (
    <TerminalWindow title={getTitle()}>
      {screen === 'setup' && <QuickStart />}
      {screen === 'settings' && <SetupScreen />}
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
