/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: {
          50: '#fff7fb',
          100: '#fff0f7',
          200: '#f8dfea',
          300: '#efbfd6',
          400: '#e694bf',
          500: '#d86aa4',
          600: '#c34e8c',
          700: '#9f3a71',
          800: '#7a2a56',
          900: '#561d3d',
          950: '#2e0f21'
        },
        primary: {
          50: '#fff0f7',
          100: '#ffd9ea',
          200: '#ffbad8',
          300: '#ff8fc0',
          400: '#f96fa8',
          500: '#ec4f97',
          600: '#d33683',
          700: '#ad2e6d',
          800: '#862555',
          900: '#661c42',
          950: '#3a0f25'
        },
        accent: {
          50: '#f5f2ff',
          100: '#ece5ff',
          200: '#d7cbff',
          300: '#bea8ff',
          400: '#a17df8',
          500: '#865cf1',
          600: '#6d42d3',
          700: '#5531a6',
          800: '#3d2678',
          900: '#26164b',
          950: '#140b27'
        },
        ink: {
          50: '#f7f6fa',
          100: '#ece7f3',
          200: '#d8cedf',
          300: '#b5a8be',
          400: '#8d8198',
          500: '#675d72',
          600: '#4f4659',
          700: '#372f41',
          800: '#241f2e',
          900: '#17121f',
          950: '#0f0b14'
        },
        dark: {
          50: '#f7f6fa',
          100: '#ece7f3',
          200: '#d8cedf',
          300: '#b5a8be',
          400: '#8d8198',
          500: '#675d72',
          600: '#4f4659',
          700: '#372f41',
          800: '#241f2e',
          900: '#17121f',
          950: '#0f0b14'
        }
      },
      fontFamily: {
        sans: [
          'Geist',
          'Satoshi',
          'Cabinet Grotesk',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'PingFang SC',
          'Hiragino Sans GB',
          'Microsoft YaHei',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass: '0 14px 40px rgba(17, 18, 31, 0.1)',
        'glass-sm': '0 8px 20px rgba(17, 18, 31, 0.07)',
        glow: '0 0 24px rgba(236, 79, 151, 0.22)',
        'glow-lg': '0 0 48px rgba(236, 79, 151, 0.34)',
        card: '0 1px 2px rgba(17, 18, 31, 0.05), 0 12px 30px rgba(17, 18, 31, 0.05)',
        'card-hover': '0 18px 42px rgba(17, 18, 31, 0.12)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.08)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(135deg, #ec4f97 0%, #d33683 52%, #6d42d3 100%)',
        'gradient-dark': 'linear-gradient(135deg, #17121f 0%, #0f0b14 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.04) 100%)',
        'mesh-gradient':
          'radial-gradient(at 18% 18%, rgba(236, 79, 151, 0.16) 0px, transparent 42%), radial-gradient(at 82% 8%, rgba(134, 92, 241, 0.1) 0px, transparent 38%), radial-gradient(at 0% 52%, rgba(255, 175, 210, 0.1) 0px, transparent 40%), radial-gradient(at 80% 78%, rgba(17, 18, 31, 0.07) 0px, transparent 36%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(236, 79, 151, 0.22)' },
          '100%': { boxShadow: '0 0 30px rgba(236, 79, 151, 0.34)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
