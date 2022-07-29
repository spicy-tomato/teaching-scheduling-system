import { Injectable } from '@angular/core';
import { filter, map, Observable, Subject } from 'rxjs';

type SidebarEvent =
  | {
      name: 'calendar.create';
      value: string[];
    }
  | {
      name: 'calendar.study';
      value: boolean;
    }
  | {
      name: 'calendar.exam';
      value: boolean;
    }
  | {
      name: `calendar.@${string}`;
      value: boolean;
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

  /** PUBLIC METHODS */
  public emit(data: SidebarEvent): void {
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
