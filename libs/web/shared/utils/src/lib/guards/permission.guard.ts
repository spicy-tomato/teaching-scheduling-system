import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  AppShellState,
  keepLogin,
  reset,
  selectPermission,
  selectStatus,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard
  extends ReplaySubject<void>
  implements CanActivate, OnDestroy
{
  private permissions$: Observable<number[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    appShellStore: Store<AppShellState>
  ) {
    super(1);

    appShellStore
      .select(selectStatus)
      .pipe(
        tap((status) => {
          if (status !== EApiStatus.loading) {
            appShellStore.dispatch(reset());
            appShellStore.dispatch(keepLogin());
          }
        }),
        take(1)
      )
      .subscribe();

    this.permissions$ = appShellStore
      .select(selectPermission)
      .pipe(takeUntil(this));
  }

  /** IMPLEMENTATION */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.permissions$.pipe(
      filter((x) => x.length > 0),
      map((permissions) => {
        const acceptPermissions = route.data['permissions'] as number[];
        const canActivate =
          (!acceptPermissions ||
            permissions.some((p) => acceptPermissions.includes(p))) ??
          false;

        if (canActivate) {
          return true;
        }

        const redirect = route.data['redirect'] as string;
        void this.router.navigate([redirect ?? '/403']);

        return false;
      }),
      takeUntil(this)
    );
  }

  public ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
