import { Injectable, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  AppShellState,
  selectBreadcrumbs,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable()
export class NavbarService {
  /** PROPERTIES */
  private readonly _rightMenu$ = new BehaviorSubject<
    Nullable<TemplateRef<never>>
  >(null);
  public readonly rightMenu$ = this._rightMenu$.asObservable();

  /** CONSTRUCTOR */
  constructor(appShellStore: Store<AppShellState>) {
    appShellStore
      .select(selectBreadcrumbs)
      .pipe(tap(() => this.addRightMenu(null)))
      .subscribe();
  }

  /** PUBLIC METHODS */
  public addRightMenu(data: Nullable<TemplateRef<never>>): void {
    this._rightMenu$.next(data);
  }
}
