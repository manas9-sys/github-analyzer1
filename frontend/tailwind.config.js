/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        github: {
          darkest: '#090d13',
          darker: '#0d1117',
          dark: '#161b22',
          card: '#1c2128',
          border: '#30363d',
          borderLight: '#484f58',
          textMuted: '#8b949e',
          textPrimary: '#e6edf3',
          accent: '#58a6ff',
          accentHover: '#79c0ff',
          green: '#238636',
          greenHover: '#2ea043',
          greenText: '#3fb950',
          purple: '#8957e5',
          purpleLight: '#bc8cff',
          orange: '#d29922',
          orangeLight: '#e3b341',
          red: '#f85149'
        }
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"JetBrains Mono"',
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'monospace'
        ]
      },
      boxShadow: {
        'glow-accent': '0 0 25px -5px rgba(88, 166, 255, 0.15)',
        'glow-purple': '0 0 25px -5px rgba(163, 113, 247, 0.15)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)'
      }
    },
  },
  plugins: [],
}
