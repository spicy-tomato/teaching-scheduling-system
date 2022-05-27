import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { CoreConstant } from '@shared/constants';
import { Observable, Subject } from 'rxjs';
import * as fromAppShell from '@modules/core/components/app-shell/state';
import { Store } from '@ngrx/store';
import { BaseComponent } from '@modules/core/base/base.component';
import { map, takeUntil, tap, withLatestFrom } from 'rxjs/operators';
import { ControlContainer, FormGroup } from '@angular/forms';
import { DateHelper } from '@shared/helpers';
import { Nullable, SimpleModel, Teacher } from '@shared/models';
import { TuiDay } from '@taiga-ui/cdk';
import * as fromStudyEditorDialog from '../state';

@Component({
  selector: 'tss-study-editor-request-change',
  templateUrl: './study-editor-request-change.component.html',
  styleUrls: ['./study-editor-request-change.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudyEditorRequestChangeComponent
  extends BaseComponent
  implements OnInit
{
  /** INPUT */
  @Input() public isPersonal!: boolean;
  @Input() public people?: string[] | SimpleModel[];

  /** PUBLIC PROPERTIES */
  public form!: FormGroup;

  public readonly rooms$: Observable<string[]>;
  public readonly changeRequest$ = new Subject();
  public readonly shiftKeys = Object.keys(CoreConstant.SHIFTS);
  public readonly CoreConstant = CoreConstant;
  public readonly roomMatcher = (item: string): boolean => item !== 'PTTT';

  /** PRIVATE PROPERTIES */
  private readonly teacher$: Observable<Nullable<Teacher>>;

  /** GETTERS */
  private get shiftControlValue(): string {
    return this.form.controls['shift'].value as string;
  }

  private get dateControlValue(): TuiDay {
    return this.form.controls['date'].value as TuiDay;
  }

  /** CONSTRUCTOR */
  constructor(
    private readonly controlContainer: ControlContainer,
    private readonly store: Store<fromStudyEditorDialog.StudyEditorDialogState>,
    appShellStore: Store<fromAppShell.AppShellState>
  ) {
    super();

    this.assignSubjects([this.changeRequest$]);

    this.teacher$ = appShellStore
      .select(fromAppShell.selectTeacher)
      .pipe(takeUntil(this.destroy$));
    this.rooms$ = appShellStore
      .select(fromAppShell.selectRooms)
      .pipe(takeUntil(this.destroy$));

    this.handleChangeRequest();
  }

  /** LIFE CYCLE */
  public ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }

  /** PRIVATE METHODS */
  private handleChangeRequest(): void {
    this.changeRequest$
      .pipe(
        withLatestFrom(this.teacher$),
        map(({ 1: teacher }) => teacher),
        tap((teacher) => {
          if (this.form.errors?.sameValue || !this.dateControlValue) {
            return;
          }

          const date = DateHelper.toDateOnlyString(
            this.dateControlValue.toUtcNativeDate()
          );

          this.store.dispatch(
            fromStudyEditorDialog.search({
              params: {
                date: [date, date].join(),
                shift:
                  this.shiftControlValue[0] === '5'
                    ? ['5_1', '5_2'].join()
                    : this.shiftControlValue,
              },
              teacherId:
                (this.isPersonal
                  ? teacher?.id
                  : (this.people?.[0] as Teacher).id) || '',
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
