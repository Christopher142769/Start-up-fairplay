/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        fp: {
          canvas: '#f9fafb',
          brand: '#1b4332',
          brandHover: '#132a22',
          ink: '#111827',
          muted: '#6b7280',
          line: '#e5e7eb',
          card: '#ffffff',
        },
        vibe: {
          deep: '#1a0530',
          mid: '#4c0d6b',
          bright: '#9d2f9d',
          coral: '#FF4D6D',
          coralHover: '#e63e5c',
          cyan: '#22d3ee',
          lime: '#bef264',
          yellow: '#facc15',
          pink: '#f472b6',
        },
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)',
        cardLg: '0 4px 6px -1px rgb(0 0 0 / 0.06), 0 2px 4px -2px rgb(0 0 0 / 0.06)',
        coral: '0 12px 40px -8px rgba(255, 77, 109, 0.55)',
      },
      borderRadius: {
        ui: '10px',
        pill: '9999px',
      },
      keyframes: {
        'vibe-float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'vibe-ribbon': {
          '0%, 100%': { transform: 'rotate(-2deg) scale(1)' },
          '50%': { transform: 'rotate(2deg) scale(1.02)' },
        },
        'team-panel-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'vibe-float': 'vibe-float 5s ease-in-out infinite',
        'vibe-ribbon': 'vibe-ribbon 8s ease-in-out infinite',
        'team-panel-in': 'team-panel-in 0.28s ease-out both',
      },
    },
  },
  plugins: [],
};
