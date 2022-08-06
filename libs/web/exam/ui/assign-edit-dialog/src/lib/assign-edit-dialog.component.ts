import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  TuiAlertService,
  TuiAppearance,
  tuiButtonOptionsProvider,
  TuiDialogContext,
  TuiNotification,
  TUI_TEXTFIELD_APPEARANCE,
} from '@taiga-ui/core';
import {
  ExamScheduleModel,
  UpdateExamModel,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { tap } from 'rxjs';
import { AssignEditExamDialogStore } from './store';

@Component({
  templateUrl: './assign-edit-dialog.component.html',
  styleUrls: ['./assign-edit-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 'm',
    }),
    {
      provide: TUI_TEXTFIELD_APPEARANCE,
      useValue: TuiAppearance.Textfield,
    },
  ],
})
export class AssignEditDialogComponent {
  /** PUBLIC PROPERTIES */
  form!: FormGroup;
  readonly status$ = this.store.status$;
  readonly rooms$ = this.store.rooms$;

  /** GETTERS */
  private get roomControl(): FormControl {
    return this.form.controls['idRoom'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<string, ExamScheduleModel>,
    private readonly store: AssignEditExamDialogStore,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService
  ) {
    this.initForm();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  confirm(): void {
    this.store.update({
      examId: this.context.data.id,
      body: this.form.value as UpdateExamModel,
    });
  }

  cancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      idRoom: ['', Validators.required],
    });
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
              this.context.completeWith(this.roomControl.value);
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
