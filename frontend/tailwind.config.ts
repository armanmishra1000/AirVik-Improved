import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        text: 'var(--color-text)',
        muted: 'var(--color-muted)',
        neutral: 'var(--color-neutral)',
        'gray-bg': 'var(--color-gray-bg)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
      },
      spacing: {
        DEFAULT: 'var(--space)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
export default config
