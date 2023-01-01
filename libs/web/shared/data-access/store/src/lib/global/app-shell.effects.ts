import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { BreadcrumbItem } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AccessTokenService,
  AppService,
  AuthService,
  CommonInfoService,
  GoogleService,
  TeacherService,
  UserService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import { catchError, filter, map, mergeMap, of, tap } from 'rxjs';
import * as ApiAction from './app-shell.api.actions';
import * as PageAction from './app-shell.page.actions';

@Injectable()
export class AppShellEffects {
  // EFFECTS
  readonly changeRouter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      map(({ payload }) => {
        const breadcrumbs = this.createBreadcrumbs(payload.routerState.root);
        return ApiAction.updateBreadcrumbs({ breadcrumbs });
      })
    );
  });

  readonly keepLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.keepLogin),
      mergeMap(() => {
        return this.userService.me().pipe(
          map(({ data }) => data),
          map((teacher) =>
            teacher
              ? ApiAction.autoLoginSuccessfully({ teacher })
              : ApiAction.autoLoginFailure()
          ),
          catchError(() => of(ApiAction.autoLoginFailure()))
        );
      })
    );
  });

  readonly logout$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(PageAction.logout),
        tap(() => {
          this.authService.logOut().subscribe();
          this.accessTokenService.clear();
          void this.router.navigate(['/login']);
        })
      );
    },
    { dispatch: false }
  );

  readonly autoLoginFailure$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(ApiAction.autoLoginFailure),
        mergeMap(() =>
          of({}).pipe(
            tap(() => {
              this.accessTokenService.clear();
              const path = this.location.path();
              this.appService.redirectToLogin(
                path.includes('login') ? undefined : path
              );
            })
          )
        )
      );
    },
    { dispatch: false }
  );

  readonly loadRooms$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      mergeMap(() => {
        return this.commonInfoService.getRooms().pipe(
          map((rooms) => ApiAction.loadRoomsSuccessfully({ rooms })),
          catchError(() => of(ApiAction.loadRoomsFailure()))
        );
      })
    );
  });

  readonly loadSchoolYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      mergeMap(() => {
        return this.commonInfoService
          .getCurrentTerm()
          .pipe(
            map((currentTerm) =>
              ApiAction.loadCurrentTermSuccessful({ currentTerm })
            )
          );
      })
    );
  });

  readonly loadAcademicYear$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      mergeMap(() => {
        return this.commonInfoService.getAcademicYear().pipe(
          map((academicYears) =>
            ApiAction.loadAcademicYearSuccessful({ academicYears })
          ),
          catchError(() => of(ApiAction.loadAcademicYearFailure()))
        );
      })
    );
  });

  readonly loadTeachersInDepartment$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      map(({ teacher }) => teacher.department?.id),
      ObservableHelper.filterNullish(),
      mergeMap((id) => {
        return this.teacherService.getByDepartment(id).pipe(
          map(({ data }) =>
            ApiAction.loadTeachersInDepartmentSuccessful({ teachers: data })
          ),
          catchError(() => of(ApiAction.loadTeachersInDepartmentFailure()))
        );
      })
    );
  });

  readonly loadGoogleCalendars = createEffect(() => {
    return this.actions$.pipe(
      ofType(ApiAction.autoLoginSuccessfully),
      filter(({ teacher }) => teacher.settings.googleCalendar),
      map(({ teacher }) => teacher.department?.id),
      ObservableHelper.filterNullish(),
      mergeMap((id) => {
        return this.googleService.getCalendarList(id).pipe(
          map(({ data }) =>
            ApiAction.loadGoogleCalendarSuccessful({ calendars: data })
          ),
          catchError(() => of(ApiAction.loadGoogleCalendarFailure()))
        );
      })
    );
  });

  // CONSTRUCTOR
  constructor(
    private readonly actions$: Actions,
    private readonly router: Router,
    private readonly location: Location,
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly commonInfoService: CommonInfoService,
    private readonly teacherService: TeacherService,
    private readonly googleService: GoogleService,
    private readonly accessTokenService: AccessTokenService
  ) {}

  // PRIVATE METHODS
  private createBreadcrumbs(
    route: ActivatedRouteSnapshot,
    url = '',
    breadcrumbs: BreadcrumbItem[] = []
  ): BreadcrumbItem[] {
    const children = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeUrl = child.url.map(({ path }) => path).join('/');

      if (routeUrl !== '') {
        url += `/${routeUrl}`;
      }

      const label = child.data['breadcrumb'] as string;
      const group = child.data['group'] as string | undefined;
      if (
        label &&
        (breadcrumbs.length === 0 ||
          label !== breadcrumbs[breadcrumbs.length - 1].label)
      ) {
        breadcrumbs.push({ label, url, group });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return [];
  }
}
