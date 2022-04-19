import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
  OnInit,
} from '@angular/core';
import { ChangeSchedule, SimpleModel } from '@shared/models';
import { combineLatest, Observable } from 'rxjs';
import * as fromStatisticChangeSchedule from '../state';
import { Store } from '@ngrx/store';
import { ChangeStatusHelper, ObjectHelper } from '@shared/helpers';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@modules/core/base/base.component';
import { ShortenNamePipe } from '@pipes/shorten-name.pipe';
import { TokenService } from '@services/core/token.service';
import { EApiStatus } from '@shared/enums';
import { TuiLineHandler } from '@taiga-ui/addon-charts';

type TeacherData = { [key: string]: { accept: number; deny: number } };

@Component({
  selector: 'tss-statistic-change-schedule-chart',
  templateUrl: './statistic-change-schedule-chart.component.html',
  styleUrls: ['./statistic-change-schedule-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticChangeScheduleChartComponent
  extends BaseComponent
  implements OnInit
{
  /** PUBLIC PROPERTIES */
  public teachersNameList: string[] = [];

  public value: [number[], number[]] = [[], []];
  public labelsX: string[] = [];
  public labelsY: string[] = [];
  public axisYLabels: string[] = [];
  public max = 0;

  public readonly status$: Observable<EApiStatus>;
  public readonly teachersList$: Observable<SimpleModel[]>;
  public readonly EApiStatus = EApiStatus;
  public readonly setNames = ['Đã đổi', 'Bị từ chối'];
  public readonly horizontalLinesHandler: TuiLineHandler = (index, total) => {
    return index === 0 || (total - index) % 5 === 0 ? 'dashed' : 'none';
  };

  /** PRIVATE PROPERTIES */
  private readonly shortenNamePipe: ShortenNamePipe;
  private readonly changeSchedules$: Observable<ChangeSchedule[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly tokenService: TokenService,
    private readonly store: Store<fromStatisticChangeSchedule.StatisticChangeScheduleState>,
    @Inject(Injector) injector: Injector
  ) {
    super();

    this.shortenNamePipe = injector.get(
      this.tokenService.getToken<ShortenNamePipe>('shortenNamePipe')
    );

    this.status$ = store
      .select(fromStatisticChangeSchedule.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.teachersList$ = store
      .select(fromStatisticChangeSchedule.selectTeachersList)
      .pipe(takeUntil(this.destroy$));
    this.changeSchedules$ = store
      .select(fromStatisticChangeSchedule.selectChangeSchedules)
      .pipe(takeUntil(this.destroy$));

    store.dispatch(fromStatisticChangeSchedule.reset());

    this.handleChangeScheduleChange();
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.store.dispatch(fromStatisticChangeSchedule.loadTeacherList());
  }

  /** PUBLIC METHODS */

  /** PRIVATE METHODS */
  private handleChangeScheduleChange(): void {
    combineLatest([
      this.changeSchedules$,
      this.teachersList$.pipe(filter((list) => list.length > 0)),
    ])
      .pipe(
        tap(([changeSchedules, teachersList]) =>
          this.calculateChartData(changeSchedules, teachersList)
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private calculateChartData(
    changeSchedules: ChangeSchedule[],
    teachersList: SimpleModel[]
  ): void {
    const teacherData = teachersList.reduce<TeacherData>((acc, curr) => {
      acc[curr.id] = { accept: 0, deny: 0 };
      return acc;
    }, {});

    changeSchedules.forEach((changeSchedule) => {
      const id = changeSchedule.teacher.id;
      if (ChangeStatusHelper.isApproved(changeSchedule.status)) {
        teacherData[id].accept++;
      } else {
        teacherData[id].deny++;
      }
    });

    const value: [number[], number[]] = [[], []];
    const newTeachersList: string[] = [];
    const labelsX: string[] = [];
    let maxHeight = 0;

    ObjectHelper.toArray(teacherData).forEach((v) => {
      const name = teachersList.find((t) => t.id === v.id)?.name;
      if (name) {
        labelsX.push(this.shortenNamePipe.transform(name));
        value[0].push(v.value.accept);
        value[1].push(v.value.deny);
        newTeachersList.push(name);
        maxHeight = Math.max(maxHeight, v.value.accept, v.value.deny);
      }
    });

    this.value = value;
    this.labelsY = [...Array(maxHeight + 1).keys()].map((x, i, arr) =>
      x % 5 === 0 || i === arr.length - 1 ? `${x}` : ''
    );
    this.max = maxHeight;
    this.labelsX = labelsX;
    this.teachersNameList = newTeachersList;
    this.cdr.markForCheck();
  }
}
