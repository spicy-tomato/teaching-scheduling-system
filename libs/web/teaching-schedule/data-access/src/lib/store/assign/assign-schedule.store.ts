import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ObservableHelper,
  StringHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { EApiStatus } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ModuleClass,
  SearchAssignSchedule,
  SimpleMapModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  ClassService,
  CommonInfoService,
  TeacherService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectAcademicData,
  selectDepartment,
  selectSchoolYear,
  selectTrainingTypes,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  map,
  Observable,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

type Status = {
  filter: EApiStatus;
  assign: EApiStatus;
  unassign: EApiStatus;
};
type Teacher = {
  data: SimpleModel[];
  selected: Nullable<SimpleModel>;
  action: Nullable<SimpleModel>;
  actionCount: number;
};
type AssignScheduleState = {
  departments: SimpleMapModel<string, SimpleModel[]>[];
  data: ModuleClass[];
  selected: string[];
  status: Status;
  teacher: Teacher;
};

@Injectable()
export class AssignStore extends ComponentStore<AssignScheduleState> {
  // PRIVATE PROPERTIES
  private readonly _status$ = this.select((s) => s.status);
  private readonly _teacher$ = this.select((s) => s.teacher);
  private readonly _selected$ = this.select((s) => s.selected);

  // PUBLIC PROPERTIES
  readonly data$ = this.select((s) => s.data);
  readonly departments$ = this.select((s) => s.departments);

  readonly status$ = (prop: keyof Status) =>
    this.select(this._status$, (s) => s[prop]);
  readonly teacher$: <T extends keyof Teacher>(
    prop: T
  ) => Observable<Teacher[T]> = (prop) =>
    this.select(this._teacher$, (t) => t[prop]);

  readonly needAssign$ = this.select(this.data$, (data) =>
    data.filter((x) => !x.teacher)
  );
  readonly assigned$ = this.select(this.data$, (data) =>
    data.filter((x) => !!x.teacher)
  );

  readonly selectedNeedAssign$ = this.select(
    this.needAssign$,
    this._selected$,
    (needAssignSchedule, selected) =>
      needAssignSchedule.filter((x) => selected.includes(x.id))
  );
  readonly selectedAssigned$ = this.select(
    this.assigned$,
    this._selected$,
    this._teacher$,
    (assignedSchedule, selected, teacher) =>
      assignedSchedule.filter(
        (x) =>
          (!teacher.selected || x.teacher === teacher.selected?.name) &&
          selected.includes(x.id)
      )
  );

  readonly myDepartment$ = this.appShellStore
    .select(selectDepartment)
    .pipe(takeUntil(this.destroy$));
  readonly currentTerm$ = this.appShellStore
    .select(selectSchoolYear)
    .pipe(takeUntil(this.destroy$));
  readonly academicData$ = this.appShellStore
    .select(selectAcademicData)
    .pipe(takeUntil(this.destroy$));
  readonly trainingTypes$ = this.appShellStore
    .select(selectTrainingTypes)
    .pipe(takeUntil(this.destroy$));

  // EFFECTS
  readonly loadDepartment = this.effect((params$) =>
    params$.pipe(
      switchMap(() =>
        this.commonInfoService.getFaculties().pipe(
          tapResponse(
            (r) => this.patchState({ departments: r.data }),
            // TODO: Handle error
            () => this.patchState((state) => state)
          )
        )
      )
    )
  );

  readonly filter = this.effect<{
    dep: string;
    params: SearchAssignSchedule;
  }>((params$) =>
    params$.pipe(
      tap(() =>
        this.patchState((state) => ({
          status: { ...state.status, filter: 'loading' },
        }))
      ),
      switchMap(({ dep, params }) =>
        this.classService.getDepartmentModuleClass(dep, params).pipe(
          tapResponse(
            ({ data }) =>
              this.patchState((state) => ({
                data,
                status: { ...state.status, filter: 'successful' },
              })),
            // TODO: Handle error
            () => this.patchState((state) => state)
          )
        )
      )
    )
  );

