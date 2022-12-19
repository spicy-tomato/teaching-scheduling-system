import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TuiTime } from '@taiga-ui/cdk';
import { TuiAlertService, TuiDialogContext } from '@taiga-ui/core';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { GoogleCalendarModel } from '@teaching-scheduling-system/web/shared/data-access/models';
import { sameGroupStaticValueValidator } from '@teaching-scheduling-system/web/shared/utils/validators';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { map } from 'rxjs';
import { ExamDialogStore } from '../../../exam-dialog/data-access/src/lib/store';

@Component({
  templateUrl: './google-event-dialog.component.html',
  styleUrls: ['./google-event-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GoogleEventDialogComponent {
  // PUBLIC PROPERTIES
  readonly showLoader$ = this.store.status$.pipe(map((s) => s === 'loading'));
  readonly readOnly: boolean;
  form!: FormGroup;

  // PRIVATE PROPERTIES
  private needUpdateAfterClose = false;

  // CONSTRUCTOR
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      GoogleCalendarModel | void,
      GoogleCalendarModel
    >,
    private readonly fb: FormBuilder,
    @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
    private readonly store: ExamDialogStore
  ) {
    this.initForm(context.data);
    // TODO: Remove 
    this.readOnly = true;
      // context.data.Calendar.accessRole === 'freeBusyReader' ||
      // context.data.Calendar.accessRole === 'reader';
  }

  // PUBLIC METHODS
  submit(): void {
    // this.store.submit({
    //   id: this.idControl.value,
    //   note: this.noteControl.value,
    // });
  }

  onCancel(): void {
    setTimeout(() => {
      if (this.needUpdateAfterClose) {
        this.context.completeWith(this.context.data);
      } else {
        this.context.$implicit.complete();
      }
    });
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

    const initialChange = {
      id: data.Id,
      subject: data.Subject,
      location: data.Location,
      // people: this.fb.array(data.People.map((x) => this.fb.control(x)) ?? []),
      start: startTuiDate,
      end: endTuiDate,
      startTime: TuiTime.fromLocalNativeDate(startDate ?? today),
      endTime: TuiTime.fromLocalNativeDate(endDate ?? today),
      note: data.Note ?? '',
      isAllDay: data.IsAllDay,
    };

    this.form = this.fb.group(
      {
        ...Object.entries(initialChange).reduce<Record<string, any[]>>(
          (acc, [key, value]) => {
            acc[key] = [value];
            return acc;
          },
          {}
        ),
      },
      {
        validators: sameGroupStaticValueValidator(initialChange, {
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
        }),
      }
    );
  }
}
