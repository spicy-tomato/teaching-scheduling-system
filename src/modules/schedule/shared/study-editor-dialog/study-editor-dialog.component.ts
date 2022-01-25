import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '@services/schedule.service';
import {
  TuiAppearance,
  TuiDialogContext,
  TuiNotification,
  TuiNotificationsService,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { DateHelper } from '@shared/helpers';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { EjsScheduleModel } from 'src/shared/models';
import { CoreConstant } from '@shared/constants';
import { sameValueValidator } from 'src/shared/validators';
import { TuiDay } from '@taiga-ui/cdk';
import { sqlDateFactory } from '@shared/factories';
import { catchError, finalize, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';

type Change = {
  note: string;
};

@Component({
  templateUrl: './study-editor-dialog.component.html',
  styleUrls: ['./study-editor-dialog.component.scss'],
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
export class StudyEditorDialogComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public requestingChangeSchedule = false;
  public sendingRequest = false;
  public sendingChange = false;
  public validRequestChangeSchedule!: boolean;
  public firstDateAllowRequestChange!: Date;

  public readonly shifts = CoreConstant.SHIFTS;
  public readonly shiftKeys = Object.keys(CoreConstant.SHIFTS);
  public readonly noteMaxLength = 1000;
  public readonly reasonMaxLength = 500;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly cdr: ChangeDetectorRef,
    private readonly scheduleService: ScheduleService,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<boolean, EjsScheduleModel>,
    @Inject(TuiNotificationsService)
    private readonly notificationsService: TuiNotificationsService
  ) {
    this.initForm(context.data);
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    this.sendingRequest = true;

    const idSchedule = this.form.controls['id'].value as number;
    const request = this.form.controls['request'] as FormGroup;
    const newIdRoom = (request.controls['online'].value as boolean)
      ? 'PHTT'
      : null;
    const newShift = request.controls['shift'].value as string;
    const newDate = DateHelper.toDateOnlyString(
      (request.controls['date'].value as TuiDay).toLocalNativeDate()
    );
    const reason = request.controls['reason'].value as string;

    this.scheduleService
      .requestChangeSchedule({
        idSchedule,
        newDate,
        newIdRoom,
        newShift,
        reason,
        timeRequest: sqlDateFactory(),
      })
      .pipe(
        tap(() => {
          this.showNotificationRequestChangeSuccessful();
        }),
        catchError(() => {
          this.showNotificationError();
          return of(EMPTY);
        }),
        finalize(() => {
          this.sendingRequest = false;
          this.requestingChangeSchedule = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe();
  }

  public toggleRequestArea(open: boolean): void {
    this.requestingChangeSchedule = open;
  }

  public onUpdate(): void {
    this.sendingChange = true;
    const note = (this.form.controls['change'] as FormGroup).controls['note']
      .value as string;
    const id = this.form.controls['id'].value as number;

    this.scheduleService
      .updateStudyNote({ id, note })
      .pipe(
        tap(() => {
          this.showNotificationUpdateSuccessful();
          const change = { note };
          (this.form.controls['change'] as FormGroup) =
            this.getNewChangeControl(change);
          this.sendingChange = false;
          this.cdr.markForCheck();
        }),
        catchError(() => {
          this.showNotificationError();
          return of(EMPTY);
        })
      )
      .subscribe();
  }

  public onCancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  /** PRIVATE METHODS */
  private initForm(data: EjsScheduleModel): void {
    const startDate = data.StartTime as Date;
    const endDate = data.EndTime as Date;
    const today = new Date();
    const startTuiDate = startDate
      ? DateHelper.toTuiDay(startDate)
      : DateHelper.toTuiDay(today);
    const endTuiDate = endDate
      ? DateHelper.toTuiDay(endDate)
      : DateHelper.toTuiDay(today);
    const room = data.Location;

    const initialRequest = {
      date: startTuiDate,
      shift: data.Shift ?? '1',
      online: room === 'PHTT',
    };

    const initialChange = {
      note: data.Note ?? '',
    };

    this.form = this.fb.group({
      id: [data.Id],
      subject: [data.Subject],
      location: [room],
      people: [data.People?.[0]],
      start: [[startTuiDate, DateHelper.beautifyTime(startDate ?? today)]],
      end: [[endTuiDate, DateHelper.beautifyTime(endDate ?? today)]],
      request: this.fb.group(
        {
          shift: [initialRequest.shift],
          date: [initialRequest.date, Validators.required],
          online: [initialRequest.online],
          reason: [
            '',
            [Validators.required, Validators.maxLength(this.reasonMaxLength)],
          ],
        },
        {
          validators: sameValueValidator(initialRequest),
        }
      ),
      change: this.getNewChangeControl(initialChange),
    });

    const todayToZero = DateHelper.dateAtZero(today);
    this.firstDateAllowRequestChange =
      startDate < todayToZero
        ? DateHelper.subtract(todayToZero, 3)
        : todayToZero;
    this.validRequestChangeSchedule =
      true ||
      (startDate > this.firstDateAllowRequestChange &&
        data.People?.[0] === 'self');
  }

  private showNotificationRequestChangeSuccessful(): void {
    this.notificationsService
      .show('Hãy chờ phản hồi của trưởng bộ môn', {
        label: 'Gửi yêu cầu thành công',
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private showNotificationUpdateSuccessful(): void {
    this.notificationsService
      .show('Cập nhật lịch thành công!', {
        status: TuiNotification.Success,
      })
      .subscribe();
  }

  private showNotificationError(): void {
    this.notificationsService
      .show('Hãy thử lại sau', {
        label: 'Đã có lỗi xảy ra',
        status: TuiNotification.Error,
      })
      .subscribe();
  }

  private getNewChangeControl(value: Change): FormGroup {
    return this.fb.group(
      {
        note: [value.note],
      },
      {
        validators: sameValueValidator(value),
      }
    );
  }
}
