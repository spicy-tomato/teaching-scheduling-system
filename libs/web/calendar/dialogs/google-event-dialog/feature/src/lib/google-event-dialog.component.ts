import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  TuiContextWithImplicit,
  TuiDay,
  TuiDestroyService,
  tuiPure,
  TuiStringHandler,
  TuiTime,
} from '@taiga-ui/cdk';
import {
  TuiAlertService,
  TuiDialogContext,
  TuiNotification,
} from '@taiga-ui/core';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { DialogService } from '@teaching-scheduling-system/web-shared-ui-dialog';
import { CalendarHelper } from '@teaching-scheduling-system/web/calendar/data-access';
import { GoogleCalendarDialogStore } from '@teaching-scheduling-system/web/calendar/dialogs/google-event-dialog/data-access';
import {
  EjsScheduleModel,
  GoogleCalendar,
  GoogleCalendarModel,
  GoogleDateTime,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { GoogleService } from '@teaching-scheduling-system/web/shared/data-access/services';
import { sameGroupStaticValueValidator } from '@teaching-scheduling-system/web/shared/utils/validators';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import {
  catchError,
  filter,
  map,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
  withLatestFrom,
} from 'rxjs';

type FormModel = {
  id: string;
  subject: string | undefined;
  location: string | undefined;
  start: TuiDay;
  end: TuiDay;
  startTime: TuiTime;
  endTime: TuiTime;
  note: string;
  isAllDay: boolean | undefined;
};

@Component({
  templateUrl: './google-event-dialog.component.html',
  styleUrls: ['./google-event-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GoogleCalendarDialogStore, TuiDestroyService],
})
export class GoogleEventDialogComponent {
  // PUBLIC PROPERTIES
  readonly showLoader$ = this.store.status$.pipe(map((s) => s === 'loading'));
  readonly googleCalendars$ = this.store.googleCalendars$;
  readonly remove$ = new Subject<void>();
  readonly readOnly: boolean;
  readonly isEditDialog: boolean;
  form!: FormGroup;

  // PRIVATE PROPERTIES
  private readonly teacher$ = this.store.teacher$;
  private readonly nameTitle$ = this.store.nameTitle$;
  private needUpdateAfterClose = false;

  // GETTERS
  private get calendarIdControl(): FormControl {
    return this.form.get('calendarId') as FormControl;
  }

  private get subjectControlValue(): string {
    return this.form.value['subject'];
  }

  private get locationControlValue(): string {
    return this.form.value['location'];
  }

  private get noteControlValue(): string {
    return this.form.value['note'];
  }

  get isAllDayControlValue(): boolean {
    return this.form.value['isAllDay'];
  }

  private get startDate(): string {
    return (this.form.value['start'] as TuiDay).toString('YMD', '-');
  }

  private get endDate(): string {
    return (this.form.value['end'] as TuiDay).toString('YMD', '-');
  }

  private get startTime(): string {
    const formValue = this.form.value;
    const startTime = (formValue['startTime'] as TuiTime).toString(
      'HH:MM:SS.MSS'
    );
    return `${this.startDate}T${startTime}`;
  }

  private get endTime(): string {
    const formValue = this.form.value;
    const endTime = (formValue['endTime'] as TuiTime).toString('HH:MM:SS.MSS');
    return `${this.endDate}T${endTime}`;
  }

  // CONSTRUCTOR
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      Partial<EjsScheduleModel> | boolean | void,
      GoogleCalendarModel
    >,
    private readonly fb: FormBuilder,
    private readonly googleService: GoogleService,
    private readonly tssDialogService: DialogService,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private readonly store: GoogleCalendarDialogStore,
    private readonly destroy$: TuiDestroyService
  ) {
    this.initForm(context.data);
    this.handleLoadGoogleCalendars();
    this.handleRemove();
    this.handleSubmitStatus();

    this.isEditDialog = !!context.data.Calendar;
    this.readOnly =
      this.isEditDialog &&
      CalendarHelper.googleCalendarIsReadonly(context.data.Calendar);
  }

  // PUBLIC METHODS
  submitCreate(): void {
    const { start, end } = this.getStartAndEnd();

    this.store.submitCreate({
      calendarId: this.calendarIdControl.value,
      body: {
        start: {
          ...start,
          timeZone: '+07:00',
        },
        end: {
          ...end,
          timeZone: '+07:00',
        },
        summary: this.subjectControlValue,
        description: this.noteControlValue,
        location: this.locationControlValue,
      },
    });
  }

  submitEdit(): void {
    const { start, end } = this.getStartAndEnd();
    const data = this.context.data;

    this.store.submitEdit({
      calendarId: data.Calendar.id,
      eventId: data.Id,
      body: {
        start: {
          ...start,
          timeZone: '+07:00',
        },
        end: {
          ...end,
          timeZone: '+07:00',
        },
        summary: this.subjectControlValue,
        description: this.noteControlValue,
        location: this.locationControlValue,
      },
    });
  }

  onCancel(shouldDelete = false): void {
    setTimeout(() => {
      if (shouldDelete) {
        this.context.completeWith(true);
        return;
      }
      if (this.isEditDialog && this.needUpdateAfterClose) {
        this.context.completeWith({
          Subject: this.subjectControlValue,
          Note: this.noteControlValue,
          Location: this.locationControlValue,
          StartTime: new Date(this.startTime),
          EndTime: new Date(this.endTime),
          IsAllDay: this.isAllDayControlValue,
        });
        return;
      }

      // TODO: Send response data to parent context
      if (!this.isEditDialog && this.needUpdateAfterClose) {
        this.context.completeWith({
          Subject: this.subjectControlValue,
          Note: this.noteControlValue,
          Location: this.locationControlValue,
          StartTime: new Date(this.startTime),
          EndTime: new Date(this.endTime),
          IsAllDay: this.isAllDayControlValue,
        });
        return;
      }

      this.context.$implicit.complete();
    });
  }

  @tuiPure
  stringifyGoogleCalendars(
    items: GoogleCalendar[]
  ): TuiStringHandler<TuiContextWithImplicit<string>> {
    const map = new Map(
      items.map(({ id, summary }) => [id, summary] as [string, string])
    );

    return ({ $implicit }) => map.get($implicit) || '';
  }

  // PRIVATE METHODS
  private initForm(data: GoogleCalendarModel): void {
    const startDate = data.StartTime as Date;
    const endDate = data.EndTime as Date;
    const today = new Date();
    const startTuiDate = startDate
      ? DateHelper.toTuiDay(startDate)
      : DateHelper.toTuiDay(today);
    const endTuiDate = endDate
      ? DateHelper.toTuiDay(endDate)
      : DateHelper.toTuiDay(today);
    const startTime = TuiTime.fromLocalNativeDate(startDate ?? today);
    const endTime = TuiTime.fromLocalNativeDate(endDate ?? today);

    const initialValue = {
      id: data.Id,
      calendarId: data.Calendar?.id || '',
      subject: data.Subject,
      location: data.Location || '',
      people: data.People || [],
      start: startTuiDate,
      end:
        startTuiDate.append({ day: 1 }).daySame(endTuiDate) &&
        startTime.valueOf() === 0 &&
        endTime.valueOf() === 0
          ? endTuiDate.append({ day: -1 })
          : endTuiDate,
      startTime,
      endTime,
      note: data.Note ?? '',
      isAllDay: data.IsAllDay,
    };
    const validators: Partial<Record<keyof typeof initialValue, ValidatorFn>> =
      {
        subject: Validators.required,
        location: Validators.required,
        note: Validators.required,
      };

    this.form = this.fb.group(
      {
        ...Object.entries(initialValue).reduce<
          Record<string, any[] | FormArray>
        >((acc, [key, value]) => {
          if (Array.isArray(value)) {
            acc[key] = this.fb.array(value.map((x) => this.fb.control(x)));
          } else {
            acc[key] = [value, validators[key as keyof typeof initialValue]];
          }
          return acc;
        }, {}),
      },
      {
        validators: this.isEditDialog ? this.formValidator(initialValue) : null,
      }
    );
  }

  private handleLoadGoogleCalendars(): void {
    this.googleCalendars$
      .pipe(
        tap((calendars) => {
          const primaryCalendar = calendars.find(
            (c) => c.accessRole === 'owner'
          );
          if (primaryCalendar) {
            this.calendarIdControl.setValue(primaryCalendar.id);
          }
        })
      )
      .subscribe();
  }

  private handleRemove(): void {
    this.remove$
      .pipe(
        withLatestFrom(this.teacher$, this.nameTitle$),
        switchMap(({ 1: { uuidAccount }, 2: nameTitle }) =>
          this.tssDialogService
            .showConfirmDialog({
              header: `${nameTitle} có chắc chắn muốn xóa sự kiện này không? Hành động này sẽ không thể hoàn tác.`,
              positive: 'Có',
              negative: 'Không',
            })
            .pipe(map((confirm) => ({ uuidAccount, confirm })))
        ),
        filter(({ confirm }) => confirm),
        switchMap(({ uuidAccount }) => {
          const data = this.context.data;
          return this.googleService.remove(
            uuidAccount,
            data.Calendar.id,
            data.Id
          );
        }),
        tap(() => {
          this.alertService
            .open('Xóa sự kiện thành công!', {
              status: TuiNotification.Success,
            })
            .subscribe();
          this.onCancel(true);
        }),
        catchError(() =>
          this.alertService.open('Vui lòng thử lại sau', {
            label: 'Đã có lỗi xảy ra',
            status: TuiNotification.Error,
          })
        ),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }

  private handleSubmitStatus(): void {
    this.store.status$
      .pipe(
        switchMap((status) => {
          if (status === 'successful') {
            let message;
            if (this.isEditDialog) {
              this.needUpdateAfterClose = true;
              this.form.setValidators(this.formValidator(this.form.value));
              this.form.updateValueAndValidity();
              message = 'Cập nhật lịch thành công!';
            } else {
              this.onCancel();
              this.needUpdateAfterClose = true;
              message = 'Tạo lịch thành công!';
            }
            return this.alertService.open(message, {
              status: TuiNotification.Success,
            });
          }
          if (status === 'systemError') {
            return this.alertService.open('Vui lòng thử lại sau', {
              label: 'Đã có lỗi xảy ra',
              status: TuiNotification.Error,
            });
          }
          return of({});
        })
      )
      .subscribe();
  }

  private formValidator(value: FormModel) {
    return sameGroupStaticValueValidator(value, {
      start: (a, b) => (!!a && !!b && a.daySame(b)) || a === b,
      end: (a, b) => (!!a && !!b && a.daySame(b)) || a === b,
      startTime: (a, b, control) => {
        if (control?.get('isAllDay')?.value) {
          return true;
        }
        return a?.valueOf() === b?.valueOf();
      },
      endTime: (a, b, control) => {
        if (control?.get('isAllDay')?.value) {
          return true;
        }
        return a?.valueOf() === b?.valueOf();
      },
    });
  }

  private getStartAndEnd(): {
    start: GoogleDateTime;
    end: GoogleDateTime;
  } {
    let start, end;
    if (this.isAllDayControlValue) {
      start = { date: this.startDate };
      end = { date: this.endDate };
    } else {
      start = { dateTime: this.startTime };
      end = { dateTime: this.endTime };
    }

    return {
      start: {
        ...start,
        timeZone: '+07:00',
      },
      end: {
        ...end,
        timeZone: '+07:00',
      },
    };
  }
}
