import {
  APP_BOOTSTRAP_LISTENER,
  Inject,
  InjectionToken,
  Provider,
} from '@angular/core';
import { EffectSources } from '@ngrx/effects';

const BOOTSTRAP_EFFECTS = new InjectionToken('Bootstrap Effects');

function bootstrapEffects(effects: [], sources: EffectSources) {
  return () => {
    effects.forEach((effect) => sources.addEffects(effect));
  };
}

function createInstances(...instances: []) {
  return instances;
}

export function provideBootstrapEffects(effects: unknown[]): Provider[] {
  return [
    effects,
    {
      provide: BOOTSTRAP_EFFECTS,
      useFactory: createInstances,
      deps: effects,
    },
    {
      provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: bootstrapEffects,
      deps: [[new Inject(BOOTSTRAP_EFFECTS)], EffectSources],
    },
  ];
}
