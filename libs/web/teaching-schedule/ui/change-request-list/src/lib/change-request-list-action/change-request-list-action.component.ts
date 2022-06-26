import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { TuiDestroyService } from '@taiga-ui/cdk';
import { TuiDialogService } from '@taiga-ui/core';
import { IconConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import {
  ObservableHelper,
  PermissionHelper,
  StringHelper,
} from '@teaching-scheduling-system/core/utils/helpers';
import { DialogService } from '@teaching-scheduling-system/web-shared-ui-dialog';
import { FileType } from '@teaching-scheduling-system/web/shared/data-access/enums';
import {
  ChangeSchedule,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  ExportService,
  TeacherService,
  TokenService,
} from '@teaching-scheduling-system/web/shared/data-access/services';
import {
  AppShellState,
  selectNameTitle,
  selectPermission,
  selectTeacher,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import {
  teachingScheduleRequestCancel,
  teachingScheduleRequestSelectRequestQueue,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { ChangeDetailsDialogComponent } from '@teaching-scheduling-system/web/teaching-schedule/ui/change-details-dialog';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import {
  filter,
  map,
  Observable,
  Subject,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

@Component({
  selector: 'tss-change-request-list-action',
  templateUrl: './change-request-list-action.component.html',
  styleUrls: ['./change-request-list-action.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class ChangeRequestListActionComponent {
  /** INPUT */
  @Input() public schedule!: ChangeSchedule;
  @Input() public canCancel!: boolean;

  /** PUBLIC PROPERTIES */
  public showLoader = false;
  public readonly export$ = new Subject<void>();
  public readonly cancel$ = new Subject<void>();
  public readonly IconConstant = IconConstant;

  public readonly requesting$: Observable<number[]>;

  /** PRIVATE PROPERTIES */
  private readonly datePipe: DatePipe;
  private readonly nameTitle$: Observable<string>;
  private readonly permissions$: Observable<number[]>;
  private readonly teacher$: Observable<Nullable<Teacher>>;

  /** CONSTRUCTOR */
  constructor(
    private readonly exportService: ExportService,
    private readonly teacherService: TeacherService,
    private readonly tokenService: TokenService,
    @Inject(Injector) private readonly injector: Injector,
    @Inject(TuiDialogService)
    private readonly tuiDialogService: TuiDialogService,
    private readonly dialogService: DialogService,
    private readonly store: Store<TeachingScheduleRequestState>,
    private readonly destroy$: TuiDestroyService,
    appShellStore: Store<AppShellState>
  ) {
    this.datePipe = injector.get(
      this.tokenService.getToken<DatePipe>('datePipe')
    );

    this.requesting$ = store
      .select(teachingScheduleRequestSelectRequestQueue)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(selectPermission)
      .pipe(takeUntil(this.destroy$));
    this.teacher$ = appShellStore
      .select(selectTeacher)
      .pipe(takeUntil(this.destroy$));
    this.nameTitle$ = appShellStore
      .select(selectNameTitle)
      .pipe(takeUntil(this.destroy$));

    this.handleExport();
    this.handleCancel();
  }

  /** PUBLIC METHODS */
  public showDetails(): void {
    this.tuiDialogService
      .open(
        new PolymorpheusComponent(ChangeDetailsDialogComponent, this.injector),
        {
          data: this.schedule,
          label: 'Chi tiết yêu cầu thay đổi giờ giảng',
        }
      )
      .subscribe();
  }

  /** PRIVATE METHODS */
  private handleExport(): void {
    this.export$
      .pipe(
        withLatestFrom(this.permissions$, this.teacher$),
        map(({ 1: permissions, 2: teacher }) => ({ permissions, teacher })),
        tap(({ permissions, teacher }) => {
          if (PermissionHelper.getRole(permissions) === 'roomManager') {
            this.exportForRoomManager();
          } else {
            this.exportForTeacher(teacher);
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleCancel(): void {
    this.cancel$
      .pipe(
        withLatestFrom(this.nameTitle$),
        map(({ 1: title }) => title),
        tap((title) => {
          this.dialogService
            .showConfirmDialog({
              header: `${title} có chắc chắn muốn hủy yêu cầu này không?`,
              positive: 'Có',
              negative: 'Không',
            })
            .pipe(
              filter((x) => x),
              tap(() => {
                this.store.dispatch(
                  teachingScheduleRequestCancel({ id: this.schedule.id })
                );
              })
            )
            .subscribe();
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private exportForRoomManager(): void {
    this.teacherService
      .getTeacherInfo(this.schedule.teacher.id)
      .pipe(
        ObservableHelper.filterNullish(),
        tap((response) => {
          const document =
            this.exportService.exportChangeScheduleRequestForRoomManager(
              this.schedule,
              response.data
            );

          const commonName = 'Giay-dang-ky-phong-hoc';
          const teacherName = StringHelper.toLatinText(
            this.schedule.teacher.name
          )
            .split(' ')
            .join('-');
          const time =
            this.datePipe.transform(
              this.schedule.newSchedule.date,
              'dd-MM-Y'
            ) ??
            this.schedule.newSchedule.date ??
            '';
          const fileName = `${commonName}_${teacherName}_${time}.docx`;

          this.exportService.exportBlob({
            document,
            name: fileName,
            mimeType: FileType.WORD,
          });
        })
      )
      .subscribe();
  }

  private exportForTeacher(teacher: Nullable<Teacher>): void {
    const document = this.exportService.exportChangeScheduleRequestForTeacher(
      [this.schedule],
      this.schedule.teacher.name ?? teacher?.name,
      teacher?.department.name || '',
      this.schedule.reason
    );

    const commonName = 'Giay-xin-thay-doi-gio-giang';
    const teacherName = StringHelper.toLatinText(
      this.schedule.teacher.name ?? teacher?.name
    )
      .split(' ')
      .join('-');
    const createdAt =
      this.datePipe.transform(this.schedule.createdAt, 'dd-MM-Y') ??
      this.schedule.createdAt.toDateString();
    const fileName = `${commonName}_${teacherName}_${createdAt}.docx`;

    this.exportService.exportBlob({
      document,
      name: fileName,
      mimeType: FileType.WORD,
    });
  }
}
