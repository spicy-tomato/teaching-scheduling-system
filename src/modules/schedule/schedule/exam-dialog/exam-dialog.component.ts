import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogService, TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { beautifyTime } from 'src/helpers';

@Component({
  selector: 'tss-exam-dialog',
  templateUrl: './exam-dialog.component.html',
  styleUrls: ['./exam-dialog.component.scss'],
})
export class ExamDialogComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public readonly notAllowFieldHint =
    'Không thể thay đổi thông tin này lịch thi';

  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<
      Record<string, unknown> | null,
      Record<string, unknown>
    >,
    private fb: FormBuilder
  ) {
    this.initForm(context.data);
  }

  /** PUBLIC METHODS */
  public onSubmit(): void {
    this.context.completeWith(this.form.value);
  }

  public onCancel(): void {
    this.context.completeWith(null);
  }

  /** PRIVATE METHODS */
  private initForm(data?: Record<string, unknown>): void {
    const startDate = data?.StartDate as Date;
    const endDate = data?.StartDate as Date;
    const today = new Date();

    this.form = this.fb.group({
      subject: new FormControl(data?.Subject),
      location: new FormControl(data?.Location),
      start: new FormControl([
        startDate
          ? new TuiDay(
              startDate.getFullYear(),
              startDate.getMonth(),
              startDate.getDate()
            )
          : new TuiDay(today.getFullYear(), today.getMonth(), today.getDate()),
        beautifyTime(startDate ?? today),
      ]),
      end: new FormControl([
        endDate
          ? new TuiDay(
              endDate.getFullYear(),
              endDate.getMonth(),
              endDate.getDate()
            )
          : new TuiDay(today.getFullYear(), today.getMonth(), today.getDate()),
        beautifyTime(endDate ?? today),
      ]),
      allDay: new FormControl(data?.AllDay ?? false),
      description: new FormControl(data?.Description),
      note: new FormControl(data?.Note),
    });
  }
}
