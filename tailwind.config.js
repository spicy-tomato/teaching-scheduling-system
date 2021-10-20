const colors = require('tailwindcss/colors')

module.exports = {
  mode: 'jit',
  darkMode: false,
  purge: {
    enabled: process.env.NODE_ENV === 'production',
    content: [
      './src/**/*.{html,ts}',
    ]
  },
  corePlugins: {
    preflight: false
  },
  theme: {
    fontFamily: false,
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      white: '#ffffff',
      black: '#000000',
      tuiPositive: 'var(--tui-positive)',
      tuiWarningFill: 'var(--tui-warning-fill)',
      tuiWarningBg: 'var(--tui-warning-bg)',
      tuiWarningHover: 'var(--tui-warning-hover)',
      tuiBase01: 'var(--tui-base-01)',
      tuiBase02: 'var(--tui-base-02)',
      tuiBase03: 'var(--tui-base-03)',
      tuiBase04: 'var(--tui-base-04)',
      tuiBase05: 'var(--tui-base-05)',
      tuiBase06: 'var(--tui-base-06)',
      tuiBase07: 'var(--tui-base-07)',
      tuiBase08: 'var(--tui-base-08)',
      tuiBase09: 'var(--tui-base-09)',
      tuiText01: 'var(--tui-text-01)',
      tuiText02: 'var(--tui-text-02)',
    },
    extend: {
      width: {
        'fit-content': 'fit-content'
      },
      height: {
        'vh-10': '10vh',
        'vh-20': '20vh',
        'vh-30': '30vh',
        'vh-40': '40vh',
        'vh-50': '50vh',
        'vh-60': '60vh',
        'vh-70': '70vh',
        'vh-80': '80vh',
        'vh-90': '90vh',
      },
      fontSize: {
        '2xl': ['1.5rem', '2.4rem'],
        '3xl': ['1.875rem', '2.8rem'],
        'base-sm': 'calc(1rem - 1px)',
        'base-lg': 'calc(1rem + 1px)',
      },
      padding: {
        '1/12': '8.333%',
        '2/12': '16.667%',
        '3/12': '25%',
        '4/12': '33.333%',
        '5/12': '41.667%',
        '6/12': '50%',
        '7/12': '58.333%',
        '8/12': '66.667%',
        '9/12': '75%',
        '10/12': '83.333%',
        '11/12': '91.667%',
        '12/12': '100%',
        '1/6': '16.667%',
        '2/6': '33.333%',
        '3/6': '50%',
        '4/6': '66.667%',
        '5/6': '83.333%',
        '6/6': '100%',
        '1/3': '33.333%',
        '2/3': '66.667%',
        '3/3': '100%',
      },
      backgroundOpacity: {
        '15': '0.15',
        '35': '0.35',
        '45': '0.45',
        '55': '0.55',
        '65': '0.65',
        '85': '0.85',
      }
    }
  },
  extend: {
    transform: ['hover']
  },
  variants: {},
  plugins: [
    require('@tailwindcss/line-clamp')
  ]
}
