import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { BreadcrumbItem } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AccessTokenService,
  AppService,
  CommonInfoService,
  TeacherService,
  UserService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import * as ApiAction from './app-shell.api.actions';
import * as PageAction from './app-shell.page.actions';

@Injectable()
export class AppShellEffects {
  /** EFFECTS */
  changeRouter$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(routerNavigatedAction),
      map((action) => {
        const breadcrumbs = this.createBreadcrumbs(
          action.payload.routerState.root
        );
        return ApiAction.updateBreadcrumbs({ breadcrumbs });
      })
    );
  });

  keepLogin$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.keepLogin),
      mergeMap(() => {
        return this.userService.me().pipe(
          map((response) => response.data),
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

  autoLoginFailure$ = createEffect(
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

  loadRooms$ = createEffect(() => {
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

  loadSchoolYear$ = createEffect(() => {
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

  loadAcademicYear$ = createEffect(() => {
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

  loadTeachersInDepartment$ = createEffect(() => {
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

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly commonInfoService: CommonInfoService,
    private readonly teacherService: TeacherService,
    private readonly accessTokenService: AccessTokenService,
    private readonly location: Location
  ) {}

  /** PRIVATE METHODS */
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
      const routeUrl = child.url.map((segment) => segment.path).join('/');

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
