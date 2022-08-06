import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import {
  TuiAppearance,
  tuiButtonOptionsProvider,
  TuiDialogContext,
  TUI_TEXTFIELD_APPEARANCE,
} from '@taiga-ui/core';
import { ChangeSchedule } from '@teaching-scheduling-system/web/shared/data-access/models';
import {
  teachingScheduleRequestDeny,
  TeachingScheduleRequestState,
} from '@teaching-scheduling-system/web/teaching-schedule/data-access';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';

@Component({
  templateUrl: './change-deny-dialog.component.html',
  styleUrls: ['./change-deny-dialog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    tuiButtonOptionsProvider({
      appearance: 'primary',
      size: 'm',
    }),
    {
      provide: TUI_TEXTFIELD_APPEARANCE,
      useValue: TuiAppearance.Textfield,
    },
  ],
})
export class ChangeDenyDialogComponent {
  // PUBLIC PROPERTIES 
  form!: FormGroup;

  // CONSTRUCTOR 
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<TeachingScheduleRequestState>,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, ChangeSchedule>
  ) {
    this.initForm();
  }

  // PUBLIC METHODS 
  confirm(): void {
    const reason = this.form.controls['reason'].value as string;
    this.store.dispatch(
      teachingScheduleRequestDeny({ schedule: this.context.data, reason })
    );
    this.cancel();
  }

  cancel(): void {
    setTimeout(() => {
      this.context.$implicit.complete();
    });
  }

  // PRIVATE METHODS 
  private initForm(): void {
    this.form = this.fb.group({
      reason: ['', Validators.required],
    });
  }
}
