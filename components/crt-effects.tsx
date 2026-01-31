'use client'

import { useUnfocus } from '@/lib/unfocus-context'

export function CRTEffects() {
  return (
    <>
      {/* Subtle scanlines - very light */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(0, 0, 0, 0.03) 3px,
            rgba(0, 0, 0, 0.03) 4px
          )`,
        }}
      />

      {/* Subtle vignette */}
      <div
        className="fixed inset-0 pointer-events-none z-40"
        style={{
          background: `radial-gradient(
            ellipse at center,
            transparent 60%,
            rgba(0, 0, 0, 0.2) 100%
          )`,
        }}
      />
    </>
  )
}
