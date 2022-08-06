import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { UrlHelper } from '@teaching-scheduling-system/core/utils/helpers';
import {
  ExamScheduleModel,
  GenericState,
  SearchExam,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectTeachersInDepartment,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, takeUntil, tap } from 'rxjs';

type ExamState = GenericState<ExamScheduleModel[]>;

@Injectable()
export class ExamAssignStore extends ComponentStore<ExamState> {
  /** PUBLIC PROPERTIES */
  readonly data$ = this.select((s) => s.data);
  readonly status$ = this.select((s) => s.status);
  readonly teachers = this.appShellStore
    .select(selectTeachersInDepartment)
    .pipe(takeUntil(this.destroy$));

  /** EFFECTS */
  readonly getExam = this.effect<{
    departmentId: string;
    searchParams: SearchExam;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap((params) =>
        this.examService
          .getDepartmentExamSchedule(
            params.departmentId,
            UrlHelper.queryFilter(params.searchParams, { date: 'between' })
          )
          .pipe(
            tapResponse(
              (r) =>
                this.patchState({
                  data: r.data,
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

  /** CONSTRUCTOR */
  constructor(
    private readonly examService: ExamService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ExamState>{});
  }

  /** PUBLIC METHODS */
  updateExam(idExam: number, examInfo: Partial<ExamScheduleModel>): void {
    this.patchState((state) => ({
      data: state.data?.map((exam) => {
        if (exam.id === idExam) {
          return { ...exam, ...examInfo } as ExamScheduleModel;
        }
        return exam;
      }),
    }));
  }
}
