'use client'

import { useEffect, useState } from 'react'
import { type BreakType } from '@/lib/unfocus-context'

// Frame-based ASCII animations for each break type
const animations: Record<BreakType, string[]> = {
  hydration: [
    `
     .---.
     |   |
     |   |
     |   |
     |   |
     '---'
    EMPTY
    `,
    `
     .---.
     |   |
     |   |
     |   |
     |...|
     '---'
    POUR
    `,
    `
     .---.
     |   |
     |   |
     |~~~|
     |###|
     '---'
   FILLING
    `,
    `
     .---.
     |   |
     |~~~|
     |###|
     |###|
     '---'
   FILLING
    `,
    `
     .---.
     |~~~|
     |###|
     |###|
     |###|
     '---'
    FULL!
    `,
    `
     .---.
     |~~~|
     |###|
     |###|
     |###|
     '---'
    DRINK
    `,
  ],
  breath: [
    `
      .-.
     (   )
      '-'

   BREATHE IN
    `,
    `
     .---.
    (     )
     '---'

   BREATHE IN
    `,
    `
    .-----.
   (       )
    '-----'

   BREATHE IN
    `,
    `
   .-------.
  (         )
   '-------'

      HOLD
    `,
    `
   .-------.
  (         )
   '-------'

      HOLD
    `,
    `
    .-----.
   (       )
    '-----'

  BREATHE OUT
    `,
    `
     .---.
    (     )
     '---'

  BREATHE OUT
    `,
    `
      .-.
     (   )
      '-'

  BREATHE OUT
    `,
  ],
  eyes: [
    `
    .--. .--.
   | O | | O |
    '--' '--'
   LOOK CENTER
    `,
    `
    .--. .--.
   |O  | |O  |
    '--' '--'
    LOOK LEFT
    `,
    `
    .--. .--.
   | O | | O |
    '--' '--'
   LOOK CENTER
    `,
    `
    .--. .--.
   |  O| |  O|
    '--' '--'
   LOOK RIGHT
    `,
    `
    .--. .--.
   | O | | O |
    '--' '--'
   LOOK CENTER
    `,
    `
    .--. .--.
   | o | | o |
    '--' '--'
     LOOK UP
    `,
    `
    .--. .--.
   | O | | O |
    '--' '--'
   LOOK CENTER
    `,
    `
    .--. .--.
   | . | | . |
    '--' '--'
    LOOK DOWN
    `,
    `
    .--. .--.
   | - | | - |
    '--' '--'
   CLOSE EYES
    `,
  ],
  posture: [
    `
       o
      /|
     / |
    /  |
   BAD POSTURE
    `,
    `
       o
      /|
     / |
       |
   ADJUSTING
    `,
    `
       o
      /|\\
       |
      / \\
    SIT TALL
    `,
    `
       O
      -|-
       |
      / \\
  SHOULDERS
     BACK
    `,
    `
     \\ | /
       O
      -|-
       |
      / \\
   CROWN UP
    `,
  ],
  hands: [
    `
      ___
     |   |
     |   |
     |___|
   MAKE FIST
    `,
    `
      \\|/
       |
      /|\\
     SPREAD
    `,
    `
     \\   /
      \\ /
       |
      / \\
     /   \\
    STRETCH
    `,
    `
     \\   /
      \\ /
       |
      / \\
     /   \\
      HOLD
    `,
    `
       _
      | |
      | |
      |_|
     RELAX
    `,
  ],
  window: [
    `
   +-------+
   |       |
   |  ___  |
   | /   \\ |
   +-------+
  LOOK OUTSIDE
    `,
    `
   +-------+
   |   *   |
   |  ___  |
   | /   \\ |
   +-------+
  NOTICE SKY
    `,
    `
   +-------+
   | * ~ * |
   |  ___  |
   | /   \\ |
   +-------+
 NOTICE CLOUDS
    `,
    `
   +-------+
   |~ * ~ *|
   |  ___  |
   | /   \\ |
   +-------+
 NOTICE MOTION
    `,
    `
   +-------+
   |*~*~*~*|
   | ~___~ |
   |~/   \\~|
   +-------+
 BREATHE IT IN
    `,
  ],
}

interface AsciiAnimationProps {
  type: BreakType
  progress: number // 0 to 1
  className?: string
  style?: React.CSSProperties
}

export function AsciiAnimation({ type, progress, className = '', style }: AsciiAnimationProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const frames = animations[type]

  // For breath, loop continuously
  useEffect(() => {
    if (type === 'breath') {
      const interval = setInterval(() => {
        setFrameIndex(prev => (prev + 1) % frames.length)
      }, 1200)
      return () => clearInterval(interval)
    }
  }, [type, frames.length])

  // For other types, advance based on progress
  useEffect(() => {
    if (type !== 'breath') {
      const targetFrame = Math.min(
        Math.floor(progress * frames.length),
        frames.length - 1
      )
      setFrameIndex(targetFrame)
    }
  }, [progress, frames.length, type])

  return (
    <pre className={`font-mono whitespace-pre text-center ${className}`} style={style}>
      {frames[frameIndex]}
    </pre>
  )
}

// Static ASCII art headers - simple style for reliable rendering
export const breakHeaders: Record<BreakType, string> = {
  eyes: `
 _____ _ _ _____ _____
|  ___| | | |  ___|  ___|
| |__ | |_| | |__ | |__
|  __||_   _|  __||__  |
| |___  | | | |___ ___| |
|_____|_| |_|_____|_____|`,
  breath: `
 ____  ____  _____ ____  _____ _   _
| __ )|  _ \\| ____| __ ||_   _| | | |
|  _ \\| |_) |  _| / _  |  | | | |_| |
| |_) |  _ <| |__| (_| |  | | |  _  |
|____/|_| \\_|_____\\__,_|  |_| |_| |_|`,
  posture: `
 ____   ___  ____ _____ _   _ ____  _____
|  _ \\ / _ \\/ ___|_   _| | | |  _ \\| ____|
| |_) | | | \\___ \\ | | | | | | |_) |  _|
|  __/| |_| |___) || | | |_| |  _ <| |___
|_|    \\___/|____/ |_|  \\___/|_| \\_|_____|`,
  hands: `
 _   _    _    _   _ ____  ____
| | | |  / \\  | \\ | |  _ \\/ ___|
| |_| | / _ \\ |  \\| | | | \\___ \\
|  _  |/ ___ \\| |\\  | |_| |___) |
|_| |_/_/   \\_|_| \\_|____/|____/`,
  hydration: `
 _   ___   ______  ____      _  _____ _____
| | | \\ \\ / /  _ \\|  _ \\    / \\|_   _| ____|
| |_| |\\ V /| | | | |_) |  / _ \\ | | |  _|
|  _  | | | | |_| |  _ <  / ___ \\| | | |___
|_| |_| |_| |____/|_| \\_\\/_/   \\_|_| |_____|`,
  window: `
__        _____ _   _ ____   _____        __
\\ \\      / /_ _| \\ | |  _ \\ / _ \\ \\      / /
 \\ \\ /\\ / / | ||  \\| | | | | | | \\ \\ /\\ / /
  \\ V  V /  | || |\\  | |_| | |_| |\\ V  V /
   \\_/\\_/  |___|_| \\_|____/ \\___/  \\_/\\_/`,
}
