import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TuiDestroyService } from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiNotification,
} from '@taiga-ui/core';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { EjsScheduleModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { sameGroupStaticValueValidator } from '@teaching-scheduling-system/web/shared/utils/validators';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map, takeUntil, tap } from 'rxjs';
import { ExamDialogStore } from './store';

@Component({
  templateUrl: './exam-dialog.component.html',
  styleUrls: ['./exam-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ExamDialogStore, TuiDestroyService],
})
export class ExamDialogComponent {
  /** PUBLIC PROPERTIES */
  public readonly notAllowFieldHint =
    'Không thể thay đổi thông tin của lịch thi';
  public readonly noteMaxLength = CoreConstant.NOTE_MAX_LENGTH;
  public readonly showLoader$ = this.store.status$.pipe(
    map((s) => s === 'loading')
  );
  public form!: FormGroup;

  /** PRIVATE PROPERTIES */
  private needUpdateAfterClose = false;

  /** GETTERS */
  private get idControl(): FormControl {
    return this.form.controls['id'] as FormControl;
  }

  public get peopleControl(): FormArray {
    return this.form.controls['people'] as FormArray;
  }

  public get changeControl(): FormGroup {
    return this.form.controls['change'] as FormGroup;
  }

  private get noteControl(): FormControl {
    return this.changeControl.controls['note'] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<string, EjsScheduleModel>,
    private readonly fb: FormBuilder,
    @Inject(TuiAlertService)
    private readonly alertService: TuiAlertService,
    private readonly store: ExamDialogStore,
    private readonly destroy$: TuiDestroyService
  ) {
    this.initForm(context.data);
    this.handleSubmitStatus();
  }

  /** PUBLIC METHODS */
  public submit(): void {
    this.store.submit({
      id: this.idControl.value,
      note: this.noteControl.value,
    });
  }

  public onCancel(): void {
    setTimeout(() => {
      if (this.needUpdateAfterClose) {
        this.context.completeWith(this.noteControl.value);
      } else {
        this.context.$implicit.complete();
      }
    });
  }

  /** PRIVATE METHODS */
  private initForm(data?: EjsScheduleModel): void {
    const startDate = data?.StartTime as Date;
    const endDate = data?.EndTime as Date;
    const today = new Date();
    const startTuiDate = startDate
      ? DateHelper.toTuiDay(startDate)
      : DateHelper.toTuiDay(today);
    const endTuiDate = endDate
      ? DateHelper.toTuiDay(endDate)
      : DateHelper.toTuiDay(today);

    const initialChange = {
      note: data?.Note ?? '',
    };

    this.form = this.fb.group({
      id: [data?.Id],
      subject: [data?.Subject],
      location: [data?.Location],
      method: [data?.Method],
      people: this.fb.array(data?.People?.map((x) => this.fb.control(x)) ?? []),
      start: [[startTuiDate, DateHelper.beautifyTime(startDate ?? today)]],
      end: [[endTuiDate, DateHelper.beautifyTime(endDate ?? today)]],
      change: this.fb.group(
        {
          note: [initialChange.note, Validators.maxLength(this.noteMaxLength)],
        },
        { validators: sameGroupStaticValueValidator(initialChange) }
      ),
    });
  }

  private handleSubmitStatus(): void {
    this.store.status$
      .pipe(
        tap((status) => {
          if (status === 'successful') {
            this.needUpdateAfterClose = true;
            this.changeControl.setValidators(
              sameGroupStaticValueValidator(this.changeControl.value)
            );
            this.changeControl.updateValueAndValidity();
            this.showNotificationUpdateSuccessful();
          } else if (status === 'systemError') {
            this.showNotificationError();
          }
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private showNotificationUpdateSuccessful(): void {
    this.alertService
      .open('Cập nhật lịch thi thành công!', {
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private showNotificationError(): void {
    this.alertService
      .open('Vui lòng thử lại sau', {
        label: 'Đã có lỗi xảy ra',
        status: TuiNotification.Error,
      })
      .subscribe();
  }
}
