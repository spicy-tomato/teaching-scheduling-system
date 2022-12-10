import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TuiIdentityMatcher, TuiStringHandler } from '@taiga-ui/cdk';
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
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { of, switchMap, tap } from 'rxjs';
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
  // PUBLIC PROPERTIES
  readonly formControl = new FormControl([]);
  readonly status$ = this.store.status$;
  readonly teachers$ = this.store.teachers$;

  // CONSTRUCTOR
  constructor(
    private readonly store: AssignTeacherDialogStore,
    @Inject(POLYMORPHEUS_CONTEXT)
    public readonly context: TuiDialogContext<string[], ExamScheduleModel>,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService
  ) {
    this.loadTeachers();
    this.handleStatusChange();
  }

  // PUBLIC METHODS
  onConfirm(): void {
    this.store.updateProctor({
      examId: this.context.data.id,
      teachersId: (this.formControl.value as SimpleModel[]).map(({ id }) => id),
    });
  }

  onCancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  // PRIVATE METHODS
  private loadTeachers(): void {
    this.teachers$
      .pipe(
        tap((teachers) => {
          this.formControl.setValue(
            teachers.filter(({ name }) =>
              this.context.data.teachers.includes(name)
            )
          );
        })
      )
      .subscribe();
  }

  private handleStatusChange(): void {
    this.status$
      .pipe(
        switchMap((status) => {
          if (status === 'successful') {
            setTimeout(() => {
              this.context.completeWith(
                (this.formControl.value as SimpleModel[]).map(
                  ({ name }) => name
                )
              );
            });
            return this.alertService.open(
              `Đã cập nhật thành công phòng thi ${this.context.data.name}`,
              { status: TuiNotification.Success }
            );
          }
          if (status === 'systemError') {
            return this.alertService.open('Vui lòng thử lại sau', {
              label: 'Lỗi hệ thống!',
              status: TuiNotification.Error,
            });
          }
          return of({});
        })
      )
      .subscribe();
  }
}
