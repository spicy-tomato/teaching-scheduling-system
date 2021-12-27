import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { filter, map, takeUntil } from 'rxjs/operators';
import { BaseComponent } from '@modules/core/base/base.component';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard extends BaseComponent implements CanActivate {
  private permissions$: Observable<number[] | undefined>;

  /** CONSTRUCTOR */
  constructor(
    private readonly router: Router,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    appShellStore.dispatch(fromAppShell.tryAutoLogin());

    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));
  }

  /** IMPLEMENTATION */
  public canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.permissions$.pipe(
      filter((x) => !!x),
      map((permissions) => {
        const acceptPermissions = route.data?.['permissions'] as number[];
        const canActivate =
          (!acceptPermissions ||
            permissions?.some((p) => acceptPermissions.includes(p))) ??
          false;

        if (!canActivate) {
          void this.router.navigate(['/403']);
        }

        return canActivate;
      })
    );
  }
}
