import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { TeacherService } from '@services/teacher.service';
import { ChangeSchedule, SimpleModel, Teacher } from '@shared/models';
import { combineLatest, Observable, Subject } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import * as fromStatisticChangeSchedule from '../state';
import { Store } from '@ngrx/store';
import { ObjectHelper, ObservableHelper } from '@shared/helpers';
import { take, takeUntil, tap } from 'rxjs/operators';
import { BaseComponent } from '@modules/core/base/base.component';
import { ShortenNamePipe } from '@pipes/shorten-name.pipe';
import { TokenService } from '@services/core/token.service';

type TeacherData = { [key: string]: { accept: number; deny: number } };

@Component({
  selector: 'tss-statistic-change-schedule-chart',
  templateUrl: './statistic-change-schedule-chart.component.html',
  styleUrls: ['./statistic-change-schedule-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticChangeScheduleChartComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public value: [number[], number[]] = [[], []];

  public labelsX: string[] = [];
  public teachersList$ = new Subject<SimpleModel[]>();
  public teachersNameList: string[] = [];
  public labelsY = ['0', '10 000'];
  public max = 0;

  public readonly setNames = ['Đã đổi', 'Đã hủy'];

  /** PRIVATE PROPERTIES */
  private readonly shortenNamePipe: ShortenNamePipe;
  private readonly teacher$: Observable<Teacher>;
  private readonly changeSchedules$: Observable<ChangeSchedule[]>;

  /** CONSTRUCTOR */
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly teacherService: TeacherService,
    private readonly tokenService: TokenService,
    @Inject(Injector) injector: Injector,
    store: Store<fromStatisticChangeSchedule.StatisticChangeScheduleState>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.shortenNamePipe = injector.get(
      this.tokenService.getToken<ShortenNamePipe>('shortenNamePipe')
    );

    this.teacher$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));
    this.changeSchedules$ = store
      .select(fromStatisticChangeSchedule.selectChangeSchedules)
      .pipe(takeUntil(this.destroy$));

    this.loadTeacherList();
    this.handleChangeScheduleChange();
  }

  /** PUBLIC METHODS */
  public getBackground(index: number): string {
    return `var(--tui-chart-${index})`;
  }

  /** PRIVATE METHODS */
  private loadTeacherList(): void {
    this.teacher$
      .pipe(
        tap((teacher) => {
          this.teacherService
            .getByDepartment(teacher.department.id)
            .pipe(
              tap((teachers) => {
                this.teachersList$.next(teachers);
              })
            )
            .subscribe();
        }),
        take(1)
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private handleChangeScheduleChange(): void {
    combineLatest([this.changeSchedules$, this.teachersList$])
      .pipe(
        tap(([changeSchedules, teachersList]) => {
          const teacherData = teachersList.reduce<TeacherData>((acc, curr) => {
            acc[curr.id] = { accept: 0, deny: 0 };
            return acc;
          }, {});

          // debugger;
          changeSchedules.forEach((changeSchedule) => {
            const id = changeSchedule.teacher.id;
            if (changeSchedule.status > 0) {
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
              maxHeight = Math.max(maxHeight, v.value.accept + v.value.deny);
            }
          });

          this.value = value;
          this.labelsY = ['0', maxHeight.toString()];
          this.max = maxHeight;
          this.labelsX = labelsX;
          this.teachersNameList = newTeachersList;
          this.cdr.markForCheck();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
