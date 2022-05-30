import { animate, style, transition, trigger } from '@angular/animations';

export const routerFade = trigger('routerFade', [
  transition('* => *', [
    style({ background: 'white' }),
    animate('500ms ease-in-out', style({ background: 'transparent' })),
  ]),
]);
