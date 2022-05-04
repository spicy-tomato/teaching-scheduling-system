import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BaseComponent } from '@modules/core/base/base.component';
import { Store } from '@ngrx/store';
import { CoreConstant, IconConstant } from '@shared/constants';
import { ObjectHelper, ObservableHelper, StringHelper } from '@shared/helpers';
import {
  ChangeSchedule,
  ChangeScheduleOptions,
  ChangeScheduleOptionsParam,
  SimpleModel,
  Teacher,
} from '@shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import * as fromRequests from '../state';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { TUI_BUTTON_OPTIONS, TuiAppearance } from '@taiga-ui/core';
import { ExportService } from '@services/export.service';
import { FileType } from '@shared/enums';

@Component({
  selector: 'tss-requests-options',
  templateUrl: './requests-options.component.html',
  styleUrls: ['./requests-options.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 'm',
      },
    },
  ],
})
export class RequestsOptionsComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public options$: Observable<ChangeScheduleOptions>;
  public department$: Observable<SimpleModel>;
  public exportSchedule$: Observable<ChangeSchedule[]>;
  public isPersonal: boolean;
  public exportMultiple$ = new Subject();

  public readonly IconConstant = IconConstant;
  public readonly statusList = CoreConstant.REQUEST_CHANGE_SCHEDULE_STATUS;
  public readonly statusArray = ObjectHelper.toArray(this.statusList, {
    uniqueValue: true,
  }).sort((a, b) => (a.id as number) - (b.id as number));

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Teacher>;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: Store<fromRequests.RequestsState>,
    private readonly exportService: ExportService,
    route: ActivatedRoute,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.options$ = store
      .select(fromRequests.selectOptions)
      .pipe(takeUntil(this.destroy$));
    this.exportSchedule$ = store
      .select(fromRequests.selectExportSchedule)
      .pipe(takeUntil(this.destroy$));
    this.department$ = appShellStore
      .select(fromAppShell.selectDepartment)
      .pipe(ObservableHelper.filterNullish(), takeUntil(this.destroy$));
    this.teacher$ = appShellStore.pipe(
      fromAppShell.selectNotNullTeacher,
      takeUntil(this.destroy$)
    );

    this.isPersonal = route.snapshot.data['personal'] as boolean;

    if (!this.isPersonal) {
      this.triggerLoadTeachersList();
    }
    this.handleExportMultiple();
  }

  /** PUBLIC METHODS */
  public changeOptions(options: ChangeScheduleOptionsParam): void {
    this.store.dispatch(fromRequests.changeOptions({ options }));
  }

  /** PRIVATE METHODS */
  private triggerLoadTeachersList(): void {
    this.department$
      .pipe(
        tap((department) => {
          this.store.dispatch(
            fromRequests.loadTeachersList({ dep: department.id })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
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
