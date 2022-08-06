import { Injectable, OnDestroy, TemplateRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  AppShellState,
  selectBreadcrumbs,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { BehaviorSubject, Subscription, tap } from 'rxjs';

@Injectable()
export class NavbarService implements OnDestroy {
  /** PROPERTIES */
  private readonly _rightMenu$ = new BehaviorSubject<
    Nullable<TemplateRef<never>>
  >(null);
  public readonly rightMenu$ = this._rightMenu$.asObservable();
  private readonly breadcrumbsSubscription: Subscription;

  /** CONSTRUCTOR */
  constructor(appShellStore: Store<AppShellState>) {
    this.breadcrumbsSubscription = appShellStore
      .select(selectBreadcrumbs)
      .pipe(tap(() => this.addRightMenu(null)))
      .subscribe();
  }

  /** LIFECYCLE */
  public ngOnDestroy(): void {
    this.breadcrumbsSubscription.unsubscribe();
  }

  /** PUBLIC METHODS */
  public addRightMenu(data: Nullable<TemplateRef<never>>): void {
    this._rightMenu$.next(data);
  }
}
