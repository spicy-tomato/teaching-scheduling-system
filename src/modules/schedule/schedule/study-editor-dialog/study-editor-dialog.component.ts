import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { EjsScheduleModel } from '@models/schedule/ejs-schedule.model';
import { ScheduleService } from '@services/schedule.service';
import { TuiDay } from '@taiga-ui/cdk';
import { TuiDialogContext } from '@taiga-ui/core';
import { DateHelper } from 'src/shared/helpers/date.helper';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './study-editor-dialog.component.html',
  styleUrls: ['./study-editor-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyEditorDialogComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public updating = false;
  public initialNote?: string;
  public readonly noteMaxLength = 1000;

  /** GETTERS */
  public get people(): FormArray | null {
    return this.form.get('people') as FormArray;
  }

  public get note(): AbstractControl | null {
    return this.form.get('note');
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
  private initForm(data?: EjsScheduleModel): void {
    const startDate = data?.StartTime as Date;
    const endDate = data?.EndTime as Date;
    const today = new Date();
    this.initialNote = data?.Note as string;

    this.form = this.fb.group({
      id: [data?.Id],
      subject: [data?.Subject],
      location: [data?.Location],
      method: [data?.Method],
      people: this.fb.array(data?.People?.map((x) => this.fb.control(x)) ?? []),
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
          DateHelper.beautifyTime(startDate ?? today),
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
          DateHelper.beautifyTime(endDate ?? today),
        ],
      ],
      allDay: [data?.IsAllDay ?? false],
      description: [data?.Description],
      note: [this.initialNote, Validators.maxLength(this.noteMaxLength)],
    });
  }
}