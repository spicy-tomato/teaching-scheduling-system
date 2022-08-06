import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, Subject } from 'rxjs';

export type SidebarField = 'calendar.study' | 'calendar.exam' | `calendar.@${string}`;
type SidebarStateEvent = {
  name: SidebarField;
  value: boolean;
};
type SidebarEvent =
  | SidebarStateEvent
  | {
      name: 'calendar.create';
      value: SidebarField[];
    };

export type SidebarEventName = SidebarEvent['name'];
type ExtractValue<T extends SidebarEventName> = {
  [K in SidebarEvent as K['name']]: K['name'] extends T ? K['value'] : never;
}[T];

@Injectable()
export class SidebarService {
  /** PROPERTIES */
  private readonly _event$ = new Subject<SidebarEvent>();
  public readonly event$ = this._event$.asObservable();
  public readonly state$ = new BehaviorSubject<Record<SidebarField, boolean>>(
    {} as Record<SidebarField, boolean>
  );

  /** PUBLIC METHODS */
  public emit(data: SidebarEvent): void {
    const state = this.state$.value;
    if (data.name === 'calendar.create') {
      (data.value as SidebarField[]).forEach((field) => {
        state[field] = true;
      });
    } else {
      state[data.name] = data.value;
    }
    this.state$.next(state);
    this._event$.next(data);
  }

  public listen<T extends SidebarEventName>(
    name: T
  ): Observable<ExtractValue<T>> {
    return this.event$.pipe(
      filter((x) => x.name === name),
      map((x) => x.value as ExtractValue<T>)
    );
  }
}
