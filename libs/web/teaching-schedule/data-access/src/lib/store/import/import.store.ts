import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { ObservableHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { GenericState } from '@teaching-scheduling-system/web/shared/data-access/models';
import { ImportService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectDepartment,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { mergeMap, tap, withLatestFrom } from 'rxjs';

type TeachingScheduleState = GenericState<void>;

@Injectable()
export class StatisticImportScheduleStore extends ComponentStore<TeachingScheduleState> {
  /** PUBLIC PROPERTIES */
  public readonly status$ = this.select((s) => s.status);
  public readonly department$ = this.appShellStore
    .select(selectDepartment)
    .pipe(ObservableHelper.filterNullish());

  /** EFFECTS */
  public readonly importFile = this.effect<{
    file: File;
    studySession: string;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      withLatestFrom(this.department$),
      mergeMap(([{ file, studySession }, department]) =>
        this.importService
          .importSchedule(file, department.id, studySession)
          .pipe(
            tapResponse(
              () =>
                this.patchState({
                  status: 'successful',
                  error: '',
                }),
              (error) =>
                this.patchState({
                  status: 'clientError',
                  error: error as string,
                })
            )
          )
      )
    )
  );

  /** CONSTRUCTOR */
  constructor(
    private readonly importService: ImportService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<TeachingScheduleState>{});
  }
}
