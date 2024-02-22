import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e4d91',
        danger: '#e6503f',
        secondary: '#edeef0',
        tertiary: '#f6f6f6',
        quaternary: '#eff2f7',
        content: '#333',
      },
    },
  },
  plugins: [],
}
export default config
