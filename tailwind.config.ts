import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#090b10',
        card: '#11141e',
        'card-hover': '#161a29',
        border: '#1f2438',
        'border-light': '#2a324b',
        primary: {
          cyan: '#00f2fe',
          magenta: '#fe2c55',
          purple: '#7928ca',
        },
        accent: {
          cyan: '#00f2fe',
          magenta: '#fe2c55',
        },
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0, 242, 254, 0.15), rgba(254, 44, 85, 0.1) 70%, transparent)',
        'cyan-magenta': 'linear-gradient(135deg, #00f2fe 0%, #fe2c55 100%)',
        'glow-radial': 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(254, 44, 85, 0.08) 50%, transparent 70%)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};

export default config;
