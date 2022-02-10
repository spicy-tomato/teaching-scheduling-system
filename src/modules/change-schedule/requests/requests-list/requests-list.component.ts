import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { PermissionConstant, TableConstant } from '@shared/constants';
import { EApiStatus } from '@shared/enums';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleStatus,
} from '@shared/models';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';
import * as fromRequests from '../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Document } from 'docx';
import { ArrayHelper, StringHelper } from '@shared/helpers';
import { IconConstant } from '@shared/constants/components/icon.constant';
import { ActivatedRoute } from '@angular/router';
import { ExportService } from '@services/export.service';

@Component({
  selector: 'tss-requests-list',
  templateUrl: './requests-list.component.html',
  styleUrls: ['./requests-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestsListComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public columns: string[] = [];

  public readonly data$: Observable<ChangeSchedule[]>;
  public readonly status$: Observable<ChangeScheduleStatus>;
  public readonly page$: Observable<number>;
  public readonly options$: Observable<ChangeScheduleOptions>;
  public readonly permissions$: Observable<number[]>;

  public readonly personal: boolean;

  public readonly EApiStatus = EApiStatus;
  public readonly itemsPerPage = TableConstant.REQUESTS_LIST_ITEMS_PER_PAGE;
  public readonly IconConstant = IconConstant;
  public readonly PermissionConstant = PermissionConstant;
  public readonly initialColumns = [
    'index',
    'teacher',
    'moduleClass',
    'oldDate',
    'newDate',
    'oldShift',
    'newShift',
    'oldRoom',
    'newRoom',
    'reason',
    'timeRequest',
    'timeAccept',
    'timeSetRoom',
    'status',
    'actions',
  ];

  /** CONSTRUCTOR */
  constructor(
    private readonly exportService: ExportService,
    store: Store<fromRequests.RequestsState>,
    appShellStore: Store<fromAppShell.AppShellState>,
    route: ActivatedRoute
  ) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.data$ = store
      .select(fromRequests.selectChangeSchedules)
      .pipe(takeUntil(this.destroy$));
    this.status$ = store
      .select(fromRequests.selectStatus)
      .pipe(takeUntil(this.destroy$));
    this.page$ = store
      .select(fromRequests.selectPage)
      .pipe(takeUntil(this.destroy$));
    this.permissions$ = appShellStore
      .select(fromAppShell.selectPermission)
      .pipe(takeUntil(this.destroy$));

    this.personal = route.snapshot.data['personal'] as boolean;

    if (this.personal) {
      this.configureColumns();
    }

    this.handleOptionsChange();
  }

  /** PUBLIC METHODS */
  public onExport(schedule: ChangeSchedule, timeRequest: string): void {
    const document =
      this.exportService.exportChangeScheduleRequestForTeacher(schedule);
    this.exportBlob(document, schedule.teacher, timeRequest);
  }

  /** PRIVATE METHODS */
  private configureColumns(): void {
    ArrayHelper.removeAt(this.initialColumns, 1);
  }

  private handleOptionsChange(): void {
    this.options$
      .pipe(
        map((option) => option.showReason),
        distinctUntilChanged(),
        tap((showReason) => {
          if (showReason) {
            this.columns = this.initialColumns;
          } else {
            this.columns = this.initialColumns.filter((x) => x !== 'reason');
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private exportBlob(doc: Document, name: string, timeRequest: string): void {
    const commonName = 'Giay-xin-thay-doi-gio-giang';
    const teacherName = `${commonName}_${StringHelper.toLatinText(name)
      .split(' ')
      .join('-')}`;
    const fileName = `${commonName}_${teacherName}_${timeRequest}.docx`;

    this.exportService.exportBlob({
      doc,
      name: fileName,
      mimeType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }
}
