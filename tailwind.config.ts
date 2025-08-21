import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          primary: 'var(--color-accent-primary)',
          secondary: 'var(--color-accent-secondary)'
        },
        support: {
          1: 'var(--color-support-1)',
          2: 'var(--color-support-2)',
          3: 'var(--color-support-3)'
        }
      },
      borderRadius: {
        xl: '16px',
        '2xl': '24px'
      },
      boxShadow: {
        soft: '0 4px 16px rgba(0,0,0,0.06)'
      }
    }
  },
  plugins: [],
} satisfies Config;

