import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { ExamScheduleModel, SimpleModel } from '@shared/models';
import { TuiStringHandler, TuiIdentityMatcher } from '@taiga-ui/cdk';
import {
  TuiAppearance,
  TuiDialogContext,
  TuiNotification,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import { takeUntil, tap } from 'rxjs/operators';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { AssignExamDialogStore } from './state';
import { EApiStatus } from '@shared/enums';

const STRINGIFY_TEACHER: TuiStringHandler<SimpleModel> = (item) => item.name;
const ID_MATCHER_TEACHER: TuiIdentityMatcher<SimpleModel> = (
  item1: SimpleModel,
  item2: SimpleModel
) => item1.id === item2.id;

@Component({
  templateUrl: './assign-exam-dialog.component.html',
  styleUrls: ['./assign-exam-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AssignExamDialogStore,
    tuiItemsHandlersProvider({
      stringify: STRINGIFY_TEACHER,
      identityMatcher: ID_MATCHER_TEACHER,
    }),
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
export class AssignExamDialogComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public readonly formControl = new FormControl([]);
  public readonly status$ = this.store.status$;
  public readonly teachers$ = this.appShellStore
    .select(fromAppShell.selectTeachersInDepartment)
    .pipe(takeUntil(this.destroy$));
  public readonly EApiStatus = EApiStatus;

  /** CONSTRUCTOR */
  constructor(
    private readonly store: AssignExamDialogStore,
    private readonly appShellStore: Store<fromAppShell.AppShellState>,
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<string[], ExamScheduleModel>,
    @Inject(TuiNotificationsService)
    private readonly notificationService: TuiNotificationsService
  ) {
    super();

    this.loadTeachers();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  public onConfirm(): void {
    this.store.updateProctor({
      examId: this.context.data.id,
      teachersId: (this.formControl.value as SimpleModel[]).map((x) => x.id),
    });
  }

  public onCancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  /** PRIVATE METHODS */
  private loadTeachers(): void {
    this.teachers$
      .pipe(
        tap((teachers) => {
          this.formControl.setValue(
            teachers.filter((t) => this.context.data.teachers.includes(t.name))
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleStatusChange(): void {
    this.status$
      .pipe(
        tap((status) => {
          if (status === EApiStatus.successful) {
            this.notificationService
              .show(
                `Đã cập nhật thành công phòng thi ${this.context.data.name}`,
                { status: TuiNotification.Success }
              )
              .subscribe();
            setTimeout(() => {
              this.context.completeWith(
                (this.formControl.value as SimpleModel[]).map((x) => x.name)
              );
            });
          } else if (status === EApiStatus.systemError) {
            this.notificationService
              .show('Vui lòng thử lại sau', {
                label: 'Lỗi hệ thống!',
                status: TuiNotification.Error,
              })
              .subscribe();
          }
        })
      )
      .subscribe();
  }
}
