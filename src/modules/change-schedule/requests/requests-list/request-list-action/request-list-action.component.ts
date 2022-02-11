import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  Injector,
  Input,
} from '@angular/core';
import { IconConstant } from '@shared/constants/components/icon.constant';
import { Observable, Subject } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ChangeSchedule } from '@shared/models';
import { PermissionHelper, StringHelper } from '@shared/helpers';
import { ExportService } from '@services/export.service';
import { TokenService } from '@services/core/token.service';
import { DatePipe } from '@angular/common';
import { FileType } from '@shared/enums';

@Component({
  selector: 'tss-request-list-action',
  templateUrl: './request-list-action.component.html',
  styleUrls: ['./request-list-action.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestListActionComponent extends BaseComponent {
  /** INPUT */
  @Input() public schedule!: ChangeSchedule;

  /** PUBLIC PROPERTIES */
  public readonly permissions$: Observable<number[]>;
  public readonly export$ = new Subject();
  public readonly IconConstant = IconConstant;

  /** PRIVATE PROPERTIES */
  private readonly datePipe: DatePipe;

  /** CONSTRUCTOR */
  constructor(
    private readonly exportService: ExportService,
    private readonly tokenService: TokenService,
    @Inject(Injector) injector: Injector,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.datePipe = injector.get(
      this.tokenService.getToken<DatePipe>('datePipe')
    );

    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.handleExport();
  }

  /** PRIVATE METHODS */
  private handleExport(): void {
    this.export$
      .pipe(
        withLatestFrom(this.permissions$),
        map(({ 1: permissions }) => permissions),
        tap((permissions) => {
          if (PermissionHelper.getRole(permissions) === 'roomManager') {
            this.exportForRoomManager();
          } else {
            this.exportForTeacher();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private exportForRoomManager(): void {
    const document = this.exportService.exportChangeScheduleRequestForTeacher(
      this.schedule
    );

    const commonName = 'Giay-dang-ly-phong-hoc';
    const teacherName = `${commonName}_${StringHelper.toLatinText(
      this.schedule.teacher
    )
      .split(' ')
      .join('-')}`;
    const time =
      this.datePipe.transform(this.schedule.newSchedule.date, 'dd-MM-Y') ?? '';
    const fileName = `${commonName}_${teacherName}_${time}.docx`;

    this.exportService.exportBlob({
      document,
      name: fileName,
      mimeType: FileType.WORD,
    });
  }

  private exportForTeacher(): void {
    const document = this.exportService.exportChangeScheduleRequestForTeacher(
      this.schedule
    );

    const commonName = 'Giay-xin-thay-doi-gio-giang';
    const teacherName = `${commonName}_${StringHelper.toLatinText(
      this.schedule.teacher
    )
      .split(' ')
      .join('-')}`;
    const timeRequest =
      this.datePipe.transform(this.schedule.timeRequest, 'dd-MM-Y') ?? '';
    const fileName = `${commonName}_${teacherName}_${timeRequest}.docx`;

    this.exportService.exportBlob({
      document,
      name: fileName,
      mimeType: FileType.WORD,
    });
  }
}
