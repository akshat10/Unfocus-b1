"use client"

import { useState } from 'react'
import { BreakProvider, useBreak } from '@/lib/break-context'
import { Dashboard } from '@/components/dashboard'
import { AmbientMode } from '@/components/ambient-mode'
import { SettingsPanel } from '@/components/settings-panel'

function AppContent() {
  const { isAmbientMode } = useBreak()
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <>
      {isAmbientMode ? (
        <AmbientMode />
      ) : (
        <Dashboard onOpenSettings={() => setSettingsOpen(true)} />
      )}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  )
}

export default function Home() {
  return (
    <BreakProvider>
      <AppContent />
    </BreakProvider>
  )
}