  readonly loadTeacher = this.effect<string>((params$) =>
    params$.pipe(
      switchMap((dep) =>
        this.teacherService.getByDepartment(dep).pipe(
          tapResponse(
            ({ data }) => {
              const sortedData = [...data];
              sortedData.sort((a, b) =>
                StringHelper.nameCompareFn(a.name, b.name)
              );

              this.patchState(() => ({
                teacher: {
                  data: sortedData,
                  selected: null,
                  action: null,
                  actionCount: 0,
                },
              }));
            },
            // TODO: Handle error
            () => this.patchState((state) => state)
          )
        )
      )
    )
  );

  readonly assign = this.effect((params$) =>
    params$.pipe(
      tap(() =>
        this.patchState((state) => ({
          status: { ...state.status, assign: 'loading' },
        }))
      ),
      withLatestFrom(
        this.select(this._teacher$, (t) => t.selected).pipe(
          ObservableHelper.filterNullish()
        ),
        this.selectedNeedAssign$.pipe(map((s) => s.map((x) => x.id)))
      ),
      switchMap(({ 1: teacher, 2: classIds }) =>
        this.classService.assign(teacher.id, classIds).pipe(
          tapResponse(
            () =>
              this.patchState((state) => {
                const newState = structuredClone(state);
                newState.data.forEach((c) => {
                  if (classIds.includes(c.id)) {
                    c.teacher = teacher.name;
                  }
                });
                const selected = state.selected.filter(
                  (s) => !classIds.includes(s)
                );

                return {
                  ...newState,
                  selected,
                  teacher: {
                    ...state.teacher,
                    action: teacher,
                    actionCount: classIds.length,
                  },
                  status: { ...state.status, assign: 'successful' },
                };
              }),
            // TODO: Handle error
            () => this.patchState((state) => state)
          )
        )
      )
    )
  );

  readonly unassign = this.effect((params$) =>
    params$.pipe(
      tap(() =>
        this.patchState((state) => ({
          status: { ...state.status, unassign: 'loading' },
        }))
      ),
      withLatestFrom(
        this.selectedAssigned$.pipe(map((s) => s.map((x) => x.id)))
      ),
      switchMap(({ 1: classIds }) =>
        this.classService.unassign(classIds).pipe(
          tapResponse(
            () =>
              this.patchState((state) => {
                const newState = structuredClone(state);
                newState.data.forEach((c) => {
                  if (classIds.includes(c.id)) {
                    c.teacher = null;
                  }
                });

                return {
                  ...newState,
                  teacher: {
                    ...state.teacher,
                    action: null,
                    actionCount: classIds.length,
                  },
                  selected: state.selected.filter((s) => !classIds.includes(s)),
                  status: { ...state.status, unassign: 'successful' },
                };
              }),
            // TODO: Handle error
            () => this.patchState((state) => state)
          )
        )
      )
    )
  );

  // CONSTRUCTOR
  constructor(
    private readonly commonInfoService: CommonInfoService,
    private readonly classService: ClassService,
    private readonly teacherService: TeacherService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<AssignScheduleState>{
      departments: [],
      data: [],
      selected: [],
      status: { filter: 'unknown', assign: 'unknown', unassign: 'unknown' },
      teacher: { data: [], selected: null, action: null, actionCount: 0 },
    });
  }

  // PUBLIC METHODS
  changeSelected(classIds: string[], checked: boolean) {
    this.patchState((state) => ({
      selected: checked
        ? [...state.selected, ...classIds]
        : state.selected.filter((x) => !classIds.includes(x)),
    }));
  }

  changeSelectedTeacher(teacher: Nullable<SimpleModel>): void {
    this.patchState((state) => ({
      teacher: {
        ...state.teacher,
        selected: teacher,
      },
    }));
  }
}
