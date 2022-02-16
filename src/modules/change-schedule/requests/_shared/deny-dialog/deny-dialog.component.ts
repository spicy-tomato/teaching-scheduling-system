import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ChangeSchedule } from '@shared/models';
import {
  TuiAppearance,
  TuiDialogContext,
  TUI_BUTTON_OPTIONS,
  TUI_TEXTFIELD_APPEARANCE,
} from '@taiga-ui/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import * as fromRequests from '../../state';

@Component({
  templateUrl: './deny-dialog.component.html',
  styleUrls: ['./deny-dialog.component.scss'],
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
    {
      provide: TUI_TEXTFIELD_APPEARANCE,
      useValue: TuiAppearance.Textfield,
    },
  ],
})
export class DenyDialogComponent {
  /** PUBLIC PROPERTIES */
  public form!: FormGroup;

  /** CONSTRUCTOR */
  constructor(
    private readonly fb: FormBuilder,
    private readonly store: Store<fromRequests.RequestsState>,
    @Inject(POLYMORPHEUS_CONTEXT)
    private readonly context: TuiDialogContext<void, ChangeSchedule>
  ) {
    this.initForm();
  }

  /** PUBLIC METHODS */
  public confirm(): void {
    const reason = this.form.controls['reason'].value as string;
    this.store.dispatch(
      fromRequests.deny({ schedule: this.context.data, reason })
    );
    this.cancel();
  }

  public cancel(): void {
    this.context.$implicit.complete();
  }

  /** PRIVATE METHODS */
  private initForm(): void {
    this.form = this.fb.group({
      reason: ['', Validators.required],
    });
  }
}
