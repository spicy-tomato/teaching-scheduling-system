import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { TuiDay, TuiDestroyService } from '@taiga-ui/cdk';
import { CoreConstant } from '@teaching-scheduling-system/core/data-access/constants';
import { Nullable } from '@teaching-scheduling-system/core/data-access/models';
import { DateHelper } from '@teaching-scheduling-system/core/utils/helpers';
import { TeachingDialogStore } from '@teaching-scheduling-system/web/calendar/dialogs/teaching-dialog/data-access';
import {
  SimpleModel,
  Teacher,
} from '@teaching-scheduling-system/web/shared/data-access/models';
import { map, Observable, Subject, takeUntil, tap, withLatestFrom } from 'rxjs';

@Component({
  selector: 'tss-teaching-dialog-request-change',
  templateUrl: './teaching-dialog-request-change.component.html',
  styleUrls: ['./teaching-dialog-request-change.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [TuiDestroyService],
})
export class TeachingDialogRequestChangeComponent implements OnInit {
  // INPUT
  @Input() isPersonal!: boolean;
  @Input() people?: string[] | SimpleModel[];

  // PUBLIC PROPERTIES
  form!: FormGroup;

  readonly rooms$: Observable<string[]>;
  readonly changeRequest$ = new Subject<void>();
  readonly shiftKeys = Object.keys(CoreConstant.SHIFTS);
  readonly CoreConstant = CoreConstant;
  readonly roomMatcher = (item: string): boolean => item !== 'PTTT';

  // PRIVATE PROPERTIES
  private readonly teacher$: Observable<Nullable<Teacher>>;

  // GETTERS
  private get shiftControlValue(): string {
    return this.form.controls['shift'].value as string;
  }

  private get dateControlValue(): TuiDay {
    return this.form.controls['date'].value as TuiDay;
  }

  // CONSTRUCTOR
  constructor(
    private readonly controlContainer: ControlContainer,
    private readonly store: TeachingDialogStore,
    private readonly destroy$: TuiDestroyService
  ) {
    this.rooms$ = store.rooms$;
    this.teacher$ = store.teacher$;

    this.handleChangeRequest();
  }

  // LIFECYCLE
  ngOnInit(): void {
    this.form = this.controlContainer.control as FormGroup;
  }

  // PRIVATE METHODS
  private handleChangeRequest(): void {
    this.changeRequest$
      .pipe(
        withLatestFrom(this.teacher$),
        map(({ 1: teacher }) => teacher),
        tap((teacher) => {
          if (this.form.errors?.['sameValue'] || !this.dateControlValue) {
            return;
          }

          const date = DateHelper.toDateOnlyString(
            this.dateControlValue.toUtcNativeDate()
          );
          const payload = {
            date: [date, date].join(),
            shift:
              this.shiftControlValue[0] === '5'
                ? ['5_1', '5_2'].join()
                : this.shiftControlValue,
          };
          const teacherId =
            (this.isPersonal
              ? teacher?.id
              : (this.people?.[0] as Teacher).id) || '';

          this.store.search({ payload, teacherId });
        }),
        takeUntil(this.destroy$)
      )
      .subscribe();
  }
}
