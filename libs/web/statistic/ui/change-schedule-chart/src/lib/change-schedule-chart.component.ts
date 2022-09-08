import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
} from '@angular/core';
import { TuiLineHandler } from '@taiga-ui/addon-charts';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  ChangeStatusHelper,
  ObjectHelper,
  StringHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import {
  ChangeSchedule,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { StatisticChangeScheduleStore } from '@teaching-scheduling-system/web/statistic/data-access';
import { combineLatest, filter, tap } from 'rxjs';

type TeacherData = { [key: string]: { accept: number; deny: number } };

@Component({
  selector: 'tss-change-schedule-chart',
  templateUrl: './change-schedule-chart.component.html',
  styleUrls: ['./change-schedule-chart.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ChangeScheduleChartComponent {
  // PUBLIC PROPERTIES
  teachersNameList: string[] = [];

  value: [number[], number[]] = [[], []];
  labelsX: string[] = [];
  labelsY: string[] = [];
  axisYLabels: string[] = [];
  max = 0;

  readonly teachersList$ = this.store.teachersInDepartment$;
  readonly status$ = this.store.status$;
  readonly setNames = ['Đã đổi', 'Bị từ chối'];
  readonly horizontalLinesHandler: TuiLineHandler = (index, total) => {
    return index === 0 || (total - index) % 5 === 0 ? 'none' : 'dashed';
  };

  // PRIVATE PROPERTIES
  private readonly data$ = this.store.data$;

  // CONSTRUCTOR
  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly store: StatisticChangeScheduleStore,
    private readonly destroy$: TuiDestroyService
  ) {
    this.handleChangeScheduleChange();
  }

  // PRIVATE METHODS
  private handleChangeScheduleChange(): void {
    combineLatest([this.data$, this.teachersList$])
      .pipe(
        filter(
          ([changeSchedules, teachersList]) =>
            !!changeSchedules && teachersList.length > 0
        ),
        tap(([changeSchedules, teachersList]) =>
          this.calculateChartData(changeSchedules, teachersList)
        )
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
        labelsX.push(StringHelper.shortenName(name));
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
