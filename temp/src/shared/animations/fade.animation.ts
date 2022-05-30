import { animate, style, transition, trigger } from '@angular/animations';

const defaultDuration = {
  duration: '500ms',
};

const fadeInTransition = transition(
  ':enter',
  [
    style({ opacity: 0 }),
    animate('{{duration}} ease-in-out', style({ opacity: 1 })),
  ],
  { params: defaultDuration }
);

const fadeOutTransition = transition(
  ':leave',
  [
    style({ opacity: 1 }),
    animate('{{duration}} ease-in-out', style({ opacity: 0 })),
  ],
  { params: defaultDuration }
);

export const fadeIn = trigger('fadeIn', [fadeInTransition]);

export const fadeOut = trigger('fadeOut', [fadeOutTransition]);

export const fadeInOut = trigger('fadeInOut', [
  fadeInTransition,
  fadeOutTransition,
]);
