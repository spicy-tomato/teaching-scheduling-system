import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UrlHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { ScheduleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as ApiAction from './teaching-dialog.api.actions';
import * as PageAction from './teaching-dialog.page.actions';

@Injectable()
export class TeachingDialogEffects {
  // EFFECTS 
  request$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingDialogRequest),
      mergeMap(({ body }) => {
        return this.scheduleService.requestChangeSchedule(body).pipe(
          map((response) => {
            const { newDate, newShift, newIdRoom } = body;
            return ApiAction.requestSuccessful({
              justRequestedSchedule: {
                id: response.data,
                newDate,
                newShift,
                newIdRoom,
                status: 200,
                intendTime: null,
                createdAt: new Date(),
              },
            });
          }),
          catchError(() => of(ApiAction.requestFailure()))
        );
      })
    );
  });

  requestIntend$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingDialogRequestIntend),
      mergeMap(({ body }) => {
        return this.scheduleService.requestIntendChangeSchedule(body).pipe(
          map((response) => {
            const { intendTime } = body;
            return ApiAction.requestSuccessful({
              justRequestedSchedule: {
                id: response.data,
                createdAt: new Date(),
                intendTime,
                status: 201,
                newDate: null,
                newShift: null,
                newIdRoom: null,
              },
            });
          }),
          catchError(() => of(ApiAction.requestFailure()))
        );
      })
    );
  });

  change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingDialogChange),
      mergeMap(({ body }) => {
        return this.scheduleService.changeSchedule(body).pipe(
          map(() => {
            return ApiAction.changeSuccessful();
          }),
          catchError(() => of(ApiAction.requestFailure()))
        );
      })
    );
  });

  update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingDialogUpdate),
      mergeMap(({ id, body }) => {
        return this.scheduleService.updateStudyNote(id, body).pipe(
          map(() => {
            const { note } = body;
            return ApiAction.updateSuccessful({
              change: { note },
            });
          }),
          catchError(() => of(ApiAction.updateFailure()))
        );
      })
    );
  });

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingDialogSearch),
      mergeMap(({ params, teacherId }) => {
        return this.scheduleService
          .getSchedule(
            teacherId,
            UrlHelper.queryFilter(params, {
              date: 'between',
              shift: 'in',
            })
          )
          .pipe(
            map((response) =>
              ApiAction.searchSuccessful({ searchSchedule: response.data })
            ),
            catchError(() => of(ApiAction.searchFailure()))
          );
      })
    );
  });

  cancel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.teachingDialogCancel),
      mergeMap(({ id }) => {
        return this.scheduleService.cancelChangeScheduleRequests(id).pipe(
          map(() => ApiAction.cancelSuccessful()),
          catchError(() => of(ApiAction.cancelFailure()))
        );
      })
    );
  });

  // CONSTRUCTOR 
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService
  ) {}
}
