import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BaseComponent } from '@modules/core/base/base.component';
import { ExamScheduleModel, UpdateExamModel } from '@shared/models';
import {
  TUI_BUTTON_OPTIONS,
  TuiAppearance,
  TuiDialogContext,
  TuiNotificationsService,
  TuiNotification,
  TUI_TEXTFIELD_APPEARANCE,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { Observable } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { takeUntil, tap } from 'rxjs/operators';
import { EditExamDialogStore } from './state';
import { EApiStatus } from '@shared/enums';

@Component({
  templateUrl: './edit-exam-dialog.component.html',
  styleUrls: ['./edit-exam-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    EditExamDialogStore,
    {
      provide: TUI_BUTTON_OPTIONS,
      useValue: {
        shape: null,
        appearance: TuiAppearance.Primary,
        size: 'm',
      },
    },
    {
      provide: TUI_TEXTFIELD_APPEARANCE,
      useValue: TuiAppearance.Textfield,
    },
  ],
})
export class EditExamDialogComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly rooms$: Observable<string[]>;
  public readonly EApiStatus = EApiStatus;
  public readonly status$ = this.store.status$;

  /** GETTERS */
  private get roomControl(): FormControl {
    return this.form.controls['idRoom'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<string, ExamScheduleModel>,
    private readonly store: EditExamDialogStore,
    @Inject(TuiNotificationsService)
    private readonly notificationService: TuiNotificationsService,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.rooms$ = appShellStore
      .select(fromAppShell.selectRooms)
      .pipe(takeUntil(this.destroy$));

    this.initForm();
    this.handleStatusChange();
  }

  /** PUBLIC METHODS */
  public confirm(): void {
    this.store.update({
      examId: this.context.data.id,
      body: this.form.value as UpdateExamModel,
    });
  }

  public cancel(): void {
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
          if (status === EApiStatus.successful) {
            this.notificationService
              .show(
                `Đã cập nhật thành công phòng thi ${this.context.data.name}`,
                { status: TuiNotification.Success }
              )
              .subscribe();
            setTimeout(() => {
              this.context.completeWith(this.roomControl.value);
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
