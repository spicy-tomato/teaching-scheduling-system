import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { TuiDayRange } from '@taiga-ui/cdk';
import {
  ChangeSchedule,
  GenericState,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { StatisticService } from '@teaching-scheduling-system/web/shared/data-access/services';
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
  constructor(private readonly statisticService: StatisticService) {
    super(<ExportDialogState>{});
  }
}
