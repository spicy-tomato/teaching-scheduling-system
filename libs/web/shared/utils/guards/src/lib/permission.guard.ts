import { Injectable, OnDestroy } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { Teacher } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  keepLogin,
  reset,
  selectStatus,
  selectTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  filter,
  map,
  Observable,
  ReplaySubject,
  take,
  takeUntil,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard
  extends ReplaySubject<void>
  implements CanActivate, OnDestroy
{
  private teacher$: Observable<Nullable<Teacher>>;

  // CONSTRUCTOR 
  constructor(
    private readonly router: Router,
    appShellStore: Store<AppShellState>
  ) {
    super(1);

    appShellStore
      .select(selectStatus)
      .pipe(
        tap((status) => {
          if (status === 'unknown') {
            appShellStore.dispatch(reset());
            appShellStore.dispatch(keepLogin());
          }
        }),
        take(1)
      )
      .subscribe();

    this.teacher$ = appShellStore.select(selectTeacher).pipe(takeUntil(this));
  }

  // IMPLEMENTATION 
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.teacher$.pipe(
      ObservableHelper.filterNullish(),
      filter((x) => x.permissions.length > 0),
      map(({ permissions, idRole }) => {
        const acceptRoles = route.data['roles'] as number[] | undefined;
        const acceptPermissions = route.data['permissions'] as
          | number[]
          | undefined;

        if (!acceptRoles && !acceptPermissions) {
          return true;
        }

        if (
          (acceptRoles && acceptRoles.includes(idRole)) ||
          (acceptPermissions &&
            permissions.some((p) => acceptPermissions.includes(p)))
        ) {
          return true;
        }

        const redirect = route.data['redirect'] as string;
        void this.router.navigate([redirect ?? '/403']);

        return false;
      }),
      takeUntil(this)
    );
  }

  ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
