import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { tuiButtonOptionsProvider, TuiDialogService } from '@taiga-ui/core';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { StringHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { FileType } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ChangeSchedule,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { ExportService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { RequestStore } from '@teaching-scheduling-system/web/teaching-schedule/data-access';
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
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 's',
    }),
  ],
})
export class ChangeRequestFilterComponent {
  // PUBLIC PROPERTIES
  readonly exportMultiple$ = new Subject<void>();
  readonly IconConstant = IconConstant;
  readonly exportSchedule$: Observable<ChangeSchedule[]>;
  readonly isPersonal: boolean;

  // PRIVATE PROPERTIES
  private readonly teacher$: Observable<Teacher>;
  private dialog$!: Observable<void>;

  // CONSTRUCTOR
  constructor(
    private readonly exportService: ExportService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService) private readonly dialogService: TuiDialogService,
    private readonly destroy$: TuiDestroyService,
    route: ActivatedRoute,
    store: RequestStore
  ) {
    this.teacher$ = store.teacher$;
    this.exportSchedule$ = store.exportSchedule$;

    this.isPersonal = route.snapshot.data['personal'] as boolean;

    this.initDialog();
    this.handleExportMultiple();
  }

  // PUBLIC METHODS
  onExport(): void {
    this.dialog$.subscribe();
  }

  // PRIVATE METHODS
  private initDialog(): void {
    this.dialog$ = this.dialogService.open(
      new PolymorpheusComponent(ChangeReportDialogComponent, this.injector),
      {
        label: 'Xuất báo cáo thay đổi giờ giảng',
        dismissible: false,
      }
    );
  }

  private handleExportMultiple(): void {
    this.exportMultiple$
      .pipe(
        withLatestFrom(this.exportSchedule$, this.teacher$),
        tap(({ 1: schedules, 2: teacher }) => {
          const document =
            this.exportService.exportChangeScheduleRequestForTeacher(
              schedules,
              teacher.name,
              teacher.department?.name || '',
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
