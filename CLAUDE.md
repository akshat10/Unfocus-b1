# CLAUDE.md - Unfocus Terminal Break App

## Overview

Unfocus is a terminal-themed break reminder app built with Next.js 16 and React 19. It helps developers take regular breaks with ASCII art animations and a retro terminal aesthetic.

## Build & Development Commands

```bash
npm run dev      # Start development server (default: localhost:3000)
npm run build    # Production build
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

### Tech Stack
- **Framework**: Next.js 16 with App Router
- **React**: Version 19 with hooks
- **Styling**: Tailwind CSS v4 with CSS variables
- **Font**: JetBrains Mono (monospace throughout)
- **State**: React Context API (UnfocusProvider)
- **Storage**: localStorage for persistence

### Key Directories

```
app/
├── layout.tsx          # Root layout, font loading, providers
├── page.tsx            # Main app, screen routing logic
├── globals.css         # Global styles, Tailwind config
lib/
├── unfocus-context.tsx # Central state management, all app logic
├── themes.ts           # 8 color themes (Dracula, Nord, Gruvbox, etc.)
├── break-data.ts       # Break type definitions and content
├── utils.ts            # Helper utilities
components/
├── terminal-window.tsx # Main window chrome, title bar, footer
├── terminal-input.tsx  # Command input with /commands support
├── boot-sequence.tsx   # Startup animation sequence
├── quick-start.tsx     # Timer selection onboarding
├── setup-screen.tsx    # Full settings panel (/settings)
├── ambient-screen.tsx  # Main countdown display
├── break-screen.tsx    # Break activity display
├── ascii-animations.tsx # ASCII art frames and headers
├── summary-screen.tsx  # Session end summary
```

### Screen Flow

```
boot → setup → ambient ↔ break → summary
         ↑                         |
         └─────────────────────────┘
```

- **boot**: Terminal boot sequence animation
- **setup**: Quick timer selection (first run) or settings panel
- **ambient**: Main countdown timer, waiting for next break
- **break**: Active break with ASCII animation and instructions
- **summary**: Session statistics after ending

### State Management

All state lives in `lib/unfocus-context.tsx` via `UnfocusProvider`:

```typescript
// Key state
screen: 'boot' | 'setup' | 'settings' | 'ambient' | 'break' | 'summary'
settings: { interval, breakTypes, theme, notifications, sounds }
currentBreak: { type, duration, noticing, invitation } | null
stats: { breaksTaken, breaksSkipped, totalBreakTime }
```

Access via `useUnfocus()` hook in any component.

### Theming

8 built-in themes in `lib/themes.ts`:
- dracula, nord, gruvbox, monokai, solarized, tokyoNight, catppuccin, oneDark

Each theme provides: `bg`, `text`, `accent`, `muted`, `success`, `border`

### Break Types

6 break types in `lib/break-data.ts`:
- eyes, breath, posture, hands, hydration, window

Each has: duration, noticing prompt, invitation prompt, ASCII animation frames

## Code Conventions

### Styling
- All text uses JetBrains Mono (enforced in globals.css)
- Colors via theme object from context, not hardcoded
- Terminal aesthetic: borders, monospace, ASCII art
- ASCII art uses block characters (██╗) with explicit font styling

### Components
- All components are client components ('use client')
- Use `useUnfocus()` for state access
- Theme colors accessed via `theme.accent`, `theme.text`, etc.

### ASCII Art Rendering
```tsx
<pre
  className="text-[6px] sm:text-[8px] leading-none select-none"
  style={{
    color: theme.accent,
    fontFamily: '"JetBrains Mono", ui-monospace, monospace',
    letterSpacing: '0',  // Critical for alignment
  }}
>
  {asciiArt}
</pre>
```

## Demo Mode

Add `?demo=true` to URL for faster intervals (useful for testing):
- Shows "DEMO" badge in title bar
- 5-second break intervals instead of minutes

## Terminal Commands

Available via `/command` in the input field:
- `/help` - Show available commands
- `/start` - Start a session
- `/break` - Trigger immediate break
- `/end` - End current session
- `/settings` - Open settings panel
- `/theme <name>` - Change color theme
- `/clear` - Clear terminal
- `/eyes`, `/breath`, `/posture`, `/hands`, `/hydrate`, `/window` - Trigger specific break type

## Common Tasks

### Adding a New Theme
1. Add theme object to `lib/themes.ts`
2. Add to `themeNames` array
3. Theme automatically appears in settings

### Adding a New Break Type
1. Add type to `BreakType` union in `lib/unfocus-context.tsx`
2. Add break data in `lib/break-data.ts`
3. Add ASCII animation frames in `components/ascii-animations.tsx`
4. Add header ASCII art to `breakHeaders` object

### Adding a New Command
1. Edit `components/terminal-input.tsx`
2. Add to `commands` array
3. Add handler in `handleCommand` function

## Notes

- Notifications require browser permission (requested on session start)
- localStorage keys prefixed with app data
- No external API calls - fully client-side
- Responsive design with sm/md/lg breakpoints
