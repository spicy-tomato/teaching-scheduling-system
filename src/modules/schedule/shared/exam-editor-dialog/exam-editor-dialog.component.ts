import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from '@services/schedule.service';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { DateHelper } from '@shared/helpers';
import { EjsScheduleModel, Nullable } from 'src/shared/models';
import { sameGroupStaticValueValidator } from 'src/shared/validators';

@Component({
  templateUrl: './exam-editor-dialog.component.html',
  styleUrls: ['./exam-editor-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamEditorDialogComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public showLoader = false;
  public readonly notAllowFieldHint =
    'Không thể thay đổi thông tin của lịch thi';
  public readonly noteMaxLength = 1000;

  /** GETTERS */
  public get people(): Nullable<FormArray> {
    return this.form.get('people') as FormArray;
  }

  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<string, EjsScheduleModel>,
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
      this.showLoader = true;
      this.scheduleService.updateExamNote({ id, note }).subscribe(
        () => {
          this.showLoader = false;
          this.context.completeWith(note);
        },
        () => {
          this.showLoader = false;
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
      note: data?.Note,
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
        {
          validators: sameGroupStaticValueValidator(initialChange),
        }
      ),
    });
  }
}
