import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Store } from '@ngrx/store';
import { TuiDayRange } from '@taiga-ui/cdk';
import {
  ChangeSchedule,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { StatisticService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { switchMap, takeUntil, tap } from 'rxjs';

type ExportDialogState = GenericState<ChangeSchedule[]>;

@Injectable()
export class ExportDialogStore extends ComponentStore<ExportDialogState> {
  /** PUBLIC PROPERTIES */
  readonly data$ = this.select((s) => s.data);
  readonly status$ = this.select((s) => s.status);
  readonly teacher$ = this.appShellStore.pipe(
    selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  /** EFFECTS */
  readonly getPersonalChangeScheduleRequests = this.effect<{
    range: TuiDayRange;
    teacherId: string;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: 'loading', error: null })),
      switchMap((params) =>
        this.statisticService.getPersonal(params.range, params.teacherId).pipe(
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
    private readonly statisticService: StatisticService,
    private readonly appShellStore: Store<AppShellState>
  ) {
    super(<ExportDialogState>{});
  }
}
