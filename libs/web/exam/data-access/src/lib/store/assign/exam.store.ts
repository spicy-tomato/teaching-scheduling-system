import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import {
  ExamScheduleModel,
  GenericState,
  SearchExam,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExamService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { switchMap, tap } from 'rxjs';

type ExamState = GenericState<ExamScheduleModel[]>;

@Injectable()
export class ExamAssignStore extends ComponentStore<ExamState> {
  // PUBLIC PROPERTIES
  readonly data$ = this.select((s) => s.data);
  readonly status$ = this.select((s) => s.status);

  // EFFECTS
  readonly getExam = this.effect<{
    departmentId: string;
    searchParams: SearchExam;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap(({ departmentId, searchParams }) =>
        this.examService
          .getDepartmentExamSchedule(
            departmentId,
            searchParams.studySession,
            'session'
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

  // CONSTRUCTOR
  constructor(private readonly examService: ExamService) {
    super(<ExamState>{});
  }

  // PUBLIC METHODS
  updateExam(idExam: number, examInfo: Partial<ExamScheduleModel>): void {
    this.patchState(({ data }) => ({
      data: data?.map((exam) => {
        if (exam.id === idExam) {
          return { ...exam, ...examInfo } as ExamScheduleModel;
        }
        return exam;
      }),
    }));
  }
}
