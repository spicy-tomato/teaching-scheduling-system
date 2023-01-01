import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { CalendarHelper } from '@teaching-scheduling-system/web/calendar/data-access';
import {
  DefaultGoogleCalendarEvent,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { GoogleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectGoogleCalendars,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { map, switchMap, takeUntil, tap, withLatestFrom } from 'rxjs';

type ExportDialogState = GenericState<void>;

@Injectable()
export class GoogleCalendarDialogStore extends ComponentStore<ExportDialogState> {
  // PRIVATE PROPERTIES
  private readonly teacher$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  // PUBLIC PROPERTIES
  readonly status$ = this.select((s) => s.status);
  readonly googleCalendars$ = this.appShellStore
    .select(selectGoogleCalendars)
    .pipe(
      map((calendars) =>
        calendars.filter((c) => !CalendarHelper.googleCalendarIsReadonly(c))
      )
    );

  // EFFECTS
  readonly submitCreate = this.effect<{
    calendarId: string;
    body: DefaultGoogleCalendarEvent;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      withLatestFrom(this.teacher$),
      switchMap(([{ calendarId, body }, teacher]) =>
        this.googleService.create(teacher.id, calendarId, body).pipe(
          tapResponse(
            () =>
              this.patchState({
                status: 'successful',
                error: '',
              }),
            (error) =>
              this.patchState({
                status: 'systemError',
                error: error as string,
              })
          )
        )
      )
    )
  );

  readonly submitEdit = this.effect<{
    calendarId: string;
    eventId: string;
    body: DefaultGoogleCalendarEvent;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      withLatestFrom(this.teacher$),
      switchMap(([{ calendarId, eventId, body }, teacher]) =>
        this.googleService.update(teacher.id, calendarId, eventId, body).pipe(
          tapResponse(
            () =>
              this.patchState({
                status: 'successful',
                error: '',
              }),
            (error) =>
              this.patchState({
                status: 'systemError',
                error: error as string,
              })
          )
        )
      )
    )
  );

  // CONSTRUCTOR
  constructor(
    private readonly googleService: GoogleService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ExportDialogState>{});
  }
}
