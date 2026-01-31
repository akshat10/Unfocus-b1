export interface Theme {
  id: string
  name: string
  bg: string
  text: string
  accent: string
  muted: string
  success: string
}

export interface Font {
  id: string
  name: string
  variable: string
  fallback: string
}

export const fonts: Record<string, Font> = {
  jetbrains: {
    id: 'jetbrains',
    name: 'JetBrains Mono',
    variable: 'var(--font-mono)',
    fallback: 'ui-monospace, monospace',
  },
  doto: {
    id: 'doto',
    name: 'Doto',
    variable: 'var(--font-doto)',
    fallback: 'ui-monospace, monospace',
  },
}

export const fontList = Object.values(fonts)

export const themes: Record<string, Theme> = {
  dracula: {
    id: 'dracula',
    name: 'Dracula',
    bg: '#282a36',
    text: '#f8f8f2',
    accent: '#bd93f9',
    muted: '#6272a4',
    success: '#50fa7b',
  },
  nord: {
    id: 'nord',
    name: 'Nord',
    bg: '#2e3440',
    text: '#eceff4',
    accent: '#88c0d0',
    muted: '#4c566a',
    success: '#a3be8c',
  },
  gruvbox: {
    id: 'gruvbox',
    name: 'Gruvbox',
    bg: '#282828',
    text: '#ebdbb2',
    accent: '#fe8019',
    muted: '#928374',
    success: '#b8bb26',
  },
  tokyoNight: {
    id: 'tokyoNight',
    name: 'Tokyo Night',
    bg: '#1a1b26',
    text: '#c0caf5',
    accent: '#7aa2f7',
    muted: '#565f89',
    success: '#9ece6a',
  },
  catppuccin: {
    id: 'catppuccin',
    name: 'Catppuccin',
    bg: '#1e1e2e',
    text: '#cdd6f4',
    accent: '#cba6f7',
    muted: '#6c7086',
    success: '#a6e3a1',
  },
  synthwave: {
    id: 'synthwave',
    name: 'Synthwave',
    bg: '#262335',
    text: '#ffffff',
    accent: '#ff7edb',
    muted: '#848bbd',
    success: '#72f1b8',
  },
  greenTerminal: {
    id: 'greenTerminal',
    name: 'Green',
    bg: '#0a0a0a',
    text: '#00ff00',
    accent: '#00ff00',
    muted: '#006600',
    success: '#00ff00',
  },
  amber: {
    id: 'amber',
    name: 'Amber',
    bg: '#0a0a0a',
    text: '#ffb000',
    accent: '#ffb000',
    muted: '#805800',
    success: '#ffb000',
  },
}

export const themeList = Object.values(themes)

export function applyTheme(theme: Theme) {
  const root = document.documentElement
  root.style.setProperty('--terminal-bg', theme.bg)
  root.style.setProperty('--terminal-text', theme.text)
  root.style.setProperty('--terminal-accent', theme.accent)
  root.style.setProperty('--terminal-muted', theme.muted)
  root.style.setProperty('--terminal-success', theme.success)
}

export function applyFont(font: Font) {
  const root = document.documentElement
  root.style.setProperty('--active-font', `${font.variable}, ${font.fallback}`)
}
