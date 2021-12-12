import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '@services/schedule.service';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { beautifyTime } from 'src/shared/helpers';

@Component({
  selector: 'tss-exam-dialog',
  templateUrl: './exam-dialog.component.html',
  styleUrls: ['./exam-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamDialogComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public updating = false;
  public initialNote?: string;
  public readonly notAllowFieldHint =
    'Không thể thay đổi thông tin của lịch thi';
  public readonly noteMaxLength = 1000;

  /** GETTERS */
  public get note(): string {
    return this.form.get('note')?.value as string;
  }

  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<string, Record<string, unknown>>,
    private scheduleService: ScheduleService,
    private fb: FormBuilder
  ) {
    this.initForm(context.data);
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    const id = this.form.get('id')?.value as number;
    const note = this.form.get('note')?.value as string;

    if (id) {
      this.updating = true;
      this.scheduleService.updateNote({ id, note }).subscribe(
        () => {
          this.updating = false;
          this.context.completeWith(note);
        },
        () => {
          this.updating = false;
          this.onCancel();
        }
      );
    } else {
      this.onCancel();
    }
  }

  public onCancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  /** PRIVATE METHODS */
  private initForm(data?: Record<string, unknown>): void {
    const startDate = data?.StartDate as Date;
    const endDate = data?.StartDate as Date;
    const today = new Date();
    this.initialNote = data?.Note as string;

    this.form = this.fb.group({
      id: [data?.Id],
      subject: [data?.Subject],
      location: [data?.Location],
      method: [data?.Method],
      start: [
        [
          startDate
            ? new TuiDay(
                startDate.getFullYear(),
                startDate.getMonth(),
                startDate.getDate()
              )
            : new TuiDay(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              ),
          beautifyTime(startDate ?? today),
        ],
      ],
      end: [
        [
          endDate
            ? new TuiDay(
                endDate.getFullYear(),
                endDate.getMonth(),
                endDate.getDate()
              )
            : new TuiDay(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              ),
          beautifyTime(endDate ?? today),
        ],
      ],
      allDay: [data?.AllDay ?? false],
      description: [data?.Description],
      note: [this.initialNote, Validators.maxLength(this.noteMaxLength)],
    });
  }
}
