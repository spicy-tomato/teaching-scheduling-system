import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TuiDialogContext } from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { DateHelper } from '@shared/helpers';
import { EjsScheduleModel } from 'src/shared/models';
import { sameGroupStaticValueValidator } from 'src/shared/validators';
import { ExamService } from '@services/exam.service';
import { CoreConstant } from '@shared/constants';
import { Store } from '@ngrx/store';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Subject } from 'rxjs';
import { takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { BaseComponent } from '@modules/core/base/base.component';

@Component({
  templateUrl: './exam-editor-dialog.component.html',
  styleUrls: ['./exam-editor-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamEditorDialogComponent extends BaseComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;
  public showLoader = false;
  public readonly notAllowFieldHint =
    'Không thể thay đổi thông tin của lịch thi';
  public readonly noteMaxLength = CoreConstant.NOTE_MAX_LENGTH;
  public readonly submit$ = new Subject<void>();

  /** PRIVATE PROPERTIES */
  private teacher$ = this.appShellStore.pipe(
    fromAppShell.selectNotNullTeacher,
    takeUntil(this.destroy$)
  );

  /** GETTERS */
  public get idControl(): FormControl {
    return this.form.controls['id'] as FormControl;
  }

  public get peopleControl(): FormArray {
    return this.form.controls['people'] as FormArray;
  }

  public get noteControl(): FormControl {
    return (this.form.controls['change'] as FormGroup).controls[
      'note'
    ] as FormControl;
  }

  /** CONSTRUCTOR */
  constructor(
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<string, EjsScheduleModel>,
    private readonly examService: ExamService,
    private readonly fb: FormBuilder,
    private readonly appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.submit$]);

    this.initForm(context.data);
    this.handleSubmit();
  }

  /** PUBLIC METHODS */
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

  // TODO: Move to component store
  private handleSubmit(): void {
    this.submit$
      .pipe(
        withLatestFrom(this.teacher$),
        tap(({ 1: teacher }) => {
          const id = this.idControl.value as number;
          const note = this.noteControl.value as string;

          if (id) {
            this.showLoader = true;
            this.examService.updateExamNote(teacher.id, id, { note }).subscribe(
              () => {
                this.showLoader = false;
                setTimeout(() => {
                  this.context.completeWith(note);
                });
              },
              () => {
                this.showLoader = false;
                this.onCancel();
              }
            );
          } else {
            this.onCancel();
          }
        })
      )
      .subscribe();
  }
}
