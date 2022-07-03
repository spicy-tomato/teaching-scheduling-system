import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiDialogService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';
import {
  ObjectHelper,
  StringHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { FileType } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleOptionsParam,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExportService } from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNotNullTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { ScheduleConstant } from '@teaching-scheduling-system/web/shared/utils/constants';
import {
  teachingScheduleRequestChangeOptions,
  teachingScheduleRequestSelectExportSchedule,
  teachingScheduleRequestSelectOptions,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { ChangeReportDialogComponent } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-report-dialog';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'tss-change-request-filter',
  templateUrl: './change-request-filter.component.html',
  styleUrls: ['./change-request-filter.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    TuiDestroyService,
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 's',
      },
    },
  ],
})
export class ChangeRequestFilterComponent {
  /** PUBLIC PROPERTIES */
  public options$: Observable<ChangeScheduleOptions>;
  public exportSchedule$: Observable<ChangeSchedule[]>;
  public isPersonal: boolean;
  public exportMultiple$ = new Subject<void>();

  public readonly IconConstant = IconConstant;
  public readonly statusList = ScheduleConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly statusArray = ObjectHelper.toArray(this.statusList, {
    uniqueValue: true,
  }).sort((a, b) => (a.id as number) - (b.id as number));

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<TeachingScheduleRequestState>,
    private readonly exportService: ExportService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
    route: ActivatedRoute,
    appShellStore: Store<AppShellState>
  ) {
    this.options$ = store
      .select(teachingScheduleRequestSelectOptions)
      .pipe(takeUntil(this.destroy$));
    this.exportSchedule$ = store
      .select(teachingScheduleRequestSelectExportSchedule)
      .pipe(takeUntil(this.destroy$));
    this.teacher$ = appShellStore.pipe(
      selectNotNullTeacher,
      takeUntil(this.destroy$)
    );

    this.isPersonal = route.snapshot.data['personal'] as boolean;
    this.handleExportMultiple();
  }

  /** PUBLIC METHODS */
  public changeOptions(options: ChangeScheduleOptionsParam): void {
    this.store.dispatch(teachingScheduleRequestChangeOptions({ options }));
  }

  public onExport(): void {
    this.dialogService
      .open(
        new PolymorpheusComponent(ChangeReportDialogComponent, this.injector),
        {
          label: 'Xuất báo cáo thay đổi giờ giảng',
          dismissible: false,
        }
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private handleExportMultiple(): void {
    this.exportMultiple$
      .pipe(
        withLatestFrom(this.exportSchedule$, this.teacher$),
        tap(({ 1: schedules, 2: teacher }) => {
          const document =
            this.exportService.exportChangeScheduleRequestForTeacher(
              schedules,
              teacher.name,
              teacher.department.name || '',
              schedules[0].reason
            );

          const commonName = 'Giay-xin-thay-doi-gio-giang';
          const teacherName = StringHelper.toLatinText(teacher.name)
            .split(' ')
            .join('-');
          const fileName = `${commonName}_${teacherName}.docx`;

          this.exportService.exportBlob({
            document,
            name: fileName,
            mimeType: FileType.WORD,
          });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
