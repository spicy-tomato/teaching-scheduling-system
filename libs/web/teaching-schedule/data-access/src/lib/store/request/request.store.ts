import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { PermissionConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  Nullable,
  RequestChangeScheduleCode,
} from '@teaching-scheduling-system/core/data-access/models';
import {
  DateHelper,
  ObjectHelper,
  ObservableHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleOptionsParam,
  ChangeScheduleSearch,
  PaginationResponseModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ScheduleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectDepartment,
  selectNameTitle,
  selectNotNullTeacher,
  selectPermission,
  selectRooms,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import {
  combineLatest,
  filter,
  map,
  mergeMap,
  Observable,
  pipe,
  Subject,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

type Status = {
  data: EApiStatus;
  queue: number[];
};
type TeachingScheduleRequestState = {
  status: Status;
  options: ChangeScheduleOptions;
  changeSchedules: ChangeSchedule[];
  total: number;
  query: ChangeScheduleSearch;
  exportIndexes: boolean[];
};
const initialState: TeachingScheduleRequestState = {
  status: {
    data: 'unknown',
    queue: [],
  },
  options: {
    teacher: null,
    status: null,
    showTime: false,
    showReason: true,
  },
  changeSchedules: [],
  total: 0,
  query: {
    status: [],
    page: 1,
  },
  exportIndexes: [],
};

@Injectable()
export class RequestStore extends ComponentStore<TeachingScheduleRequestState> {
  // PRIVATE PROPERTIES
  private personal!: boolean;
  private readonly loadSubject$ = new Subject<ChangeScheduleSearch>();

  private readonly query$ = this.select((s) => s.query);
  private readonly exportIndexes$ = this.select((s) => s.exportIndexes);

  private readonly department$ = this.appShellStore
    .select(selectDepartment)
    .pipe(takeUntil(this.destroy$));

  // PUBLIC PROPERTIES
  readonly options$ = this.select((s) => s.options);
  readonly pageCount$ = this.select((s) => s.total);
  readonly changeSchedules$ = this.select((s) => s.changeSchedules);
  readonly page$ = this.select(this.query$, (q) => q.page);
  readonly exportSchedule$ = this.select(
    this.changeSchedules$,
    this.exportIndexes$,
    (changeSchedules, indexes) =>
      changeSchedules.filter((_, index) => indexes[index])
  );

  readonly status$: <T extends keyof Status>(prop: T) => Observable<Status[T]> =
    (prop) => this.select(({ status }) => status[prop]);

  readonly rooms$ = this.appShellStore
    .select(selectRooms)
    .pipe(takeUntil(this.destroy$));
  readonly teacher$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );
  readonly permissions$ = this.appShellStore
    .select(selectPermission)
    .pipe(takeUntil(this.destroy$));
  readonly nameTitle$ = this.appShellStore
    .select(selectNameTitle)
    .pipe(takeUntil(this.destroy$));

  // EFFECTS
  readonly changeOptions = this.effect<ChangeScheduleOptionsParam>((params$) =>
    params$.pipe(
      tap((newOptions) =>
        this.patchState(({ options }) => ({
          options: { ...options, ...newOptions },
        }))
      ),
      withLatestFrom(this.permissions$),
      tap(([{ status, teacher }, permissions]) => {
        const _status = this.getQueryForStatus(status, permissions);
        this.filter({
          status: _status,
          teacherId: teacher?.id,
          page: 1,
        });
      })
    )
  );

  readonly changePage = this.effect<number>((params$) =>
    params$.pipe(
      withLatestFrom(this.permissions$, this.options$),
      tap(([page, permissions, { status, teacher }]) => {
        const _status = this.getQueryForStatus(status, permissions);
        this.filter({
          status: _status,
          teacherId: teacher?.id,
          page: page + 1,
        });
      })
    )
  );

  readonly accept = this.effect<ChangeSchedule>((params$) =>
    params$.pipe(
      tap(({ id }) =>
        this.patchState(({ status }) => ({
          status: {
            ...status,
            queue: [...status.queue, id],
          },
        }))
      ),
      switchMap(({ id }) => {
        const acceptedAt = DateHelper.toSqlDate(new Date());
        return this.scheduleService
          .acceptChangeScheduleRequests(id, { acceptedAt })
          .pipe(
            tapResponse(
              ({ data }) => {
                this.patchState(({ changeSchedules, status }) => {
                  const newChangeSchedules = changeSchedules.map((x) => {
                    const current = new Date();
                    if (x.id === id) {
                      const newObj: ChangeSchedule = {
                        ...x,
                        status: data.status,
                        acceptedAt: current,
                        setRoomAt: data.status === 300 ? current : x.setRoomAt,
                      };
                      return newObj;
                    }
                    return x;
                  });

                  return {
                    changeSchedules: newChangeSchedules,
                    status: {
                      ...status,
                      queue: this.getQueue(status, id),
                    },
                  };
                });
              },
              // TODO: Handle error
              () => this.patchState(() => ({}))
            )
          );
      })
    )
  );

  readonly setRoom = this.effect<{
    schedule: ChangeSchedule;
    newIdRoom: string;
  }>((params$) =>
    params$.pipe(
      tap(({ schedule }) =>
        this.patchState(({ status }) => ({
          status: {
            ...status,
            queue: [...status.queue, schedule.id],
          },
        }))
      ),
      switchMap(({ schedule, newIdRoom }) => {
        const { id } = schedule;
        const setRoomAt = DateHelper.toSqlDate(new Date());

        return this.scheduleService
          .setRoomChangeScheduleRequests(id, {
            newIdRoom,
            setRoomAt,
          })
          .pipe(
            tapResponse(
              () => {
                this.patchState(({ changeSchedules, status }) => {
                  const newChangeSchedules = changeSchedules.map((x) => {
                    if (x.id === id) {
                      const newObj: ChangeSchedule = {
                        ...x,
                        status: 300,
                        setRoomAt: new Date(),
                        newSchedule: {
                          ...x.newSchedule,
                          room: newIdRoom,
                        },
                      };
                      return newObj;
                    }
                    return x;
                  });

                  return {
                    changeSchedules: newChangeSchedules,
                    status: {
                      ...status,
                      queue: this.getQueue(status, id),
                    },
                  };
                });
              },
              // TODO: Handle error
              () => this.patchState(() => ({}))
            )
          );
      })
    )
  );

  readonly deny = this.effect<{ schedule: ChangeSchedule; reason: string }>(
    (params$) =>
      params$.pipe(
        tap(({ schedule }) =>
          this.patchState(({ status }) => ({
            status: {
              ...status,
              queue: [...status.queue, schedule.id],
            },
          }))
        ),
        switchMap(({ schedule, reason }) => {
          const { id } = schedule;

          return this.scheduleService
            .denyChangeScheduleRequests(id, { reasonDeny: reason })
            .pipe(
              tapResponse(
                ({ data }) => {
                  this.patchState(({ changeSchedules, status }) => {
                    const newChangeSchedules = changeSchedules.map((x) => {
                      if (x.id === id) {
                        const newObj: ChangeSchedule = {
                          ...x,
                          status: data.status,
                        };
                        return newObj;
                      }
                      return x;
                    });

                    return {
                      changeSchedules: newChangeSchedules,
                      status: {
                        ...status,
                        queue: this.getQueue(status, id),
                      },
                    };
                  });
                },
                // TODO: Handle error
                () => this.patchState(() => ({}))
              )
            );
        })
      )
  );

  readonly cancel = this.effect<number>((params$) =>
    params$.pipe(
      tap((id) =>
        this.patchState(({ status }) => ({
          status: {
            ...status,
            queue: [...status.queue, id],
          },
        }))
      ),
      switchMap((id) => {
        return this.scheduleService.cancelChangeScheduleRequests(id).pipe(
          tapResponse(
            () => {
              this.patchState(({ changeSchedules, status }) => {
                const newChangeSchedules = changeSchedules.map((x) => {
                  if (x.id === id) {
                    const newObj: ChangeSchedule = { ...x, status: 100 };
                    return newObj;
                  }
                  return x;
                });

                return {
                  changeSchedules: newChangeSchedules,
                  status: {
                    ...status,
                    queue: this.getQueue(status, id),
                  },
                };
              });
            },
            // TODO: Handle error
            () => this.patchState(() => ({}))
          )
        );
      })
    )
  );

  // CONSTRUCTOR
  constructor(
    private readonly scheduleService: ScheduleService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(initialState);

    this.handleLoadPersonal();
    this.handleLoadDepartment();
    this.handleLoadManager();
  }

  // PUBLIC METHODS
  reset(personal: boolean) {
    this.personal = personal;
    this.patchState(initialState);
  }

  filter(query: ChangeScheduleSearch): void {
    this.patchState(({ status }) => ({
      query,
      exportIndexes: [],
      status: {
        ...status,
        data: 'loading',
      },
    }));
    this.loadSubject$.next(query);
  }

  selectExport(exportIndexes: boolean[]): void {
    this.patchState({ exportIndexes });
  }

  // PRIVATE METHODS
  private handleLoadPersonal(): void {
    this.loadSubject$
      .pipe(
        filter(() => this.personal),
        ObservableHelper.filterWith(
          this.permissions$,
          PermissionConstant.SEE_PERSONAL_CHANGE_SCHEDULE_REQUESTS
        ),
        withLatestFrom(this.teacher$),
        mergeMap(([searchSchedule, teacher]) => {
          return this.scheduleService
            .getPersonalChangeScheduleRequests(teacher.id, searchSchedule)
            .pipe(this.filterHandler());
        })
      )
      .subscribe();
  }

  private handleLoadDepartment(): void {
    combineLatest([
      this.department$.pipe(ObservableHelper.filterNullish()),
      this.loadSubject$,
    ])
      .pipe(
        filter(() => !this.personal),
        ObservableHelper.filterWith(
          this.permissions$,
          PermissionConstant.SEE_DEPARTMENT_CHANGE_SCHEDULE_REQUESTS
        ),
        map(([department, params]) => ({
          department: department.id,
          params,
        })),
        mergeMap(({ department, params }) => {
          return this.scheduleService
            .getDepartmentChangeScheduleRequests(department, params)
            .pipe(this.filterHandler());
        })
      )
      .subscribe();
  }

  private handleLoadManager(): void {
    this.loadSubject$
      .pipe(
        filter(() => !this.personal),
        ObservableHelper.filterWith(
          this.permissions$,
          PermissionConstant.SEE_CHANGE_SCHEDULE_REQUESTS_FOR_ROOM_MANAGER
        ),
        mergeMap((changeScheduleSearch) => {
          return this.scheduleService
            .getManagerChangeScheduleRequests(changeScheduleSearch)
            .pipe(this.filterHandler());
        })
      )
      .subscribe();
  }

  private filterHandler(): (
    source: Observable<PaginationResponseModel<ChangeSchedule[]>>
  ) => Observable<PaginationResponseModel<ChangeSchedule[]>> {
    return pipe(
      tapResponse(
        ({ data, meta }) =>
          this.patchState(({ status }) => ({
            changeSchedules: data,
            total: meta.last_page,
            status: {
              ...status,
              data: 'successful',
            },
          })),
        () =>
          this.patchState(({ status }) => ({
            status: { ...status, data: 'systemError' },
          }))
      )
    );
  }

  private getQueryForStatus(
    status: Nullable<RequestChangeScheduleCode> | undefined,
    permissions: number[]
  ): RequestChangeScheduleCode[] {
    if (ObjectHelper.isNullOrUndefined(status)) {
      return [];
    }

    const statusDetails =
      ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS[status];

    if (!statusDetails.mergeWith) {
      return [status];
    }

    const statusList: RequestChangeScheduleCode[] = [];
    [status, ...statusDetails.mergeWith].forEach((s) => {
      const sDetails = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS[s];
      if (sDetails.feature === null || permissions.includes(sDetails.feature)) {
        statusList.push(s);
      }
    });

    return statusList;
  }

  private getQueue(status: Status, id: number): number[] {
    return status.queue.filter((x) => x !== id);
  }
}
