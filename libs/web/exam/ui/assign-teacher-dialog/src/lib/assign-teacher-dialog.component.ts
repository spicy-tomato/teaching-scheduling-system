import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  TuiDestroyService,
  TuiIdentityMatcher,
  TuiStringHandler,
} from '@taiga-ui/cdk';
import {
  TuiAlertService,
  tuiButtonOptionsProvider,
  TuiDialogContext,
  TuiNotification,
} from '@taiga-ui/core';
import { tuiItemsHandlersProvider } from '@taiga-ui/kit';
import {
  ExamScheduleModel,
  SimpleModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  AppShellState,
  selectTeachersInDepartment,
} from '@teaching-scheduling-system/web/shared/data-access/store';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { takeUntil, tap } from 'rxjs';
import { AssignTeacherDialogStore } from './store';

const STRINGIFY_TEACHER: TuiStringHandler<SimpleModel> = (item) => item.name;
const ID_MATCHER_TEACHER: TuiIdentityMatcher<SimpleModel> = (
  item1: SimpleModel,
  item2: SimpleModel
) => item1.id === item2.id;

@Component({
  templateUrl: './assign-teacher-dialog.component.html',
  styleUrls: ['./assign-teacher-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    AssignTeacherDialogStore,
    TuiDestroyService,
    tuiItemsHandlersProvider({
      stringify: STRINGIFY_TEACHER,
      identityMatcher: ID_MATCHER_TEACHER,
    }),
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 'm',
    }),
  ],
})
export class AssignTeacherDialogComponent {
  /** PUBLIC PROPERTIES */
  public readonly formControl = new FormControl([]);
  public readonly status$ = this.store.status$;
  public readonly teachers$ = this.appShellStore
    .select(selectTeachersInDepartment)
    .pipe(takeUntil(this.destroy$));

  /** CONSTRUCTOR */
  constructor(
    private readonly store: AssignTeacherDialogStore,
    private readonly appShellStore: Store<AppShellState>,
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<string[], ExamScheduleModel>,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly destroy$: TuiDestroyService
  ) {
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
          if (status === 'successful') {
            this.alertService
              .open(
                `Đã cập nhật thành công phòng thi ${this.context.data.name}`,
                { status: TuiNotification.Success }
              )
              .subscribe();
            setTimeout(() => {
              this.context.completeWith(
                (this.formControl.value as SimpleModel[]).map((x) => x.name)
              );
            });
          } else if (status === 'systemError') {
            this.alertService
              .open('Vui lòng thử lại sau', {
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
