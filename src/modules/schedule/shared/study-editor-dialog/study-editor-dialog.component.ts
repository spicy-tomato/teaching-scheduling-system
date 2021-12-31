import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ScheduleService } from '@services/schedule.service';
import {
  TuiAppearance,
  TuiDialogContext,
  TUI_BUTTON_OPTIONS,
} from '@taiga-ui/core';
import { DateHelper } from 'src/shared/helpers/date.helper';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { EjsScheduleModel, Nullable } from 'src/shared/models';
import { CoreConstant } from '@constants/core/core.constant';

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
  public sending = false;
  public initialNote?: string;
  public validRequestChangeSchedule = true;

  public readonly shifts = CoreConstant.SHIFTS;
  public readonly shiftKeys = Object.keys(CoreConstant.SHIFTS);
  public readonly noteMaxLength = 1000;

  /** GETTERS */
  public get people(): Nullable<AbstractControl> {
    return this.form.get('people');
  }

  public get note(): Nullable<AbstractControl> {
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
      this.sending = true;
      this.scheduleService.updateNote({ id, note }).subscribe(
        () => {
          this.sending = false;
          this.context.completeWith(note);
        },
        () => {
          this.sending = false;
          this.onCancel();
        }
      );
    } else {
      this.onCancel();
    }
  }

  public onClickRequestingChangeSchedule(): void {
    this.requestingChangeSchedule = true;
  }

  public onClickCancelRequestingChangeSchedule(): void {
    this.requestingChangeSchedule = false;
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
    this.initialNote = data?.Note as string;

    this.form = this.fb.group({
      id: [data?.Id],
      subject: [data?.Subject],
      location: [data?.Location],
      people: [data?.People?.[0]],
      start: [[startTuiDate, DateHelper.beautifyTime(startDate ?? today)]],
      end: [[endTuiDate, DateHelper.beautifyTime(endDate ?? today)]],
      note: [this.initialNote, Validators.maxLength(this.noteMaxLength)],
      shift: [data?.Shift ?? '1'],
      date: [startTuiDate],
    });

    this.validRequestChangeSchedule = startDate > new Date();
  }
}
