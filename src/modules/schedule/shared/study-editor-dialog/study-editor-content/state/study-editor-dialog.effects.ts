import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as PageAction from './study-editor-dialog.page.actions';
import * as ApiAction from './study-editor-dialog.api.actions';
import { ScheduleService } from '@services/schedule.service';
import { UrlHelper } from '@shared/helpers';

@Injectable()
export class StudyEditorDialogEffects {
  /** EFFECTS */
  public request$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.request),
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

  public requestIntend$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.requestIntend),
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

  public change$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.change),
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

  public update$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.update),
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

  public search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.search),
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

  public cancel$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PageAction.cancel),
      mergeMap(({ id }) => {
        return this.scheduleService.cancelChangeScheduleRequests(id).pipe(
          map(() => ApiAction.cancelSuccessful()),
          catchError(() => of(ApiAction.cancelFailure()))
        );
      })
    );
  });

  /** CONSTRUCTOR */
  constructor(
    private readonly actions$: Actions,
    private readonly scheduleService: ScheduleService
  ) {}
}
