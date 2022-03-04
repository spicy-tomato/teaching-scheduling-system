import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { filter, map, take, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@modules/core/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard extends BaseComponent implements CanActivate {
  private permissions$: Observable<number[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(
        tap((teacher) => {
          if (teacher === null) {
            appShellStore.dispatch(fromAppShell.reset({ fromGuard: true }));
            appShellStore.dispatch(fromAppShell.keepLogin());
          }
        }),
        take(1)
      )
      .subscribe();

    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));
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
      takeUntil(this.destroy$)
    );
  }
}
