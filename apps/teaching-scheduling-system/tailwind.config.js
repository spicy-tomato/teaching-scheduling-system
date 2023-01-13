const { createGlobPatternsForDependencies } = require('@nrwl/angular/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {
      spacing: {
        '1/5': '20%',
        '1/10': '10%',
        '9/10': '90%',
        15: '3.75rem',
        18: '4.5rem',
        30: '7.5rem',
        34: '8.5rem',
        38: '9.5rem',
        'nav-h': '65px',
        'main-view-h': 'calc(100vh - 65px)',
        'main-view-h-md': 'calc(100vh - 79px)',
        'content-h': 'calc(100vh - 127px)' /* With breadcrumbs */,
        'sidebar-w': '240px',
        'main-view-w': 'calc(100vw - 240px)',
      },
      inset: {
        '1/5': '20%',
        '2/5': '40%',
        '4/5': '80%',
      },
      colors: {
        // UTC
        'utc-1': '#29166f',
        'utc-2': '#b7b3b2',
        'utc-3': '#f3d400',
        // Base
        'tui-base-01': 'var(--tui-base-01)',
        'tui-base-02': 'var(--tui-base-02)',
        'tui-base-03': 'var(--tui-base-03)',
        'tui-base-04': 'var(--tui-base-04)',
        'tui-base-09': 'var(--tui-base-09)',
        'tui-clear': 'var(--tui-clear)',
        'tui-primary': 'var(--tui-primary)',
        // Text
        'tui-text-01': 'var(--tui-text-01)',
        'tui-text-02': 'var(--tui-text-02)',
        'tui-text-positive': 'var(--tui-positive)',
        'tui-text-negative': 'var(--tui-negative)',
        'tui-text-link': 'var(--tui-link)',
        // Status
        'tui-success-fill': 'var(--tui-success-fill)',
        'tui-success-bg': 'var(--tui-success-bg)',
        'tui-success-bg-hover': 'var(--tui-success-bg-hover)',
        'tui-warning-fill': 'var(--tui-warning-fill)',
        'tui-warning-bg-hover': 'var(--tui-warning-bg-hover)',
        'tui-error-fill': 'var(--tui-error-fill)',
        'tui-error-bg': 'var(--tui-error-bg)',
        'tui-error-bg-hover': 'var(--tui-error-bg-hover)',
        'tui-neutral-fill': 'var(--tui-neutral-fill)',
      },
      borderRadius: {
        'tui-radius-xs': 'var(--tui-radius-xs)',
      },
      transitionDuration: {
        400: '400ms',
      },
      transitionTimingFunction: {
        ease: 'cubic-bezier(0.25,0.1,0.25,1.0)',
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.center-absolute': {
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
        },
        '.center-flex': {
          display: 'flex',
          'justify-content': 'center',
          'align-items': 'center',
        },
      });
    }),
  ],
};
