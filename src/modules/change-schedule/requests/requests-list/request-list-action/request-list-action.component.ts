import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { IconConstant } from '@shared/constants/components/icon.constant';
import { Observable, Subject } from 'rxjs';
import * as fromRequests from '../../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { filter, map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ChangeSchedule, Nullable, Teacher } from '@shared/models';
import {
  ObservableHelper,
  PermissionHelper,
  StringHelper,
} from '@shared/helpers';
import { ExportService } from '@services/export.service';
import { TokenService } from '@services/core/token.service';
import { DatePipe } from '@angular/common';
import { FileType } from '@shared/enums';
import { DialogService } from '@services/dialog/dialog.service';
import { TeacherService } from '@services/teacher.service';

@Component({
  selector: 'tss-request-list-action',
  templateUrl: './request-list-action.component.html',
  styleUrls: ['./request-list-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestListActionComponent extends BaseComponent {
  /** INPUT */
  @Input() public schedule!: ChangeSchedule;
  @Input() public canCancel!: boolean;

  /** PUBLIC PROPERTIES */
  public showLoader = false;
  public readonly export$ = new Subject();
  public readonly cancel$ = new Subject();
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
    private readonly dialogService: DialogService,
    private readonly store: Store<fromRequests.RequestsState>,
    @Inject(Injector) injector: Injector,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.export$, this.cancel$]);

    this.datePipe = injector.get(
      this.tokenService.getToken<DatePipe>('datePipe')
    );

    this.requesting$ = store
      .select(fromRequests.selectRequestQueue)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));
    this.teacher$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(takeUntil(this.destroy$));
    this.nameTitle$ = appShellStore
      .select(fromAppShell.selectNameTitle)
      .pipe(takeUntil(this.destroy$));

    this.handleExport();
    this.handleCancel();
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
                  fromRequests.cancel({ id: this.schedule.id })
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
            ) ?? this.schedule.newSchedule.date;
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
      this.schedule,
      this.schedule.teacher.name ?? teacher?.name,
      teacher?.department.name || ''
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
    const fileName = `${commonName}_${teacherName}_${createdAt}}.docx`;

    this.exportService.exportBlob({
      document,
      name: fileName,
      mimeType: FileType.WORD,
    });
  }
}
