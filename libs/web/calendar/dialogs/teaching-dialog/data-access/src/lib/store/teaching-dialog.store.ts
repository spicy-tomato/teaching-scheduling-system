import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { UrlHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  Note,
  RequestChangeSchedulePayload,
  RequestIntendChangeSchedulePayload,
  SearchSchedule,
  SimpleFixedScheduleModel,
  StudyScheduleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNameTitle,
  selectRooms,
  selectTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, takeUntil, tap } from 'rxjs';

type Status = {
  change: EApiStatus;
  request: EApiStatus;
  update: EApiStatus;
  search: EApiStatus;
  cancel: EApiStatus;
};
export type TeachingDialogChange = {
  note: string;
};
type LoginState = {
  status: Status;
  requestingChangeSchedule: boolean;
  justRequestedSchedule: Nullable<SimpleFixedScheduleModel>;
  change: TeachingDialogChange;
  searchSchedule: Nullable<StudyScheduleModel[]>;
};
const initialState: LoginState = {
  status: {
    change: 'unknown',
    request: 'unknown',
    update: 'unknown',
    search: 'unknown',
    cancel: 'unknown',
  },
  requestingChangeSchedule: false,
  justRequestedSchedule: null,
  change: {
    note: '',
  },
  searchSchedule: null,
};

@Injectable()
export class TeachingDialogStore extends ComponentStore<LoginState> {
  // PRIVATE PROPERTIES
  private readonly _status$ = this.select((s) => s.status);

  // PUBLIC PROPERTIES
  readonly change$ = this.select((s) => s.change);
  readonly searchSchedule$ = this.select((s) => s.searchSchedule);
  readonly justRequestedSchedule$ = this.select((s) => s.justRequestedSchedule);
  readonly requestingChangeSchedule$ = this.select(
    (s) => s.requestingChangeSchedule
  );
  readonly status$ = (prop: keyof Status) =>
    this.select(this._status$, (s) => s[prop]);

  readonly teacher$ = this.appShellStore
    .select(selectTeacher)
    .pipe(takeUntil(this.destroy$));
  readonly rooms$ = this.appShellStore
    .select(selectRooms)
    .pipe(takeUntil(this.destroy$));
  readonly nameTitle$ = this.appShellStore
    .select(selectNameTitle)
    .pipe(takeUntil(this.destroy$));

  // EFFECTS
  readonly request = this.effect<RequestChangeSchedulePayload>((params$) =>
    params$.pipe(
      tap(() =>
        this.patchState((state) => ({
          status: { ...state.status, request: 'loading' },
        }))
      ),
      switchMap((payload) =>
        this.scheduleService.requestChangeSchedule(payload).pipe(
          tapResponse(
            ({ data }) => {
              const { newDate, newShift, newIdRoom } = payload;
              this.patchState((state) => ({
                justRequestedSchedule: {
                  id: data,
                  newDate,
                  newShift,
                  newIdRoom,
                  status: 200,
                  intendTime: null,
                  createdAt: new Date(),
                },
                status: {
                  ...state.status,
                  request: 'successful',
                },
                requestingChangeSchedule: false,
              }));
            },
            () =>
              this.patchState((state) => ({
                requestingChangeSchedule: false,
                status: { ...state.status, request: 'systemError' },
              }))
          )
        )
      )
    )
  );

  readonly requestIntend = this.effect<RequestIntendChangeSchedulePayload>(
    (params$) =>
      params$.pipe(
        tap(() =>
          this.patchState((state) => ({
            status: { ...state.status, request: 'loading' },
          }))
        ),
        switchMap((payload) =>
          this.scheduleService.requestIntendChangeSchedule(payload).pipe(
            tapResponse(
              ({ data }) => {
                const { intendTime } = payload;
                this.patchState((state) => ({
                  justRequestedSchedule: {
                    id: data,
                    createdAt: new Date(),
                    intendTime,
                    status: 201,
                    newDate: null,
                    newShift: null,
                    newIdRoom: null,
                  },
                  status: {
                    ...state.status,
                    request: 'successful',
                  },
                  requestingChangeSchedule: false,
                }));
              },
              () =>
                this.patchState((state) => ({
                  requestingChangeSchedule: false,
                  status: { ...state.status, request: 'systemError' },
                }))
            )
          )
        )
      )
  );

  readonly change = this.effect<RequestChangeSchedulePayload>((params$) =>
    params$.pipe(
      tap(() =>
        this.patchState((state) => ({
          status: { ...state.status, change: 'loading' },
        }))
      ),
      switchMap((payload) =>
        this.scheduleService.changeSchedule(payload).pipe(
          tapResponse(
            () => {
              this.patchState((state) => ({
                status: {
                  ...state.status,
                  change: 'successful',
                },
                requestingChangeSchedule: false,
              }));
            },
            () =>
              this.patchState((state) => ({
                requestingChangeSchedule: false,
                status: { ...state.status, request: 'systemError' },
              }))
          )
        )
      )
    )
  );

  readonly update = this.effect<{ id: number; payload: Note }>((params$) =>
    params$.pipe(
      tap(() =>
        this.patchState((state) => ({
          status: { ...state.status, update: 'loading' },
        }))
      ),
      switchMap(({ id, payload }) =>
        this.scheduleService.updateStudyNote(id, payload).pipe(
          tapResponse(
            () => {
              this.patchState((state) => ({
                change: { note: payload.note },
                status: {
                  ...state.status,
                  update: 'successful',
                },
              }));
            },
            () =>
              this.patchState((state) => ({
                status: { ...state.status, update: 'systemError' },
              }))
          )
        )
      )
    )
  );

  readonly search = this.effect<{ teacherId: string; payload: SearchSchedule }>(
    (params$) =>
      params$.pipe(
        tap(() =>
          this.patchState((state) => ({
            status: { ...state.status, search: 'loading' },
          }))
        ),
        switchMap(({ teacherId, payload }) =>
          this.scheduleService
            .getSchedule(
              teacherId,
              UrlHelper.queryFilter(payload, {
                date: 'between',
                shift: 'in',
              })
            )
            .pipe(
              tapResponse(
                ({ data }) => {
                  this.patchState((state) => ({
                    searchSchedule: data,
                    status: {
                      ...state.status,
                      search: 'successful',
                    },
                  }));
                },
                () =>
                  this.patchState((state) => ({
                    status: { ...state.status, search: 'systemError' },
                  }))
              )
            )
        )
      )
  );

  readonly cancel = this.effect<number>((params$) =>
    params$.pipe(
      tap(() =>
        this.patchState((state) => ({
          status: { ...state.status, search: 'loading' },
        }))
      ),
      switchMap((id) =>
        this.scheduleService.cancelChangeScheduleRequests(id).pipe(
          tapResponse(
            () => {
              this.patchState((state) => ({
                justRequestedSchedule: null,
                status: {
                  ...state.status,
                  cancel: 'successful',
                },
              }));
            },
            () =>
              this.patchState((state) => ({
                status: { ...state.status, cancel: 'systemError' },
              }))
          )
        )
      )
    )
  );

  // CONSTRUCTOR
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(initialState);
  }

  // PUBLIC METHODS
  init(change: TeachingDialogChange): void {
    this.patchState({ ...initialState, change });
  }

  toggleRequest(open: boolean): void {
    this.patchState({ requestingChangeSchedule: open });
  }
}
