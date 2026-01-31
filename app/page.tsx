'use client'

import { UnfocusProvider, useUnfocus } from '@/lib/unfocus-context'
import { SetupScreen } from '@/components/setup-screen'
import { AmbientScreen } from '@/components/ambient-screen'
import { BreakScreen } from '@/components/break-screen'
import { SummaryScreen } from '@/components/summary-screen'

function UnfocusApp() {
  const { screen } = useUnfocus()

  switch (screen) {
    case 'setup':
      return <SetupScreen />
    case 'ambient':
      return <AmbientScreen />
    case 'break':
      return <BreakScreen />
    case 'summary':
      return <SummaryScreen />
    default:
      return <SetupScreen />
  }
}

export default function Page() {
  return (
    <UnfocusProvider>
      <UnfocusApp />
    </UnfocusProvider>
  )
}
