import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ExamService } from '@services/exam.service';
import { EApiStatus } from '@shared/enums';
import { UrlHelper } from '@shared/helpers';
import { ExamScheduleModel, GenericState, SearchExam } from '@shared/models';
import { switchMap, tap } from 'rxjs/operators';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';

type ExamState = GenericState<ExamScheduleModel[]>;

@Injectable()
export class ExamStore extends ComponentStore<ExamState> {
  /** PUBLIC PROPERTIES */
  public readonly data$ = this.select((s) => s.data);
  public readonly status$ = this.select((s) => s.status);
  public readonly teachers = this.appShellStore.select(
    fromAppShell.selectTeachersInDepartment
  );

  /** EFFECTS */
  public readonly getExam = this.effect<{
    departmentId: string;
    searchParams: SearchExam;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
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
                  status: EApiStatus.successful,
                  error: '',
                }),
              (error) =>
                this.patchState({
                  status: EApiStatus.systemError,
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
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super(<ExamState>{ data: null });
  }

  /** PUBLIC METHODS */
  public updateExam(
    idExam: number,
    examInfo: Partial<ExamScheduleModel>
  ): void {
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
