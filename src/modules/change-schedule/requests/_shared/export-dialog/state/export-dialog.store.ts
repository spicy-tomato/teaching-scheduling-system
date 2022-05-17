import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { StatisticService } from '@services/statistic.service';
import { EApiStatus } from '@shared/enums';
import { ChangeSchedule, GenericState } from '@shared/models';
import { TuiDayRange } from '@taiga-ui/cdk';
import { switchMap, tap } from 'rxjs/operators';

type ExportDialogState = GenericState<ChangeSchedule[]>;

@Injectable()
export class ExportDialogStore extends ComponentStore<ExportDialogState> {
  /** PUBLIC PROPERTIES */
  public readonly data$ = this.select((s) => s.data);
  public readonly status$ = this.select((s) => s.status);

  /** EFFECTS */
  public readonly getPersonalChangeScheduleRequests = this.effect<{
    range: TuiDayRange;
    teacherId: string;
  }>((params$) =>
    params$.pipe(
      tap(() => this.patchState({ status: EApiStatus.loading, error: null })),
      switchMap((params) =>
        this.statisticService.getPersonal(params.range, params.teacherId).pipe(
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
  constructor(private readonly statisticService: StatisticService) {
    super(<ExportDialogState>{ data: null });
  }
}
